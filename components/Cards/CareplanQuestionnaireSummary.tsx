import * as React from 'react';
import { Component } from 'react';
import { PatientCareplan } from '@kvalitetsit/hjemmebehandling/Models/PatientCareplan';
import { BasicTabs } from '../Layout/Tabs';
import { Questionnaire } from '@kvalitetsit/hjemmebehandling/Models/Questionnaire';
import { Button, Grid, Stack, Typography } from '@mui/material';
import { QuestionnaireResponse } from '@kvalitetsit/hjemmebehandling/Models/QuestionnaireResponse';
import { Link } from 'react-router-dom';
import IDateHelper from '@kvalitetsit/hjemmebehandling/Helpers/interfaces/IDateHelper';
import ApiContext from '../../pages/_context';
import { PencilIcon } from '../Icons/PencilIcon';

export interface Props {
  careplan: PatientCareplan
  questionnaireResponses: QuestionnaireResponse[]
}


export class CareplanQuestionnaireSummary extends Component<Props, {}> {
  static displayName = CareplanQuestionnaireSummary.name;
  static contextType = ApiContext;
  dateHelper!: IDateHelper
  InitialiseServices(): void {
    this.dateHelper = this.context.dateHelper;
  }

  render(): JSX.Element {
    this.InitialiseServices()
    const questionnaires = this.props.careplan.questionnaires;
    return (
      <>


            <BasicTabs
              idOfStartTab={questionnaires[0].id}
              tabIds={questionnaires.map(x => x.id)}
              tabLabels={questionnaires.map(x => x!.name!)}
              tabContent={questionnaires.map(x => this.renderQuestionnaireResponseTab(x))}
              class=""
            >
              <Button component={Link} to={"/patients/" + this.props.careplan?.patient?.cpr + "/edit/plandefinition"}><PencilIcon/> </Button>


            </BasicTabs>
      </>
    );
  }

  renderQuestionnaireResponseTab(questionnaire: Questionnaire): JSX.Element {
    let latestResponse: QuestionnaireResponse | null = null;
    const responsesFromNewToOld = this.props.questionnaireResponses.filter(x => x.questionnaireId == questionnaire.id)?.sort((a, b) => b.answeredTime!.getTime() - a.answeredTime!.getTime());
    if (responsesFromNewToOld?.length > 0)
      latestResponse = responsesFromNewToOld[0]
    return (
      <>
        <Grid container>
          <Grid item xs={4}>
            <Stack>
              <Typography variant="caption">
                Seneste besvarelse
              </Typography>
              <Typography>
                {latestResponse && latestResponse.answeredTime ? this.dateHelper.DateToString(latestResponse.answeredTime) : "-"}
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={4}>
            <Stack>
              <Typography variant="caption">
                Frekvens
              </Typography>
              <Typography>
                {questionnaire.frequency!.ToString()}
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={2}>
            <Stack>
              <Button component={Link} to={"/patients/" + this.props.careplan?.patient?.cpr + "/questionnaires/" + questionnaire.id} variant="contained">Se besvarelser</Button>
            </Stack>
          </Grid>
        </Grid>

      </>
    )
  }
}
