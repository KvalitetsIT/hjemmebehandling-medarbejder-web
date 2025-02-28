import * as React from 'react';
import { Component } from 'react';
import { PatientCareplan } from '../Models/PatientCareplan';
import { BasicTabs } from '../Layout/Tabs';
import { Questionnaire } from '../Models/Questionnaire';
import { Tooltip, Button, Grid, Stack, Typography } from '@mui/material';
import { QuestionnaireResponse } from '../Models/QuestionnaireResponse';
import { Link } from 'react-router-dom';
import IDateHelper from '../Helpers/interfaces/IDateHelper';
import ApiContext, { IApiContext } from '../../pages/_context';
import { PencilIcon } from '../Icons/Icons';

export interface Props {
  careplan: PatientCareplan
  questionnaireResponses: QuestionnaireResponse[]
  onChange?: (questionnaire: Questionnaire) => void
  initialQuestionnaire?: Questionnaire
}


export class CareplanQuestionnaireSummary extends Component<Props, {}> {
  static displayName = CareplanQuestionnaireSummary.name;
  static contextType = ApiContext;

  dateHelper!: IDateHelper

  constructor(props: Props) {
    super(props)
  }

  InitialiseServices(): void {
    const api = this.context as IApiContext
    this.dateHelper = api.dateHelper;
  }

  render(): JSX.Element {
    this.InitialiseServices()
    const questionnaires = this.props.careplan.questionnaires;
    const initialQuestionnaire = this.props.initialQuestionnaire ?? questionnaires[0];

    return (
      <>
        <BasicTabs
          onChange={(value) => this.props.onChange && this.props.onChange(questionnaires[value])}
          idOfStartTab={initialQuestionnaire.id}
          tabIds={questionnaires.map(x => x.id)}
          tabLabels={questionnaires.map(x => x!.name!)}
          tabContent={questionnaires.map(x => this.renderQuestionnaireResponseTab(x))}
          linkToId={false}
          class=""
        >
          <Tooltip title='Rediger patientens spørgeskema' placement='right'>
            <Button component={Link} to={"/patients/" + this.props.careplan?.patient?.cpr + "/edit/plandefinition"}><PencilIcon /> </Button>
          </Tooltip>

        </BasicTabs>
      </>
    );
  }

  renderQuestionnaireResponseTab(questionnaire: Questionnaire): JSX.Element {
    let latestResponse: QuestionnaireResponse | null = null;
    const responsesFromNewToOld = this.props.questionnaireResponses.filter(x => x.questionnaireId === questionnaire.id)?.sort((a, b) => b.answeredTime!.getTime() - a.answeredTime!.getTime());
    if (responsesFromNewToOld?.length > 0)
      latestResponse = responsesFromNewToOld[0]
    return (
      <>
        <Grid container>
          <Grid item xs={5}>
            <Stack>
              <Typography variant="caption">
                Seneste besvarelse
              </Typography>
              <Typography fontWeight="bold">
                {latestResponse && latestResponse.answeredTime ? this.dateHelper.DateToString(latestResponse.answeredTime) : "-"}
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={5}>
            <Stack>
              <Typography variant="caption">
                Frekvens
              </Typography>
              <Typography fontWeight="bold">
                {questionnaire.frequency!.days.length !== 0 ? questionnaire.frequency!.ToString() : ''}
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
