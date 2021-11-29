import * as React from 'react';
import { Link } from 'react-router-dom';
import { Component } from 'react';
import { PatientCareplan } from '../Models/PatientCareplan';
import Alert from '@mui/material/Alert';
import { QuestionnaireResponse, QuestionnaireResponseStatus } from '../Models/QuestionnaireResponse';
import { CategoryEnum } from '../Models/CategoryEnum';
import { Card, CardContent, Typography } from '@mui/material';
import ErrorIcon from '@mui/icons-material/Error';

export interface Props {
    careplan : PatientCareplan
    questionnaireResponses : QuestionnaireResponse[]
}

export class CareplanUnreadResponse extends Component<Props,{}> {
  static displayName = CareplanUnreadResponse.name;

  getAlarmSeverityFromCategory(category : CategoryEnum) : "error" | "warning"|"success"|"info"{
    if(category === CategoryEnum.RED)
        return "error"
    if(category === CategoryEnum.YELLOW)
        return "warning"
    if(category === CategoryEnum.GREEN)
        return "success"

    return "info"
  }

  render () : JSX.Element{
    const responses : QuestionnaireResponse[] = [];

    const questionnaireResponses = this.props.questionnaireResponses ? this.props.questionnaireResponses : [];
    for(let responseIndex = 0; responseIndex<questionnaireResponses.length;responseIndex++){
        const response = questionnaireResponses[responseIndex];
        if(response.status !== QuestionnaireResponseStatus.Processed){
            responses.push(response)

        }
    }
    
    if(responses.length == 0)
      return (<></>);

    const latestUnansweredAnswer = responses.sort((a,b) =>b.answeredTime!.getTime() - a.answeredTime!.getTime())[0]
    return (
      <>
        <Card>
          <CardContent>
              <Link to={"./../questionnaires/"+latestUnansweredAnswer.questionnaireId} color="inherit" >
                  {latestUnansweredAnswer.status === QuestionnaireResponseStatus.NotProcessed ? 
                      <Alert variant="filled" icon={<ErrorIcon fontSize="large"/>} severity={this.getAlarmSeverityFromCategory(latestUnansweredAnswer.category)} >
                          <Typography variant="subtitle2">Ulæst besvarelse</Typography>
                          <Typography variant="caption">Se besvarelse</Typography>
                      </Alert> : ""
                  }
                  </Link>   
          </CardContent>
        </Card>
      </>
    );
  }

}
