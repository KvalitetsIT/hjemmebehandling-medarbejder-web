import { CardHeader, Typography } from '@material-ui/core';
import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import { Component } from 'react';
import { Questionnaire } from '../Models/Questionnaire';
import { Stack } from '@mui/material';
import { NumberedChartCard } from './NumberedChartCard';

export interface Props {
    questionnaire : Questionnaire
    cpr : string;
    hideChart? : boolean;
}


export class QuestionnaireCardSimple extends Component<Props,{}> {
  static displayName = QuestionnaireCardSimple.name;

  render () : JSX.Element{
      const questionnaire = this.props.questionnaire;
      
      const questionnaireResponses = questionnaire?.questionnaireResponses
      const answerTimeOnly = questionnaireResponses?.flatMap(x=>x.answeredTime);
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
