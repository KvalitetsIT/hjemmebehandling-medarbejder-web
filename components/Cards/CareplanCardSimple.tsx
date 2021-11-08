import { CardHeader, Typography } from '@material-ui/core';
import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import { Component } from 'react';
import { PatientCareplan } from '../Models/PatientCareplan';
import { PlanDefinitionSelect } from '../Input/PlanDefinitionSelect';
import ICareplanService from '../../services/interfaces/ICareplanService';
import ApiContext from '../../pages/_context';
import { LoadingComponent } from '../Layout/LoadingComponent';
import ModeEditOutlineIcon from '@mui/icons-material/ModeEditOutline';
import { Stack } from '@mui/material';

export interface Props {
    careplan : PatientCareplan
    specialSaveFunc? : (careplan : PatientCareplan) => void
}

export interface State {
    saving_loading: boolean
    editMode : boolean
    editableCareplan : PatientCareplan
}

export class CareplanCardSimple extends Component<Props,State> {
  static displayName = CareplanCardSimple.name;
  static contextType = ApiContext
  
    careplanService! : ICareplanService

  constructor(props:Props){
    super(props);
    this.state = {
      editableCareplan : props.careplan,
      editMode : false,
      saving_loading : false
    }
    this.setEditedCareplan = this.setEditedCareplan.bind(this);
}

initializeServices() : void {
    
    this.careplanService = this.context.careplanService

  }
 
  async savePlandefinition() : Promise<void>{
    const newCareplan = await this.careplanService.SetPlanDefinitionsOnCareplan(this.state.editableCareplan);
    this.props.careplan.planDefinitions = newCareplan.planDefinitions;

  }

  async resetPatientCareplan(): Promise<void>{
    this.state.editableCareplan.planDefinitions = this.props.careplan.planDefinitions;
}

  setEditedCareplan(careplan : PatientCareplan): void{
    this.setState({editableCareplan : careplan})
  }

  
  async saveInformation() : Promise<void>{

    this.setState({saving_loading : true})

    if(this.props.specialSaveFunc){
        this.props.specialSaveFunc(this.state.editableCareplan);
        this.setState({editMode : false,saving_loading : false})
        return;
    }
    
    
    await this.savePlandefinition();

    this.setState({editMode : false,saving_loading : false})
    this.forceUpdate();
  }

  async resetInformation(): Promise<void>{
    this.setState({
        editableCareplan : this.props.careplan
    })
    await this.resetPatientCareplan()

    this.setState({editMode : false})
    this.forceUpdate();
  }

  render () : JSX.Element{
      this.initializeServices();
      const careplan = this.state.editableCareplan
    return (
        <>
        {this.state.saving_loading ? <LoadingComponent/> : ""}
        <Card component={Box} minWidth={600}>
            {careplan.terminationDate ? 
                <CardHeader subheader={<div>Inaktiv monitoreringsplan</div>}/> :
                <CardHeader subheader={
                    <>
                    <Stack direction="row">
                    
                    <div >Igangværende monitoreringsplan</div>
                    </Stack>
                    </>
                    }
           /> }
            
            <CardContent>

            <Stack direction="row" spacing={10}>
                <Stack>
                   <Typography variant="caption">Adeling</Typography>
                   <Typography>{this.props.careplan.department}</Typography>
                </Stack>
                <Stack >
                    <Typography variant="caption">Patientgrupper</Typography>
                    {this.state.editMode ? 
                        <Typography><PlanDefinitionSelect SetEditedCareplan={this.setEditedCareplan} careplan={careplan}/></Typography>
                        :
                        careplan.planDefinitions.map(planDefinition => (<Typography> {planDefinition.name}</Typography>))
                    }
                   
                   
                </Stack>
                <Stack >
                    <Typography variant="caption">Opstart</Typography>
                   <Typography>{careplan.creationDate ? careplan.creationDate.toLocaleDateString()+" "+careplan.creationDate.toLocaleTimeString() : "N/A"}</Typography>
                </Stack>
                <Stack>
                    <Typography variant="caption">Stoppet</Typography>
                    {!careplan.terminationDate ? 
                    <Typography> - </Typography> : 
                    <Typography>{careplan.terminationDate?.toLocaleDateString()+" "+careplan.terminationDate?.toLocaleTimeString()}</Typography>
                    }
                   
                </Stack>
            </Stack>
            
            
            
            </CardContent>
            <CardActions>
            {this.state.editMode ? 
                <Box textAlign="left">
                    <Button onClick={async ()=>await this.saveInformation()} variant="outlined" color="success">
                        Gem
                    </Button>
                    <Button onClick={async ()=>await this.resetInformation()} color="info">Fortryd</Button>
                </Box> : <Button onClick={ () => this.setState({editMode : true})}>Ændr<ModeEditOutlineIcon fontSize="inherit"/></Button>
            }
            
            </CardActions>
        </Card>
        
        </>
    );
  }
}
