import * as React from 'react';

import { Grid, Stack } from '@mui/material';
import { PatientCard } from '../../../../../components/Cards/PatientCard';
import { PatientCareplan } from '../../../../../components/Models/PatientCareplan';
import ApiContext from '../../../../_context';
import { LoadingBackdropComponent } from '../../../../../components/Layout/LoadingBackdropComponent';
import ICareplanService from '../../../../../services/interfaces/ICareplanService';
import { CareplanSummary } from '../../../../../components/Cards/CareplanSummary';
import { CareplanQuestionnaireSummary } from '../../../../../components/Cards/CareplanQuestionnaireSummary';
import { ObservationCard } from '../../../../../components/Cards/ObservationCard';
import { CareplanUnreadResponse } from '../../../../../components/Alerts/CareplanUnreadResponse';
import { QuestionnaireResponse } from '../../../../../components/Models/QuestionnaireResponse';
import IQuestionnaireService from '../../../../../services/interfaces/IQuestionnaireService';
import { ErrorBoundary } from '../../../../../components/Layout/ErrorBoundary';

interface State {
  
  loading: boolean
  careplans : PatientCareplan[]
  questionnaireResponses : QuestionnaireResponse[]
}

interface Props {
    match : { params : {cpr : string, careplanId : string} }
}

class PatientCareplans extends React.Component<Props,State> {
  static contextType = ApiContext
  careplanService! : ICareplanService
  questionnaireService! : IQuestionnaireService

  constructor(props : Props){
    super(props);
    this.state = {
        loading : true,
        careplans : [],
        questionnaireResponses : []
    }
    
}

  render () : JSX.Element{
      this.InitializeServices();
    const contents = this.state.loading ? <LoadingBackdropComponent/> : this.renderCareplanTab();
    return contents;
  }
  InitializeServices(): void{
    this.careplanService = this.context.careplanService;
    this.questionnaireService = this.context.questionnaireService;
  }

  async componentDidMount() : Promise<void> {
    await this.populateCareplans()
}

async populateCareplans() : Promise<void>{
  
  const cpr = this.props.match.params.cpr;
  let activeCareplanId = this.props.match.params.careplanId
  
  try{
    const careplans : PatientCareplan[] = await this.careplanService.GetPatientCareplans(cpr);
    const questionnaireIds : string[] = careplans.flatMap(x=>x.questionnaires.map(x=>x.id))
  
    let careplan = careplans.find(a => !a.terminationDate)!
    activeCareplanId = careplan?.id
    const questionnaireResponses : QuestionnaireResponse[] = await this.questionnaireService.GetQuestionnaireResponses(activeCareplanId,questionnaireIds,1,5)
    this.setState({
      loading : false,  
      careplans : careplans,
      questionnaireResponses : questionnaireResponses
    });
  } catch(error){
    this.setState(()=>{throw error})
  }
}


  //=====================TABS===============================

  renderCareplanTab() : JSX.Element{
    
    const careplans = this.state.careplans.find(a => !a.terminationDate)!
    if(!careplans)
        return (
            <div>Ingen aktive behandlingsplaner fundet :-(</div>
        )

    const activeCareplan = this.state.careplans.find(c => c.id === this.props.match.params.careplanId) ?? this.state.careplans[0]
    console.log(activeCareplan)
    return (
      <Grid container spacing={3}>
        <Grid item xs={2}>
          <ErrorBoundary>
          <Stack spacing={3} >
            
                <CareplanUnreadResponse careplan={activeCareplan} questionnaireResponses={this.state.questionnaireResponses}/>
                <PatientCard patient={activeCareplan.patient}></PatientCard>
                <ErrorBoundary>
                  <CareplanSummary careplan={activeCareplan}></CareplanSummary>
                </ErrorBoundary>
            </Stack>
            </ErrorBoundary>
        </Grid>
        <Grid item xs={10}>
        <ErrorBoundary>
        <Stack spacing={3}>
            <CareplanQuestionnaireSummary questionnaireResponses={this.state.questionnaireResponses} careplan={activeCareplan}/>
            <ObservationCard questionnaire={activeCareplan.questionnaires[0]} careplan={activeCareplan}/>
            </Stack>
            </ErrorBoundary>
        </Grid>
        
      </Grid>

    )
  }


  
  }
  export default PatientCareplans;