import * as React from 'react';

import { Grid, Stack } from '@mui/material';
import { PatientCard } from '../../../../../components/Cards/PatientCard';
import { PatientCareplan } from '@kvalitetsit/hjemmebehandling/Models/PatientCareplan';
import ApiContext from '../../../../_context';
import { LoadingBackdropComponent } from '../../../../../components/Layout/LoadingBackdropComponent';
import ICareplanService from '../../../../../services/interfaces/ICareplanService';
import { CareplanSummary } from '../../../../../components/Cards/CareplanSummary';
import { CareplanQuestionnaireSummary } from '../../../../../components/Cards/CareplanQuestionnaireSummary';
import { ObservationCard } from '../../../../../components/Cards/ObservationCard';
import { CareplanUnreadResponse } from '../../../../../components/Alerts/CareplanUnreadResponse';
import { QuestionnaireResponse } from '@kvalitetsit/hjemmebehandling/Models/QuestionnaireResponse';
import IQuestionnaireService from '../../../../../services/interfaces/IQuestionnaireService';
import { ErrorBoundary } from '@kvalitetsit/hjemmebehandling/Errorhandling/ErrorBoundary'
import { LoginInfoCard } from '../../../../../components/Cards/LoginInfoCard';
import IsEmptyCard from '@kvalitetsit/hjemmebehandling/Errorhandling/IsEmptyCard';

interface State {

  loading: boolean
  careplans: PatientCareplan[]
  questionnaireResponses: QuestionnaireResponse[]
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
    const contents = this.state.loading ? <LoadingBackdropComponent /> : this.renderCareplanTab();
    return contents;
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

      let questionnaireResponses: QuestionnaireResponse[] = [];
      if (careplan && careplan.id) {
        const questionnaireIds: string[] = careplans.flatMap(x => x.questionnaires.map(x => x.id))

        activeCareplanId = careplan!.id!
        questionnaireResponses = await this.questionnaireService.GetQuestionnaireResponses(activeCareplanId, questionnaireIds, 1, 5)
      }


      this.setState({
        loading: false,
        careplans: careplans,
        questionnaireResponses: questionnaireResponses
      });
    } catch (error) {
      this.setState(() => { throw error })
    }
  }


  //=====================TABS===============================

  renderCareplanTab(): JSX.Element {
    const activeCareplan = this.state.careplans.find(c => c?.id === this.props.match.params.careplanId) ?? this.state.careplans[0]
    return (
      <IsEmptyCard object={activeCareplan} jsxWhenEmpty="Ingen aktive behandlingsplaner fundet :-(">
        <Grid container spacing={3} sx={{flexWrap:"inherit"}}>
          <Grid item xs="auto">
            <ErrorBoundary>
              <Stack spacing={3}  >

                <CareplanUnreadResponse careplan={activeCareplan} questionnaireResponses={this.state.questionnaireResponses} />
                {activeCareplan?.patient ?
                  <>
                    <PatientCard patient={activeCareplan?.patient}></PatientCard>
                    <LoginInfoCard patient={activeCareplan?.patient} />
                  </> :
                  <div>Noget gik galt - Ingen aktiv-behandlingsplan, eller så var ingen patient tilknyttet</div>  
              }

                <ErrorBoundary>
                  <CareplanSummary careplan={activeCareplan}></CareplanSummary>
                </ErrorBoundary>
              </Stack>
            </ErrorBoundary>
          </Grid>
          <Grid item xs>
            <ErrorBoundary>

              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <CareplanQuestionnaireSummary questionnaireResponses={this.state.questionnaireResponses} careplan={activeCareplan} />
                </Grid>
                <Grid item xs={12}>
                  <ObservationCard questionnaire={activeCareplan?.questionnaires[0]} careplan={activeCareplan} />
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