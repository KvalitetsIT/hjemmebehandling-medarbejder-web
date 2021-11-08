import { Button } from '@material-ui/core';
import React, { Component } from 'react';
import Stack from '@mui/material/Stack';
import { PatientDetail } from '../../../components/Models/PatientDetail';
import ApiContext from '../../_context';
import { PatientEditCard } from '../../../components/Cards/PatientEditCard';
import { LoadingComponent } from '../../../components/Layout/LoadingComponent';
import IPatientService from '../../../services/interfaces/IPatientService';



export interface Props {
    match : { params : {cpr : string} }
}
export interface State {
    patient : PatientDetail;
    loading: boolean;
}



export default class EditPatient extends Component<Props,State> {
  static contextType = ApiContext
  static displayName = EditPatient.name;
  patientService!: IPatientService;

constructor(props : Props){
  
    super(props);

    this.state = {
      loading : false,
      patient : new PatientDetail()
    }

}
InitializeServices(){
  this.patientService = this.context.patientService;
}


async submitPatient(){
  
  try{
    this.setState({
      loading: true
    })
    let newPatient = await this.patientService.EditPatient(this.state.patient)
    this.setState({
      patient : newPatient
    })
  } catch(error){
    this.setState({
      loading: false
    })
    throw error;
  }
  
}

async componentDidMount(){
    this.setState({loading : true})
    await this.populatePatient();
    this.setState({loading : false})
}

async populatePatient(){
    let patient = await this.patientService.GetPatient(this.props.match.params.cpr)
    this.setState({
        patient : patient
    })
}

  render () {
    this.InitializeServices();

    return this.state.loading ? <LoadingComponent/> : this.RenderEditPage();

  }

  RenderEditPage(){
    return (
        <form onSubmit={async ()=>await this.submitPatient()}>
        <Stack direction="row" spacing={3}>
           
        <PatientEditCard initialPatient={this.state.patient} />
          </Stack>
          <br/>
          <Button variant="contained" color="inherit" type="submit">Gem</Button>
          {this.state.loading ? <LoadingComponent /> : ""}
          </form>
      )
  }

  
}
