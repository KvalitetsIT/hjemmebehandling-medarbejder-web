import * as React from 'react';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import { Component } from 'react';
import { PatientCareplan } from '../Models/PatientCareplan';
import Alert from '@mui/material/Alert';
import { QuestionnaireResponse, QuestionnaireResponseStatus } from '../Models/QuestionnaireResponse';
import { CategoryEnum } from '../Models/CategoryEnum';
import { Questionnaire } from '../Models/Questionnaire';
import { Card, CardContent } from '@mui/material';

export interface Props {
    careplan : PatientCareplan
}

export class CareplanUnreadResponse extends Component<Props,{}> {
  static displayName = CareplanUnreadResponse.name;

  getAlarmSeverityFromCategory(category : CategoryEnum){
    if(category === CategoryEnum.RED)
        return "error"
    if(category === CategoryEnum.YELLOW)
        return "warning"
    if(category === CategoryEnum.GREEN)
        return "success"

    return "info"
  }

  render () : JSX.Element{
    const careplan = this.props.careplan

    const responses : QuestionnaireResponse[] = [];
    const responseToQuestionnaire : Map<QuestionnaireResponse,Questionnaire> = new Map<QuestionnaireResponse, Questionnaire>();
      
      for(let questionnaireIndex = 0; questionnaireIndex<careplan.questionnaires.length;questionnaireIndex++){
        const questionnaire = careplan.questionnaires[questionnaireIndex];
        for(let responseIndex = 0; responseIndex<careplan.questionnaires[questionnaireIndex].questionnaireResponses.length;responseIndex++){
            const response = questionnaire.questionnaireResponses[responseIndex];
            if(response.status !== QuestionnaireResponseStatus.Processed){
                responses.push(response)
                responseToQuestionnaire.set(response,questionnaire)
            }
        }
      }

      if(responses.length == 0)
        return (<></>);

      const latestUnansweredAnswer = responses.sort((a,b) =>b.answeredTime!.getTime() - a.answeredTime!.getTime())[0]
    return (
        <Card>
            <CardContent>
                    {latestUnansweredAnswer.status === QuestionnaireResponseStatus.NotProcessed ? 
                        <Alert severity={this.getAlarmSeverityFromCategory(latestUnansweredAnswer.category)} >
                            <Button component={Link} to={"/patients/"+careplan.patient.cpr+"/questionnaires/"+responseToQuestionnaire.get(latestUnansweredAnswer)?.id} color="inherit" variant="text">Ulæst besvarelse</Button>        
                        </Alert> : ""
                    }
            </CardContent>
        </Card>
    );
  }

}
