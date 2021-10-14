import { CircularProgress,Tooltip, Divider, Grid, Typography, CardHeader } from '@material-ui/core';
import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import { useParams } from 'react-router-dom';
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
import { Stack } from '@mui/material';
import HealingIcon from '@mui/icons-material/Healing';
import { useContext } from 'react';
import { PatientCareplan } from '../../../components/Models/PatientCareplan';
import { LoadingComponent } from '../../../components/Layout/LoadingComponent';
import ApiContext from '../../_context';
import { PatientDetail } from '../../../components/Models/PatientDetail';


interface State {
  
  loading: boolean
  careplans : PatientCareplan[]
}
interface Props {
    match : { params : {comment : string} }
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
  
  let cpr = this.props.match.params.comment
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
                <Stack spacing={2}>

                
                <Card>
                    <CardHeader title="Patientgrupper"/>
                    <CardContent>
                        
                        {careplan.planDefinitions.map(planDefinition => {
                        return (
                            <>
                            {planDefinition.name}
                            </>
                        )
                    })}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader title="Spørgeskemaer"/>
                    <CardContent>
                        
                        {careplan.questionnaires.length > 0 ? careplan.questionnaires.map(questionnaire => {
                        return (
                            <>
                            {questionnaire.name}
                            {questionnaire.thresholds.map(threshold => {
                                return (
                                    <>
                                    <Box sx={{ width: 300 }}>
                                    {threshold.points.map(point => {
                                            <>
                                            <Slider
                                        getAriaLabel={() => 'Minimum distance'}
                                        value={point.from}
                                        //onChange={handleChange1}
                                        valueLabelDisplay="auto"
                                        //getAriaValueText={valuetext}
                                        disableSwap
                                    />
                                    <Slider
                                        getAriaLabel={() => 'Minimum distance shift'}
                                        value={point.to}
                                        valueLabelDisplay="auto"
                                        //getAriaValueText={valuetext}
                                        disableSwap
                                    />
                                            </>
                                    })}
                                    
                                    
                                    </Box>
                                    </>
                                )
                            })}
                            
                            </>
                        )
                    }) : "Ingen spørgeskemaer"}
                    </CardContent>
                </Card>
                </Stack>
                </>
            )
        })}
        </>
    )
    
  }


  
  }
  