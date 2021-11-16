import * as React from 'react';

import { Grid, Stack } from '@mui/material';
import { PatientCard } from '../../../../../components/Cards/PatientCard';
import { PatientCareplan } from '../../../../../components/Models/PatientCareplan';
import ApiContext from '../../../../_context';
import { LoadingComponent } from '../../../../../components/Layout/LoadingComponent';
import ICareplanService from '../../../../../services/interfaces/ICareplanService';
import { CareplanSummary } from '../../../../../components/Cards/CareplanSummary';
import { CareplanQuestionnaireSummary } from '../../../../../components/Cards/CareplanQuestionnaireSummary';
import { ObservationCard } from '../../../../../components/Cards/ObservationCard';
import { CareplanUnreadResponse } from '../../../../../components/Alerts/CareplanUnreadResponse';
import { QuestionnaireResponse } from '../../../../../components/Models/QuestionnaireResponse';
import IQuestionnaireService from '../../../../../services/interfaces/IQuestionnaireService';

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
    const contents = this.state.loading ? <LoadingComponent/> : this.renderCareplanTab();
    return contents;
  }
  InitializeServices(): void{
    this.careplanService = this.context.careplanService;
    this.questionnaireService = this.context.questionnaireService;
    console.log(this.careplanService)
    console.log(this.questionnaireService)
  }

  componentDidMount() : void {
    this.populateCareplans()
}

async populateCareplans() : Promise<void>{
  
  const cpr = this.props.match.params.cpr;
  const activeCareplanId = this.props.match.params.careplanId

  const careplans : PatientCareplan[] = await this.careplanService.GetPatientCareplans(cpr);
  const questionnaireIds : string[] = careplans.flatMap(x=>x.questionnaires.map(x=>x.id))
  const questionnaireResponses : QuestionnaireResponse[] = await this.questionnaireService.GetQuestionnaireResponses(activeCareplanId,questionnaireIds,1,5)

  this.setState({
    loading : false,  
    careplans : careplans,
    questionnaireResponses : questionnaireResponses
      

  });
}


  //=====================TABS===============================

  renderCareplanTab() : JSX.Element{
    
    const careplans = this.state.careplans;
    if(careplans.length === 0)
        return (
            <div>Ingen behandlingsplaner fundet :-(</div>
        )

    const activeCareplan = this.state.careplans.find(c => c.id === this.props.match.params.careplanId) ?? this.state.careplans[0]
    return (
      <Grid container spacing={3}>
        <Grid item xs={3}>
          <Stack spacing={3} >
                <CareplanUnreadResponse careplan={activeCareplan} questionnaireResponses={this.state.questionnaireResponses}/>
                <PatientCard patient={activeCareplan.patient}></PatientCard>
                <CareplanSummary careplan={activeCareplan}></CareplanSummary>
            </Stack>
        </Grid>
        <Grid item xs={9}>
        <Stack spacing={3}>
            <CareplanQuestionnaireSummary questionnaireResponses={this.state.questionnaireResponses} careplan={activeCareplan}/>
            <ObservationCard questionnaire={activeCareplan.questionnaires[0]} careplan={activeCareplan}/>    
            </Stack>
        </Grid>
      </Grid>

    )
  }


  
  }
  export default PatientCareplans;