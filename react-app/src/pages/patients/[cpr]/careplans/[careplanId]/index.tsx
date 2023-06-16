import * as React from 'react';

import { Grid, Stack } from '@mui/material';
import { PatientCard } from '../../../../../components/Cards/PatientCard';
import { PatientCareplan } from '@kvalitetsit/hjemmebehandling/Models/PatientCareplan';
import ApiContext from '../../../../_context';
import { LoadingBackdropComponent } from '../../../../../components/Layout/LoadingBackdropComponent';
import { ICareplanService } from '../../../../../services/interfaces/ICareplanService';
import { CareplanSummary } from '../../../../../components/Cards/CareplanSummary';
import { CareplanQuestionnaireSummary } from '../../../../../components/Cards/CareplanQuestionnaireSummary';
import { ObservationCard } from '../../../../../components/Cards/ObservationCard';
import { QuestionnaireResponse } from '@kvalitetsit/hjemmebehandling/Models/QuestionnaireResponse';
import { IQuestionnaireService } from '../../../../../services/interfaces/IQuestionnaireService';
import { LoginInfoCard } from '../../../../../components/Cards/LoginInfoCard';
import IsEmptyCard from '@kvalitetsit/hjemmebehandling/Errorhandling/IsEmptyCard';
import { ErrorBoundary } from '@kvalitetsit/hjemmebehandling/Errorhandling/ErrorBoundary';
import { Questionnaire } from '@kvalitetsit/hjemmebehandling/Models/Questionnaire';

interface State {
  loading: boolean
  careplans: PatientCareplan[]
  questionnaireResponses: QuestionnaireResponse[]
  activeQuestionnaire?: Questionnaire
}

interface Props {
  match: { params: { cpr: string, careplanId: string } }
}

class PatientCareplans extends React.Component<Props, State> {

  
  static contextType = ApiContext
  
  
  careplanService!: ICareplanService
  questionnaireService!: IQuestionnaireService

  constructor(props: Props) {
    super(props);

    this.state = {
      loading: true,
      careplans: [],
      questionnaireResponses: []
    }
  }

  render(): JSX.Element {
    this.InitializeServices();
    return this.state.loading ? <LoadingBackdropComponent /> : this.renderCareplanTab();
  }

  InitializeServices(): void {
    this.careplanService = this.context.careplanService;
    this.questionnaireService = this.context.questionnaireService;
  }

  async componentDidMount(): Promise<void> {
    await this.populateCareplans()
  }

  async populateCareplans(): Promise<void> {

    const cpr = this.props.match.params.cpr;
    let activeCareplanId = this.props.match.params.careplanId

    try {

      let careplans: PatientCareplan[] = []
      if (activeCareplanId === 'Aktiv') {
        careplans = await this.careplanService.GetPatientCareplans(cpr);
      }
      else {
        careplans = [await this.careplanService.GetPatientCareplanById(activeCareplanId)]
      }

      const careplan = careplans.find(a => !a?.terminationDate)

      const questionnaireResponses: QuestionnaireResponse[] = [];
      if (careplan && careplan.id) {
        activeCareplanId = careplan.id
        for (const questionnaire of careplans.flatMap(c => c.questionnaires)) {
          const tempRes = await this.questionnaireService.GetQuestionnaireResponses(activeCareplanId, [questionnaire.id], 1, 5)
          questionnaireResponses.push(...tempRes);
        }
      }

      this.setState({
        loading: false,
        careplans: careplans,
        questionnaireResponses: questionnaireResponses,
        activeQuestionnaire: careplans.find(c => c?.id === this.props.match.params.careplanId)?.questionnaires[0] ?? this.state.careplans[0]?.questionnaires[0]
      });
    } catch (error) {
      this.setState(() => { throw error })
    }
  }


  //=====================TABS===============================

  renderCareplanTab(): JSX.Element {
    const activeCareplan = this.state.careplans.find(c => c?.id === this.props.match.params.careplanId) ?? this.state.careplans[0]

    const activeQuestionnaire = this.state.activeQuestionnaire ?? activeCareplan?.questionnaires[0]

    return (
      <IsEmptyCard object={activeCareplan} jsxWhenEmpty="Ingen aktive monitoreringsplaner fundet">
        <Grid container spacing={3} sx={{ flexWrap: "inherit" }}>
          <Grid sx={{ width: 400 }} item>
            <ErrorBoundary>
              <Stack spacing={3}>
                {activeCareplan?.patient ?
                  <>
                    <PatientCard patient={activeCareplan?.patient}></PatientCard>
                    <LoginInfoCard patient={activeCareplan?.patient} />
                  </> :
                  <div>Noget gik galt - Ingen aktiv monitoreringsplan, eller så var ingen patient tilknyttet</div>
                }
                <CareplanSummary careplan={activeCareplan}></CareplanSummary>
              </Stack>
            </ErrorBoundary>
          </Grid>
          <Grid item xs>
            <ErrorBoundary>

              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <CareplanQuestionnaireSummary initialQuestionnaire={activeQuestionnaire} onChange={(selectedQuestionnaire) => { this.setState({ activeQuestionnaire: selectedQuestionnaire }) }} questionnaireResponses={this.state.questionnaireResponses} careplan={activeCareplan} />
                </Grid>
                <Grid item xs={12}>
                  <Grid container>
                    <ObservationCard questionnaire={activeQuestionnaire} careplan={activeCareplan} />
                  </Grid>
                </Grid>
              </Grid>

            </ErrorBoundary>
          </Grid>

        </Grid>
      </IsEmptyCard>
    )
  }



}
export default PatientCareplans;