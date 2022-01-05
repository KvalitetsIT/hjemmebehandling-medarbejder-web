import * as React from 'react';
import { Link } from 'react-router-dom';
import { Component } from 'react';
import { PatientCareplan } from '@kvalitetsit/hjemmebehandling/Models/PatientCareplan';
import Alert from '@mui/material/Alert';
import { QuestionnaireResponse, QuestionnaireResponseStatus } from '@kvalitetsit/hjemmebehandling/Models/QuestionnaireResponse';
import { CategoryEnum } from '@kvalitetsit/hjemmebehandling/Models/CategoryEnum';
import { Card, CardContent, Grid, Typography } from '@mui/material';
import ErrorIcon from '@mui/icons-material/Error';

export interface Props {
  careplan: PatientCareplan
  questionnaireResponses: QuestionnaireResponse[]
}

export class CareplanUnreadResponse extends Component<Props, {}> {
  static displayName = CareplanUnreadResponse.name;

  getAlarmSeverityFromCategory(category: CategoryEnum): "error" | "warning" | "success" | "info" {
    if (category === CategoryEnum.RED)
      return "error"
    if (category === CategoryEnum.YELLOW)
      return "warning"
    if (category === CategoryEnum.GREEN)
      return "success"

    return "info"
  }

  render(): JSX.Element {
    const responses: QuestionnaireResponse[] = [];

    const questionnaireResponses = this.props.questionnaireResponses ? this.props.questionnaireResponses : [];
    for (let responseIndex = 0; responseIndex < questionnaireResponses.length; responseIndex++) {
      const response = questionnaireResponses[responseIndex];
      if (response.status !== QuestionnaireResponseStatus.Processed) {
        responses.push(response)

      }
    }

    if (responses.length == 0)
      return (<></>);

    const latestUnansweredAnswer = responses.sort((a, b) => b.answeredTime!.getTime() - a.answeredTime!.getTime())[0]
    return (
      <>
        <Card>
          <CardContent>
            <Link to={"./../questionnaires/" + latestUnansweredAnswer.questionnaireId} color="inherit" >
              {latestUnansweredAnswer.status === QuestionnaireResponseStatus.NotProcessed ?
                <Alert className="darkColor" sx={{padding:0}}  variant="filled" icon={<></>} severity={this.getAlarmSeverityFromCategory(latestUnansweredAnswer.category)} >
                  <Grid container columnSpacing={3} alignItems="center">
                    <Grid item >
                      <ErrorIcon fontSize='large' />
                    </Grid>
                    <Grid item lineHeight={1}>
                      <Typography lineHeight={0} alignContent="left" fontWeight="bold" variant="caption">Der er en ulæst besvarelse</Typography><br/>
                      <Typography lineHeight={0} alignContent="left" variant="caption">Se besvarelse</Typography>
                    </Grid>
                  </Grid>
                </Alert>
                : ""
              }
            </Link>
          </CardContent>
        </Card>
      </>
    );
  }

}
