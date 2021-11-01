import { CircularProgress,Tooltip, Divider, Typography, CardHeader } from '@material-ui/core';
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
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import GroupIcon from '@mui/icons-material/Group';
import { withRouter } from "next/router"
import { PatientCard } from '../../../../../components/Cards/PatientCard';
import { PatientCareplan } from '../../../../../components/Models/PatientCareplan';
import ApiContext from '../../../../_context';
import { LoadingComponent } from '../../../../../components/Layout/LoadingComponent';
import { CareplanTimeline } from '../../../../../components/Timelines/CareplanTimeline';
import { CareplanCardSimple } from '../../../../../components/Cards/CareplanCardSimple';
import { CareplanUnreadResponse } from '../../../../../components/Alerts/CareplanUnreadResponse';
import { QuestionnaireCardSimple } from '../../../../../components/Cards/QuestionnaireCardSimple';
import { NumberedChartCard } from '../../../../../components/Cards/NumberedChartCard';
import { ThresholdCardOverview } from '../../../../../components/Cards/ThresholdCardOverview';
import ICareplanService from '../../../../../services/interfaces/ICareplanService';
import { CareplanSelectorCard } from '../../../../../components/Cards/CareplanSelectorCard';

interface State {
  
  loading: boolean
  careplans : PatientCareplan[]
}
interface Props {
    match : { params : {cpr : string, careplanId : string} }

}
class PatientCareplans extends React.Component<Props,State> {
  static contextType = ApiContext
  careplanService! : ICareplanService

  constructor(props : Props){
    super(props);
    this.state = {
        loading : true,
        careplans : []
    }
    
}

  render () {
      this.InitializeServices();
    let contents = this.state.loading ? <LoadingComponent/> : this.renderCareplanTab();
    return contents;
  }
  InitializeServices(){
    this.careplanService = this.context.careplanService;
  }

  componentDidMount(){
    this.populateCareplans()
}


async populateCareplans() {
  let cpr = this.props.match.params.cpr;
  let id = this.props.match.params.careplanId;

  let responses : PatientCareplan[] = await this.careplanService.GetPatientCareplans(cpr);
  console.log(responses)
  this.setState({
      careplans : responses,
      loading : false,

  });
}


  //=====================TABS===============================

  renderCareplanTab(){
    
    let careplans = this.state.careplans;
    if(careplans.length == 0)
        return (
            <div>Ingen behandlingsplaner fundet :-(</div>
        )

    let activeCareplan = this.state.careplans.find(c => c.id == this.props.match.params.careplanId) ?? this.state.careplans[0]
    return (
        <>
            <Grid container spacing={2}>
                <Grid item xs={2}>
                    <Stack spacing={2}>
                        <PatientCard patient={activeCareplan.patient}/>
                        <CareplanSelectorCard activeCareplan={activeCareplan} careplans={this.state.careplans}/>
                    </Stack>
                </Grid>
                <Grid item xs={9}>
                    <Stack >
                        <CareplanCardSimple careplan={activeCareplan}/>
                        <CareplanUnreadResponse careplan={activeCareplan} />
                        <Grid container spacing={1}>
                            <Grid item xs={5}>
                                {activeCareplan.questionnaires.map(questionnaire => {
                                    return (
                                        <QuestionnaireCardSimple cpr={activeCareplan.patient.cpr!} questionnaire={questionnaire}/> 
                                    )
                                })}
                            </Grid>
                            <Grid item xs={7}>
                            {activeCareplan.questionnaires.map(questionnaire => {
                                    return (
                                        <ThresholdCardOverview questionnaire={questionnaire}/> 
                                    )
                                })}
                            </Grid>
                        </Grid>
                    </Stack>
                </Grid>
            </Grid>
        </>
    )
  }


  
  }
  export default PatientCareplans;