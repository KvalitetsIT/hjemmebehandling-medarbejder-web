import * as React from 'react';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import { Component } from 'react';
import { PatientCareplan } from '../Models/PatientCareplan';
import Alert from '@mui/material/Alert';
import { QuestionnaireResponse, QuestionnaireResponseStatus } from '../Models/QuestionnaireResponse';
import { CategoryEnum } from '../Models/CategoryEnum';
import { Card, CardContent } from '@mui/material';
import ErrorIcon from '@mui/icons-material/Error';

export interface Props {
    careplan : PatientCareplan
    questionnaireResponses : QuestionnaireResponse[]
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
                        <Alert variant="filled" icon={<ErrorIcon/>} severity={this.getAlarmSeverityFromCategory(latestUnansweredAnswer.category)} >
                            Ulæst besvarelse     
                        </Alert> : ""
                    }
                    </Link>   
                    </CardContent>
                    </Card>
                    
</>
    );
  }

}
