import * as React from 'react';

import { Grid } from '@mui/material';
import { AnswerTable } from '../../../../../../components/Tables/AnswerTable';
import { LoadingBackdropComponent } from '../../../../../../components/Layout/LoadingBackdropComponent';
import ApiContext, { IApiContext } from '../../../../../_context';
import { BasicTabs } from '../../../../../../components/Layout/Tabs';
import { PatientCareplan } from '@kvalitetsit/hjemmebehandling/Models/PatientCareplan';
import { Questionnaire } from '@kvalitetsit/hjemmebehandling/Models/Questionnaire';
import { ICareplanService } from '../../../../../../services/interfaces/ICareplanService';
import { PatientContextThumbnails } from '../../../../../../components/Cards/PatientContextThumbnails';
import { IQuestionnaireService } from '../../../../../../services/interfaces/IQuestionnaireService';
import { ErrorBoundary } from '@kvalitetsit/hjemmebehandling/Errorhandling/ErrorBoundary'
import IsEmptyCard from '@kvalitetsit/hjemmebehandling/Errorhandling/IsEmptyCard';


interface State {
  loading: boolean
  careplans: Array<PatientCareplan>
  editMode: boolean
}
interface Props {
  match: { params: { cpr: string, questionnaireId?: string, careplanId?: string } }
}


export default class QuestionnaireResponseDetails extends React.Component<Props, State> {

  static contextType = ApiContext
   

  careplanService!: ICareplanService
  questionnaireService!: IQuestionnaireService;


  constructor(props: Props) {
    super(props);
     
    this.state = {
      loading: true,
      careplans: [],
      editMode: false
    }
  }

  render(): JSX.Element {
    this.InitializeServices();
    const contents = this.state.loading ? <LoadingBackdropComponent /> : this.renderTabs();
    return contents;
  }

  InitializeServices(): void {
const api = this.context as IApiContext
    this.careplanService =   api.careplanService;
    this.questionnaireService =   api.questionnaireService;
  }

  componentDidMount(): void {
    try {
      this.populateCareplans()
    } catch (error) {
      this.setState(() => { throw error })
    }
  }

  async populateCareplans(): Promise<void> {

    const { cpr } = this.props.match.params;
    const activeCareplanId = this.props.match.params.careplanId

    let careplans: PatientCareplan[] = []
    if (!activeCareplanId || activeCareplanId === 'Aktiv') {
      careplans = await this.careplanService.GetPatientCareplans(cpr);
    }
    else {
      careplans = [await this.careplanService.GetPatientCareplanById(activeCareplanId)]
    }

    this.setState({
      careplans: careplans,
      loading: false
    });
  }


  renderTabs(): JSX.Element {

    let questionnaires: Questionnaire[] = []
    let currentCareplan = this.state.careplans.find(x => x?.id === this.props.match.params.careplanId);
    if (!currentCareplan)
      currentCareplan = this.state.careplans.find(x => !x?.terminationDate);

    if (currentCareplan)
      questionnaires = currentCareplan.questionnaires;



    return (

      <IsEmptyCard object={currentCareplan} jsxWhenEmpty="Ingen monitoreringsplan">
        <Grid container spacing={2}>
          <Grid item xs={12}>

            <PatientContextThumbnails currentCareplan={currentCareplan!} />
          </Grid>

          <Grid item xs={12}>
            <BasicTabs
              idOfStartTab={this.props.match.params.questionnaireId}
              tabIds={questionnaires.map(x => x.id)}
              tabLabels={questionnaires!.map(x => x!.name!)}
              tabContent={questionnaires.map(x => this.renderQuestionnaireResponseTab(currentCareplan!, x))}
              class="questionnaire__tab"
            />
          </Grid>
        </Grid>
      </IsEmptyCard>



    );
  }

  //=====================TABS===============================

  renderQuestionnaireResponseTab(careplan: PatientCareplan, questionnaire: Questionnaire): JSX.Element {
    return (
      <>


        <ErrorBoundary rerenderChildren={false}>
          <AnswerTable careplan={careplan} questionnaires={questionnaire} />
        </ErrorBoundary>
      </>
    )
  }

  renderChartsTab(): JSX.Element {
    return (
      <div>charts</div>
    )
  }



}
