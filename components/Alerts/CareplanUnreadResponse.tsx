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
import Alert from '@mui/material/Alert';
import { QuestionnaireResponse, QuestionnaireResponseStatus } from '../Models/QuestionnaireResponse';

export interface Props {
    careplan : PatientCareplan
}

export interface State {
    
}

export class CareplanUnreadResponse extends Component<Props,State> {
  static displayName = CareplanUnreadResponse.name;

  render () {
      let careplan = this.props.careplan

      let statuses : QuestionnaireResponse[] = [];
      
      for(let questionnaireIndex = 0; questionnaireIndex<careplan.questionnaires.length;questionnaireIndex++){
          let questionnaire = careplan.questionnaires[questionnaireIndex];
        for(let responseIndex = 0; responseIndex<careplan.questionnaires[questionnaireIndex].questionnaireResponses.length;responseIndex++){
            let response = questionnaire.questionnaireResponses[responseIndex];
            if(response.status != QuestionnaireResponseStatus.Processed){
                statuses.push(response)
            }
        }
      }
    return (
        <>
        {statuses.map(x=>{
            return (
                <>
                {x.status == QuestionnaireResponseStatus.NotProcessed ? 
                    <Alert severity="warning" action={
                        <Button component={Link} to={"/patients/"+careplan.patient.cpr+"/questionnaires/a"} color="inherit" variant="text">Se besvarelse</Button>        
                    }>
                        Der er en ulæste besvarelse fra {x.answeredTime?.toLocaleDateString()}
                    </Alert> : ""
                }
                {x.status == QuestionnaireResponseStatus.InProgress ? 
                    <Alert severity="error">
                        Der er en besvarelse under processering
                    </Alert> : ""
                }
                </>
            )
        })}
        </>
        
        
    );
  }
}
