import React, { Component } from 'react';
import Stack from '@mui/material/Stack';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import {Button, CardContent, Box, Card, Grid, Step, StepLabel, Stepper, Tooltip, Typography } from '@mui/material';
import { PatientDetail } from '../components/Models/PatientDetail';
import { Contact } from '../components/Models/Contact';
import ApiContext from './_context';
import IPatientService from '../services/interfaces/IPatientService';
import { LoadingBackdropComponent } from '../components/Layout/LoadingBackdropComponent';
import { PatientCareplan } from '../components/Models/PatientCareplan';
import { QuestionnaireListSimple } from '../components/Cards/QuestionnaireListSimple';
import { PatientEditCard } from '../components/Cards/PatientEditCard';
import { Address } from '../components/Models/Address';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { ContactEditCard } from '../components/Cards/ContactEditCard';
import { PlanDefinitionSelect } from '../components/Input/PlanDefinitionSelect';
import ICareplanService from '../services/interfaces/ICareplanService';
import { Redirect } from 'react-router-dom';
import { ErrorBoundary } from '../components/Layout/ErrorBoundary';
import { CSSProperties } from '@material-ui/styles';

export interface Accordians{
  PatientIsOpen : boolean
  RelativeContactIsOpen : boolean
  PlanDefinitionIsOpen : boolean
}
export interface Props{
  openAccordians : Accordians
  match : { params : {cpr? : string, questionnaireId? : string,careplanId? : string} }
}

export interface State {
    accordians : Accordians;
    patient? : PatientDetail;
    careplan? : PatientCareplan;
    newCareplanId? : string;
    loading: boolean;
    canSubmit : boolean;
    submitted : boolean
    
    patientError? : string;
    contactError? : string;
    planDefinitionError? : string

}



