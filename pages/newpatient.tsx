import { Button, CardContent } from '@material-ui/core';
import React, { Component } from 'react';
import Stack from '@mui/material/Stack';
import { Card } from '@mui/material';
import { PatientDetail } from '../components/Models/PatientDetail';
import { Contact } from '../components/Models/Contact';
import ApiContext from './_context';
import IPatientService from '../services/interfaces/IPatientService';
import { LoadingComponent } from '../components/Layout/LoadingComponent';
import { CareplanCardSimple } from '../components/Cards/CareplanCardSimple';
import { PatientCareplan } from '../components/Models/PatientCareplan';
import { QuestionnaireListSimple } from '../components/Cards/QuestionnaireListSimple';
import { PatientEditCard } from '../components/Cards/PatientEditCard';

export interface State {
    patient : PatientDetail;
    careplan : PatientCareplan;
    loading: boolean;
}



export default class NewPatient extends Component<{},State> {
  static contextType = ApiContext;
  static displayName = NewPatient.name;
  patientService!: IPatientService;

constructor(props : {}){
  
    super(props);

    
    this.SaveCareplan = this.SaveCareplan.bind(this);

    const relativeContact = new Contact();
    const newPatient = new PatientDetail();
    newPatient.firstname = "";
    newPatient.lastname = "";
    newPatient.patientContact = new Contact();
    newPatient.patientContact.address.city ="";
    newPatient.patientContact.address.zipCode ="";
    newPatient.patientContact.address.road ="";
    
    newPatient.contact = relativeContact
    
    const newCareplan = new PatientCareplan();
    newCareplan.patient = newPatient;
    
    this.state = {
      patient : newPatient,
      loading : false,
      careplan : newCareplan
    }

}
InitializeServices() : void{
  this.patientService = this.context.patientService;
}

SaveCareplan(editedCareplan : PatientCareplan) : void{
  this.setState({careplan : editedCareplan})
  this.forceUpdate();
}



async submitPatient() : Promise<void>{
  this.state.careplan.patient = this.state.patient;
  
  console.log(this.state.careplan)
  try{
    this.setState({
      loading: true
    })
    const newPatient = await this.patientService.CreatePatient(this.state.patient)
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

  render () : JSX.Element{
    this.InitializeServices();
    return (
      <form onSubmit={async ()=>await this.submitPatient()}> 
      <Stack direction="row" spacing={3}>
         
        <PatientEditCard initialPatient={this.state.patient} />
        <Card>
          <CardContent>
          <Stack spacing={2}>
          <CareplanCardSimple specialSaveFunc={this.SaveCareplan} careplan={new PatientCareplan()} />
          <QuestionnaireListSimple careplan={this.state.careplan} />
        </Stack>
          </CardContent>
        </Card>
        
        
        </Stack>
        <br/>
        <Button type="submit" variant="contained" color="inherit" >Opret patient</Button>
        {this.state.loading ? <LoadingComponent /> : ""}
        </form>
        
    )
  }

  
}
