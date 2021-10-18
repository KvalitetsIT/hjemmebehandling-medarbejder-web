import { CircularProgress,Tooltip, Divider, Grid, Typography, CardHeader } from '@material-ui/core';
import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import { useParams,Link } from 'react-router-dom';
import { FormatItalic } from '@mui/icons-material';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Paper from '@mui/material/Paper';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';

import ContentCut from '@mui/icons-material/ContentCut';
import Slider from '@mui/material/Slider';
import ContentCopy from '@mui/icons-material/ContentCopy';
import ContentPaste from '@mui/icons-material/ContentPaste';
import { Alert, Avatar, BottomNavigation, BottomNavigationAction, Chip, IconButton, List, ListItem, ListItemAvatar, Stack } from '@mui/material';
import HealingIcon from '@mui/icons-material/Healing';
import { useContext } from 'react';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ButtonGroup from '@mui/material/ButtonGroup';
import Button from '@mui/material/Button';
import GroupIcon from '@mui/icons-material/Group';
import { withRouter } from "next/router"
import { PatientCard } from '../../../../../components/Cards/PatientCard';
import { PatientCareplan } from '../../../../../components/Models/PatientCareplan';
import ApiContext from '../../../../_context';
import { LoadingComponent } from '../../../../../components/Layout/LoadingComponent';
import { CareplanTimeline } from '../../../../../components/Timelines/CareplanTimeline';

interface State {
  
  loading: boolean
  activeCareplan : PatientCareplan
  careplans : PatientCareplan[]
}
interface Props {
    match : { params : {cpr : string, careplanId : string} }

}
class PatientCareplans extends React.Component<Props,State> {
  static contextType = ApiContext

  constructor(props : Props){
    super(props);
    this.changeCareplan = this.changeCareplan.bind(this);
    this.state = {
        loading : true,
        careplans : [],
        activeCareplan : new PatientCareplan() //overriden in async
    }
}

  render () {
    let contents = this.state.loading ? <LoadingComponent/> : this.renderCareplanTab();
    return contents;
  }

  componentDidMount(){
    this.populateCareplans()
}

changeCareplan(careplan : PatientCareplan){
    this.setState({
        activeCareplan : careplan
    })
}

async populateCareplans() {
  let cpr = this.props.match.params.cpr;
  let id = this.props.match.params.careplanId;

  let responses : PatientCareplan[] = await this.context.backendApi.GetPatientCareplans(cpr);
  let activeCareplan = responses.find(x=>{
      console.log(x.id +"=="+id)
      return x.id === id
  } );
  console.log(responses)
  this.setState({
      careplans : responses,
      loading : false,
      activeCareplan : activeCareplan ? activeCareplan : responses[0]

  });
}


  //=====================TABS===============================

  renderCareplanTab(){
    let careplans = this.state.careplans;
    if(careplans.length == 0)
        return (
            <div>Ingen behandlingsplaner fundet :-(</div>
        )
    let careplan = this.state.activeCareplan
    return (
        <>
        <Stack spacing={2} paddingBottom={2}>


               

                <Card>
                    <CardContent>
                        <CareplanTimeline careplanClicked={this.changeCareplan} activeCareplan={this.state.activeCareplan} careplans={this.state.careplans}/>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent>
                        <Stack>
                            
                        <Typography variant="h4">Behandlingsplan {
                            careplan.terminationDate ? 
                                <Chip label="Ikke aktiv plan" color="info"  /> : 
                                <Chip label="Aktiv plan" color="success" /> } </Typography>
                        <Typography variant="overline">Id : {careplan.id}</Typography>
                        <Typography variant="overline">Oprettet : {careplan.creationDate.toLocaleDateString()}</Typography>
                        
                        {careplan.terminationDate ? <Typography variant="overline">Afsluttet : {careplan.terminationDate.toLocaleDateString()}</Typography> : "" }
                        
                        
                        </Stack>

                    </CardContent>
                </Card>
                
                </Stack>

                <Stack direction="row" spacing={2}>
                
                <PatientCard patient={careplan.patient}></PatientCard>
                
                <Card>
                    <CardHeader title="Patientgrupper"/>
                    <CardContent>
                    <List>
                        {careplan.planDefinitions.map(planDefinition => {
                        return (
                            <>
                            
                                <ListItem>
                                <ListItemAvatar>
                                    <Avatar>
                                    <GroupIcon />
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={planDefinition.name}
                                    secondary={<Button  color="inherit" size="small">Se standard</Button>}
                                />
                                </ListItem>
                            
                            </>
                        )
                    })}
                    </List>
                    </CardContent>
                    <CardActions>
                        <Button>Tilføj ny patientgruppe</Button>
                    </CardActions>
                  
                </Card>

                <Card>
                    <CardHeader title="Spørgeskemaer"/>
                    <CardContent>
                    <List>
                        {careplan.questionnaires.length > 0 ? careplan.questionnaires.map(questionnaire => {
                        return (
                            <>
                            
                                <ListItem>
                                <ListItemAvatar>
                                    <Avatar>
                                    <AssignmentIcon />
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={questionnaire.name}
                                    secondary={<Button component={Link} color="inherit" to={"/patients/"+this.props.match.params.cpr + "/careplans/"+careplan.id+"/questionnaires/"+questionnaire.id} size="small">Se besvarelser</Button>}
                                />
                                </ListItem>
                            
                            </>
                        )
                    }) : "Ingen spørgeskemaer"}
                    </List>
                    </CardContent>
                    <CardActions>
                        <Button>Tilføj spørgeskema</Button>
                    </CardActions>
                </Card>
                
                </Stack>
                <Stack direction="row" paddingTop={2}>
                <ButtonGroup variant="contained" aria-label="outlined button group">
                    <Button color="error">Afslut behandlingsplan</Button>
                </ButtonGroup>
                </Stack>
                
                </>
            )
    
    
  }


  
  }
  export default PatientCareplans;