export default class CreatePatient extends Component<Props,State> {
  static contextType = ApiContext;
  static displayName = CreatePatient.name;
  careplanService!: ICareplanService;
  patientService!: IPatientService;

constructor(props : Props){
  
    super(props);

    this.SaveCareplan = this.SaveCareplan.bind(this);
    
    this.state = {
      loading : true,
      submitted : false,
      canSubmit : false,
      accordians : props.openAccordians
    }

}
InitializeServices() : void{
  this.careplanService = this.context.careplanService;
  this.patientService = this.context.patientService;
}

createNewEmptyCareplan() : PatientCareplan{
  const relativeContact = new Contact();
  const newPatient = new PatientDetail();
  newPatient.address = new Address()

  newPatient.contact = relativeContact
  
  const newCareplan = new PatientCareplan();
  newCareplan.patient = newPatient;
  return newCareplan;
}

async submitPatient() : Promise<void>{
  if(!(this.state.careplan && this.state.careplan.patient)){
    return;
  }

  this.state.careplan.patient = this.state.patient!;
  
  console.log(this.state.careplan)
    this.setState({
      loading: true
    })
    try {
      const newCareplanId = await this.careplanService.CreateCarePlan(this.state.careplan)
      this.setState({
        newCareplanId : newCareplanId,
        submitted : true
      })
    }
    catch(error) {
      this.setState(() => { throw error })
    }
}

SaveCareplan(editedCareplan : PatientCareplan) : void{
  this.setState({careplan : editedCareplan})
  this.forceUpdate();
}

async componentDidMount() :  Promise<void> {
  const cpr = this.props.match.params.cpr;
  try{
    let careplanToEdit : PatientCareplan | undefined = this.createNewEmptyCareplan()
    if(cpr){
      const careplansForPatient = await this.careplanService.GetPatientCareplans(cpr)
      careplanToEdit = careplansForPatient.find(x=>!x.terminationDate);
    }
    
    this.setState({loading : false,careplan : careplanToEdit, patient : careplanToEdit ? careplanToEdit.patient : undefined})
    
  } catch(error){
    this.setState(()=>{throw error})
  }
}

getFirstError() : string{
  if(this.state.patientError)
    return "Fejl i Patient-sektion"

  if(this.state.contactError)
    return "Fejl i Pårørende-sektion"

  if(this.state.planDefinitionError)
    return "Fejl i Patientgruppe-sektion"

  return "";
}
continueButtonStyle : CSSProperties = {
  marginTop : 2
}
  render () : JSX.Element{
    this.InitializeServices();

    if(this.state.submitted)
      return (<Redirect push to={"/patients/" + this.state.patient?.cpr + "/careplans/" + this.state.newCareplanId}/>)

    if(this.state.loading)
      return (<LoadingBackdropComponent />)

    if(!(this.state.patient && this.state.careplan) )
      return (<div>Fandt ikke patienten</div>)

    let canSubmit : boolean = true;
    canSubmit &&= this.state.patient.cpr ? true : false; //CPR Must be filled
    canSubmit &&= !this.state.patientError ? true : false; //No errors in patient section
    canSubmit &&= !this.state.contactError ? true : false //No errors in contact section
    canSubmit &&= !this.state.planDefinitionError ? true : false //No errors in planDefinitionSection
    canSubmit &&= this.state.careplan.planDefinitions.length === 0 ? false : true; //Plandefinition must be filled!

    return (
      <form onSubmit={(e)=>{e.preventDefault(); this.submitPatient()}} noValidate onBlur={()=>this.forceUpdate()}  > 
      <Grid container>

      
      <Grid item spacing={5} xs={7}  >
      
       
      <ErrorBoundary>
      <Accordion expanded={this.state.accordians.PatientIsOpen} onChange={()=>this.goToPatientIsOpen()}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1bh-content"
          id="panel1bh-header"
        >
          <Typography sx={{ width: '33%', flexShrink: 0 }}>
            Patient *
          </Typography>
          <Typography sx={{ color: 'text.secondary' }}>Tilret patient</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            <PatientEditCard 
              onValidation={(errors) => this.setState({patientError : errors?.length == 0 ? undefined : errors[0].message})}
              initialPatient={this.state.patient}
            />
          </Typography>
          <Button sx={this.continueButtonStyle} disabled={this.state.patientError ? true : false} onClick={()=>this.goToRelativeContactIsOpen()} variant="contained">Fortsæt</Button>
        </AccordionDetails>
      </Accordion>
      </ErrorBoundary>

      <ErrorBoundary>
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
            <ContactEditCard 
              onValidation={(errors) => this.setState({contactError : errors?.length == 0 ? undefined : errors[0].message})}
              initialContact={this.state.patient.contact}/>
          </Typography>
          <Button disabled={this.state.contactError ? true : false} sx={this.continueButtonStyle} onClick={()=>this.goToPlanDefinitionIsOpen()} variant="contained">Fortsæt</Button>
        </AccordionDetails>
      </Accordion>
      </ErrorBoundary>

      <ErrorBoundary>
      <Accordion expanded={this.state.accordians.PlanDefinitionIsOpen} onChange={()=>this.goToPlanDefinitionIsOpen()}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1bh-content"
          id="panel1bh-header"
        >
          <Typography sx={{ width: '33%', flexShrink: 0 }}>
            Patientgruppe *
          </Typography>
          <Typography sx={{ color: 'text.secondary' }}>Tilret patientgrupper</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            
            <PlanDefinitionSelect onValidation={(errors) => this.setState({planDefinitionError : errors?.length == 0 ? undefined : errors[0].message})} SetEditedCareplan={this.SaveCareplan} careplan={this.state.careplan}/>
            <QuestionnaireListSimple careplan={this.state.careplan}/>
      
          </Typography>
          <Button disabled={this.state.planDefinitionError ? true : false} sx={this.continueButtonStyle} component={Box} onClick={()=>this.goToSave()} variant="contained">Fortsæt</Button>
        </AccordionDetails>
      </Accordion>
      
      </ErrorBoundary>

      <Tooltip title={this.getFirstError()}>
        <Stack paddingTop={5}>
      <Button disabled={!canSubmit} type="submit" variant="contained">Gem patient</Button>
      </Stack>
      </Tooltip>
   
      
      </Grid>
       <Grid paddingLeft={3} xs={2}>
        <div>
        <Card>
          <CardContent>
        <Stepper orientation="vertical" activeStep={this.getActiveStep()}>
          <Step key="patient">
          <StepLabel optional={this.state.patientError} error={this.state.patientError ? true : false}>Patient *</StepLabel>

          </Step>
          <Step key="relativecontact">
          
          <StepLabel optional={this.state.contactError} error={this.state.contactError ? true : false}>Pårørende</StepLabel>

          </Step>
          <Step key="plandefinition">
          <StepLabel optional={this.state.planDefinitionError} error={this.state.planDefinitionError ? true : false}>Patientgruppe *</StepLabel>
          </Step>
          
        </Stepper>
        </CardContent>
        </Card>
        </div>
        </Grid>

        </Grid>
        </form>
        
        
    )
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

  
}
