import * as React from 'react';

import { Stack } from '@mui/material';
import { PatientCard } from '../../../../../components/Cards/PatientCard';
import { PatientCareplan } from '../../../../../components/Models/PatientCareplan';
import ApiContext from '../../../../_context';
import { LoadingComponent } from '../../../../../components/Layout/LoadingComponent';
import ICareplanService from '../../../../../services/interfaces/ICareplanService';
import { CareplanSummary } from '../../../../../components/Cards/CareplanSummary';
import { FinishCareplanButton } from '../../../../../components/Input/FinishCareplanButton';
import { CareplanQuestionnaireSummary } from '../../../../../components/Cards/CareplanQuestionnaireSummary';
import { ObservationCard } from '../../../../../components/Cards/ObservationCard';
import { CareplanUnreadResponse } from '../../../../../components/Alerts/CareplanUnreadResponse';

interface State {
  
  loading: boolean
  careplans : PatientCareplan[]
}
interface Props {
    match : { params : {cpr : string, careplanId : string} }

}
class PatientCareplans extends React.Component<Props,State> {
  static contextType = ApiContext
  careplanService! : ICareplanService

  constructor(props : Props){
    super(props);
    this.state = {
        loading : true,
        careplans : []
    }
    
}

  render () : JSX.Element{
      this.InitializeServices();
    const contents = this.state.loading ? <LoadingComponent/> : this.renderCareplanTab();
    return contents;
  }
  InitializeServices():void{
    this.careplanService = this.context.careplanService;
  }

  componentDidMount():void{
    this.populateCareplans()
}


async populateCareplans() : Promise<void>{
  const cpr = this.props.match.params.cpr;

  const responses : PatientCareplan[] = await this.careplanService.GetPatientCareplans(cpr);
  console.log(responses)
  this.setState({
      careplans : responses,
      loading : false,

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
        <Stack direction="row" spacing={3}>
            <Stack spacing={3}>
                <CareplanUnreadResponse careplan={activeCareplan}/>
                <PatientCard patient={this.state.careplans[0].patient}></PatientCard>
                <CareplanSummary careplan={activeCareplan}></CareplanSummary>
                <FinishCareplanButton careplan={activeCareplan}/>
            </Stack>
            <Stack spacing={3}>
                <CareplanQuestionnaireSummary careplan={activeCareplan}/>
                <ObservationCard careplan={activeCareplan}/>
            </Stack>
        </Stack>
    )
  }


  
  }
  export default PatientCareplans;