import { CardHeader, CircularProgress, Divider, Grid, Tooltip, Typography } from '@material-ui/core';
import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import { Link, useParams } from 'react-router-dom';
import { IBackendApi } from '../../apis/IBackendApi';
import { PatientDetail } from '../../components/Models/PatientDetail';
import { Contact } from '../Models/Contact';
import { Component } from 'react';
import StarIcon from '@mui/icons-material/Star';
import ContactPageIcon from '@mui/icons-material/ContactPage';
import { PatientCareplan } from '../Models/PatientCareplan';
import { Questionnaire } from '../Models/Questionnaire';
import { Stack } from '@mui/material';
import { NumberedChartCard } from './NumberedChartCard';

export interface Props {
    questionnaire : Questionnaire
    cpr : string;
    hideChart? : boolean;
}

export interface State {
    
}

export class QuestionnaireCardSimple extends Component<Props,State> {
  static displayName = QuestionnaireCardSimple.name;

  render () {
      let questionnaire = this.props.questionnaire;
      
      let questionnaireResponses = questionnaire?.questionnaireResponses
      let answerTimeOnly = questionnaireResponses?.flatMap(x=>x.answeredTime);
      let latestQuestionnaireResponse = null;

      if(answerTimeOnly.length > 0)
        latestQuestionnaireResponse = answerTimeOnly?.reduce((a,b) => a! > b! ? a : b);

    return (
        <Card>
         
                <CardHeader subheader={questionnaire.name}/>
            
            <CardContent>
                <Stack spacing={3} direction="row">
                {this.props.hideChart ? "" : 
                <NumberedChartCard questionnaire={questionnaire}/>}
                
                <Stack spacing={3}>
                    
                    <Box>
                        <Typography variant="caption">Seneste besvarelse</Typography>
                        <Typography>{latestQuestionnaireResponse == null ? " - " : latestQuestionnaireResponse.toLocaleDateString()}</Typography>
                    </Box>
                    <Box>
                        <Typography variant="caption">Besvares</Typography>
                        <Typography>{questionnaire.frequency ? questionnaire.frequency.ToString() : "N/A"}</Typography>
                    </Box>
                    
                    <Button component={Link} to={"/patients/"+this.props.cpr+"/questionnaires/"+questionnaire.id} variant="contained">Se besvarelse</Button>    
                </Stack>
                
                </Stack>
                
            </CardContent>
        </Card>
    );
  }
}
