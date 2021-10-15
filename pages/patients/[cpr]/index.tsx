import { CircularProgress,Tooltip, Divider, Grid, Typography, CardHeader } from '@material-ui/core';
import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
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
import { Avatar, BottomNavigation, BottomNavigationAction, IconButton, List, ListItem, ListItemAvatar, Stack } from '@mui/material';
import HealingIcon from '@mui/icons-material/Healing';
import { useContext } from 'react';
import { PatientCareplan } from '../../../components/Models/PatientCareplan';
import { LoadingComponent } from '../../../components/Layout/LoadingComponent';
import ApiContext from '../../_context';
import { PatientDetail } from '../../../components/Models/PatientDetail';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { PatientCard } from '../../../components/Cards/PatientCard';
import AddCircleIcon from '@mui/icons-material/AddCircle';

interface State {
  
  loading: boolean
  careplans : PatientCareplan[]
}
interface Props {
    match : { params : {cpr : string} }
}
export default class PatientCareplans extends React.Component<Props,State> {
  static contextType = ApiContext

  constructor(props : Props){
    super(props);
    this.state = {
        loading : true,
        careplans : []
    }
}

  render () {
    let contents = this.state.loading ? <LoadingComponent/> : this.renderCareplanTab();
    return contents;
  }


  componentDidMount(){
    this.populateCareplans()
}


async populateCareplans() {
  
  let cpr = this.props.match.params.cpr
  let responses = await this.context.backendApi.GetPatientCareplans(cpr)
  this.setState({
      careplans : responses,
      loading : false
  });
}


  //=====================TABS===============================

  renderCareplanTab(){
    let careplans = this.state.careplans;
    if(careplans.length == 0)
        return (
            <div>Ingen behandlingsplaner fundet :-(</div>
        )

    return (
        <>
        {careplans.map(careplan=>{
            return (
                <>
                
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
                                    <AssignmentIcon />
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
                                    secondary={<Button component={Link} color="inherit" to={"/patients/"+this.props.match.params.cpr + "/questionnaires/"+questionnaire.id} size="small">Se besvarelser</Button>}
                                />
                                </ListItem>
                            
                            </>
                        )
                    }) : "Ingen spørgeskemaer"}
                    </List>
                    </CardContent>
                    <CardActions>
                    </CardActions>
                </Card>
                </Stack>
                </>
            )
        })}
        </>
    )
    
  }


  
  }
  