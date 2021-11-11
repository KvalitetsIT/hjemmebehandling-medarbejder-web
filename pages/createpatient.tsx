import { Button, CardContent } from '@material-ui/core';
import React, { Component } from 'react';
import Stack from '@mui/material/Stack';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import {Box, Card, Step, StepLabel, Stepper, Typography } from '@mui/material';
import { PatientDetail } from '../components/Models/PatientDetail';
import { Contact } from '../components/Models/Contact';
import ApiContext from './_context';
import IPatientService from '../services/interfaces/IPatientService';
import { LoadingComponent } from '../components/Layout/LoadingComponent';
import { PatientCareplan } from '../components/Models/PatientCareplan';
import { QuestionnaireListSimple } from '../components/Cards/QuestionnaireListSimple';
import { PatientEditCard } from '../components/Cards/PatientEditCard';
import { Address } from '../components/Models/Address';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { ContactEditCard } from '../components/Cards/ContactEditCard';
import { PlanDefinitionSelect } from '../components/Input/PlanDefinitionSelect';
import ICareplanService from '../services/interfaces/ICareplanService';

export interface Accordians{
  PatientIsOpen : boolean
  RelativeContactIsOpen : boolean
  PlanDefinitionIsOpen : boolean
}
export interface Props{
  openAccordians : Accordians
}

export interface State {
    accordians : Accordians
    patient : PatientDetail;
    careplan : PatientCareplan;
    loading: boolean;
}



export default class CreatePatient extends Component<Props,State> {
  static contextType = ApiContext;
  static displayName = CreatePatient.name;
  careplanService!: ICareplanService;
  patientService!: IPatientService;

constructor(props : Props){
  
    super(props);

    this.SaveCareplan = this.SaveCareplan.bind(this);

    const relativeContact = new Contact();
    const newPatient = new PatientDetail();
    newPatient.firstname = "";
    newPatient.lastname = "";
    newPatient.patientContact = new Contact();
    newPatient.patientContact.address = new Address()
    newPatient.patientContact.address.city ="";
    newPatient.patientContact.address.zipCode ="";
    newPatient.patientContact.address.road ="";
    
    newPatient.contact = relativeContact
    newPatient.contact.address = new Address();
    
    const newCareplan = new PatientCareplan();
    newCareplan.patient = newPatient;
    
    this.state = {
      patient : newPatient,
      loading : false,
      careplan : newCareplan,
      accordians : props.openAccordians
    }

}
InitializeServices() : void{
  this.careplanService = this.context.careplanService;
  this.patientService = this.context.patientService;
}

async submitPatient() : Promise<void>{
  this.state.careplan.patient = this.state.patient;
  
  console.log(this.state.careplan)
  try{
    this.setState({
      loading: true
    })
    const newCarePlan = await this.careplanService.CreateCarePlan(this.state.careplan)
    this.setState({
      careplan: newCarePlan,
      patient : newCarePlan.patient
    })
  } catch(error){
    this.setState({
      loading: false
    })
    throw error;
  }
  
}

SaveCareplan(editedCareplan : PatientCareplan) : void{
  this.setState({careplan : editedCareplan})
  this.forceUpdate();
}

getActiveStep() : number{
  if(this.state.accordians.PatientIsOpen)
    return 0

  if(this.state.accordians.RelativeContactIsOpen)
    return 1

  if(this.state.accordians.PlanDefinitionIsOpen)
    return 2

  return 3;
}

getAllClosedAccordian() : Accordians{
  return {
    PatientIsOpen : false,
    RelativeContactIsOpen : false,
    PlanDefinitionIsOpen : false,
  }
}
goToPatientIsOpen() : void{
  const accordians = this.getAllClosedAccordian();
  accordians.PatientIsOpen = !this.state.accordians.PatientIsOpen;
  this.setState({accordians : accordians})
}

goToPlanDefinitionIsOpen() : void{
  const accordians = this.getAllClosedAccordian();
  accordians.PlanDefinitionIsOpen = !this.state.accordians.PlanDefinitionIsOpen;
  this.setState({accordians : accordians})
}

goToRelativeContactIsOpen() : void{
  const accordians = this.getAllClosedAccordian();
  accordians.RelativeContactIsOpen = !this.state.accordians.RelativeContactIsOpen;
  this.setState({accordians : accordians})
}

goToSave() : void{
  const accordians = this.getAllClosedAccordian();
  this.setState({accordians : accordians})
}

  render () : JSX.Element{
    this.InitializeServices();
    return (
      <form onSubmit={async ()=>await this.submitPatient()}> 
        <Stack direction="row" spacing={3}> 
        
      <Stack spacing={3}>

      <Accordion expanded={this.state.accordians.PatientIsOpen} onChange={()=>this.goToPatientIsOpen()}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1bh-content"
          id="panel1bh-header"
        >
          <Typography sx={{ width: '33%', flexShrink: 0 }}>
            Patient
          </Typography>
          <Typography sx={{ color: 'text.secondary' }}>Tilret patient</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            <PatientEditCard initialPatient={this.state.patient}/>
          </Typography>
          <Button component={Box} marginTop={2} onClick={()=>this.goToRelativeContactIsOpen()} variant="contained">Fortsæt</Button>
        </AccordionDetails>
      </Accordion>
        
      <Accordion expanded={this.state.accordians.RelativeContactIsOpen} onChange={()=>this.goToRelativeContactIsOpen()}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1bh-content"
          id="panel1bh-header"
        >
          <Typography sx={{ width: '33%', flexShrink: 0 }}>
            Pårørende
          </Typography>
          <Typography sx={{ color: 'text.secondary' }}>Tilret pårørende</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            <ContactEditCard initialContact={this.state.patient.contact}/>
          </Typography>
          <Button component={Box} marginTop={2} onClick={()=>this.goToPlanDefinitionIsOpen()} variant="contained">Fortsæt</Button>
        </AccordionDetails>
      </Accordion>

      <Accordion expanded={this.state.accordians.PlanDefinitionIsOpen} onChange={()=>this.goToPlanDefinitionIsOpen()}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1bh-content"
          id="panel1bh-header"
        >
          <Typography sx={{ width: '33%', flexShrink: 0 }}>
            Patientgruppe
          </Typography>
          <Typography sx={{ color: 'text.secondary' }}>Tilret patientgrupper</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
           <PlanDefinitionSelect SetEditedCareplan={this.SaveCareplan} careplan={this.state.careplan}/>
            <QuestionnaireListSimple careplan={this.state.careplan}/>
          </Typography>
          <Button component={Box} marginTop={2} onClick={()=>this.goToSave()} variant="contained">Fortsæt</Button>
        </AccordionDetails>
      </Accordion>
      <Button type="submit" variant="contained">Opret patient</Button>
        </Stack>
        <div>
        <Card>
          <CardContent>
        <Stepper orientation="vertical" activeStep={this.getActiveStep()}>
          <Step key="patient">
          <StepLabel>Patient</StepLabel>

          </Step>
          <Step key="relativecontact">
          
          <StepLabel>Pårørende</StepLabel>

          </Step>
          <Step key="plandefinition">
          <StepLabel>Patientgruppe</StepLabel>
          </Step>
          
        </Stepper>
        </CardContent>
        </Card>
        </div>
        </Stack>
        
        {this.state.loading ? <LoadingComponent /> : ""}
        </form>
        
    )
  }

  
}
