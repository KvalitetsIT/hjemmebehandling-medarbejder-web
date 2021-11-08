import * as React from 'react';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import { Component } from 'react';
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
            if(response.status !== QuestionnaireResponseStatus.Processed){
                statuses.push(response)
            }
        }
      }
    return (
        <>
        {statuses.map(x=>{
            return (
                <>
                {x.status === QuestionnaireResponseStatus.NotProcessed ? 
                    <Alert severity="warning" action={
                        <Button component={Link} to={"/patients/"+careplan.patient.cpr+"/questionnaires/a"} color="inherit" variant="text">Se besvarelse</Button>        
                    }>
                        Der er en ulæste besvarelse fra {x.answeredTime?.toLocaleDateString()}
                    </Alert> : ""
                }
                {x.status === QuestionnaireResponseStatus.InProgress ? 
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
