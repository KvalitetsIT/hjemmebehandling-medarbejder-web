import { CardHeader, CircularProgress, Divider, Grid, Tooltip, Typography } from '@material-ui/core';
import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import { useParams } from 'react-router-dom';
import { IBackendApi } from '../../apis/IBackendApi';
import { PatientDetail } from '../../components/Models/PatientDetail';
import { Contact } from '../Models/Contact';
import { Component } from 'react';
import StarIcon from '@mui/icons-material/Star';
import ContactPageIcon from '@mui/icons-material/ContactPage';
import { PatientCareplan } from '../Models/PatientCareplan';
import { PlanDefinition } from '../Models/PlanDefinition';
import { PlanDefinitionSelect } from '../Input/PlanDefinitionSelect';
import ICareplanService from '../../services/interfaces/ICareplanService';
import ApiContext from '../../pages/_context';
import { LoadingComponent } from '../Layout/LoadingComponent';
import ModeEditOutlineIcon from '@mui/icons-material/ModeEditOutline';
import { Stack } from '@mui/material';

export interface Props {
    careplan : PatientCareplan
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

initializeServices(){
    
    this.careplanService = this.context.careplanService
    console.log("ini!")
    console.log(this.careplanService)
  }
 
  async savePlandefinition(){
    console.log("saving!!")
    console.log(this.careplanService)

    let newCareplan = await this.careplanService.SetPlanDefinitionsOnCareplan(this.state.editableCareplan);
    this.props.careplan.planDefinitions = newCareplan.planDefinitions;

  }

  async resetPatientCareplan(){
    this.state.editableCareplan.planDefinitions = this.props.careplan.planDefinitions;
}

  setEditedCareplan(careplan : PatientCareplan){
    this.setState({editableCareplan : careplan})
  }

  
  async saveInformation(){
      this.setState({saving_loading : true})
    await this.savePlandefinition();

    this.setState({editMode : false,saving_loading : false})
    this.forceUpdate();
  }

  async resetInformation(){
    this.setState({
        editableCareplan : this.props.careplan
    })
    await this.resetPatientCareplan()

    this.setState({editMode : false})
    this.forceUpdate();
  }

  render () {
      this.initializeServices();
      let careplan = this.state.editableCareplan
    return (
        <>
        {this.state.saving_loading ? <LoadingComponent/> : ""}
        <Card component={Box} minWidth={100}>
            {careplan.terminationDate ? 
                <CardHeader title={<Typography variant="h6">Inaktiv monitoreringsplan</Typography>}/> :
                <CardHeader title={
                    <>
                    <Stack direction="row">
                    
                    <Typography variant="h6">Igangværende monitoreringsplan</Typography>
                    <Box textAlign="right">{this.state.editMode ? "" : <Button onClick={ () => this.setState({editMode : true})}>Ændr<ModeEditOutlineIcon fontSize="inherit"/></Button>}</Box>
                    </Stack>
                    </>
                    }
           /> }
            
            <CardContent>
            
            <Grid container spacing={2}>
                <Grid item xs={3}>
                   <Typography variant="caption">Adeling</Typography>
                   <Typography>{this.props.careplan.department}</Typography>
                </Grid>
                <Grid item xs={3}>
                    <Typography variant="caption">Patientgrupper</Typography>
                    {this.state.editMode ? 
                        <Typography><PlanDefinitionSelect SetEditedCareplan={this.setEditedCareplan} careplan={careplan}/></Typography>
                        :
                        careplan.planDefinitions.map(planDefinition => (<Typography> {planDefinition.name}</Typography>))
                    }
                   
                   
                </Grid>
                <Grid item xs={3}>
                    <Typography variant="caption">Opstart</Typography>
                   <Typography>{careplan.creationDate.toLocaleDateString()+" "+careplan.creationDate.toLocaleTimeString()}</Typography>
                </Grid>
                <Grid item xs={3}>
                    <Typography variant="caption">Stoppet</Typography>
                    {!careplan.terminationDate ? 
                    <Typography> - </Typography> : 
                    <Typography>{careplan.terminationDate?.toLocaleDateString()+" "+careplan.terminationDate?.toLocaleTimeString()}</Typography>
                    }
                   
                </Grid>
            </Grid>
            
            {this.state.editMode ? 
                <Box textAlign="left">
                    <Button onClick={async ()=>await this.saveInformation()} variant="outlined" color="success">
                        Gem
                    </Button>
                    <Button onClick={async ()=>await this.resetInformation()} color="info">Fortryd</Button>
                </Box> : ""
            }
            
            </CardContent>
        </Card>
        
        </>
    );
  }
}
