import * as React from 'react';

import { Stack } from '@mui/material';
import Grid from '@mui/material/Grid';
import { PatientCard } from '../../../../../components/Cards/PatientCard';
import { PatientCareplan } from '../../../../../components/Models/PatientCareplan';
import ApiContext from '../../../../_context';
import { LoadingComponent } from '../../../../../components/Layout/LoadingComponent';
import { CareplanCardSimple } from '../../../../../components/Cards/CareplanCardSimple';
import { CareplanUnreadResponse } from '../../../../../components/Alerts/CareplanUnreadResponse';
import { QuestionnaireCardSimple } from '../../../../../components/Cards/QuestionnaireCardSimple';
import { ThresholdCardOverview } from '../../../../../components/Cards/ThresholdCardOverview';
import ICareplanService from '../../../../../services/interfaces/ICareplanService';
import { CareplanSelectorCard } from '../../../../../components/Cards/CareplanSelectorCard';
import LocalPhoneOutlinedIcon from '@mui/icons-material/LocalPhoneOutlined';
import HealingOutlinedIcon from '@mui/icons-material/HealingOutlined';
import { ContactThumbnail } from '../../../../../components/Cards/ContactThumbnail';

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

  render () {
      this.InitializeServices();
    let contents = this.state.loading ? <LoadingComponent/> : this.renderCareplanTab();
    return contents;
  }
  InitializeServices(){
    this.careplanService = this.context.careplanService;
  }

  componentDidMount(){
    this.populateCareplans()
}


async populateCareplans() {
  let cpr = this.props.match.params.cpr;

  let responses : PatientCareplan[] = await this.careplanService.GetPatientCareplans(cpr);
  console.log(responses)
  this.setState({
      careplans : responses,
      loading : false,

  });
}


  //=====================TABS===============================

  renderCareplanTab(){
    
    let careplans = this.state.careplans;
    if(careplans.length === 0)
        return (
            <div>Ingen behandlingsplaner fundet :-(</div>
        )

    let activeCareplan = this.state.careplans.find(c => c.id === this.props.match.params.careplanId) ?? this.state.careplans[0]
    return (
        <>
        <Grid container spacing={2}>
        <Grid item xs={12}>
        <Stack direction="row" spacing={2}>
            <ContactThumbnail color="palevioletred" headline="Patient" boxContent={<HealingOutlinedIcon fontSize="large"/>} contact={activeCareplan?.patient.patientContact}></ContactThumbnail>
            <ContactThumbnail color="lightblue" headline="Primær kontakt" boxContent={<LocalPhoneOutlinedIcon fontSize="large"/>} contact={activeCareplan?.patient.contact}></ContactThumbnail>
        </Stack>
        </Grid>
        </Grid>
            <Grid container spacing={2}>
                <Grid item xs={2}>
                
                    <Stack spacing={2}>
                        <CareplanSelectorCard activeCareplan={activeCareplan} careplans={this.state.careplans}/>
                        <PatientCard patient={activeCareplan.patient}/>
                        
                    </Stack>
                </Grid>

                <Grid item xs={9}>
                    <Stack spacing={1}>
                        
                        <CareplanCardSimple careplan={activeCareplan}/>
                        <CareplanUnreadResponse careplan={activeCareplan} />
                        <Grid container spacing={1}>
                            <Grid item xs={5}>
                                {activeCareplan.questionnaires.map(questionnaire => {
                                    return (
                                        <QuestionnaireCardSimple cpr={activeCareplan.patient.cpr!} questionnaire={questionnaire}/> 
                                    )
                                })}
                            </Grid>
                            <Grid item xs={7}>
                            {activeCareplan.questionnaires.map(questionnaire => {
                                    return (
                                        <ThresholdCardOverview questionnaire={questionnaire}/> 
                                    )
                                })}
                            </Grid>
                        </Grid>
                    </Stack>
                </Grid>
            </Grid>
        </>
    )
  }


  
  }
  export default PatientCareplans;