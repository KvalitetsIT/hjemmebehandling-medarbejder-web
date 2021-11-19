import { CardContent, Typography } from '@material-ui/core';
import React, { Component } from 'react';
import Stack from '@mui/material/Stack';
import { Card, Skeleton, TextField } from '@mui/material';
import { PatientDetail } from '../Models/PatientDetail';
import ApiContext from '../../pages/_context';
import IPersonService from '../../services/interfaces/IPersonService';
import { Alert, AlertColor, Snackbar } from '@mui/material';
import { LoadingButton } from '@mui/lab';

export interface Props {
    initialPatient : PatientDetail
}

export interface State {
    loadingCprButton : boolean;
    loadingPage : boolean
    patient : PatientDetail;
    
    snackbarOpen : boolean;
    snackbarColor: AlertColor;
    snackbarText : string;
    snackbarTitle : string;
}

export class PatientEditCard extends Component<Props,State> {
  static contextType = ApiContext;
  static displayName = PatientEditCard.name; 
  personService!: IPersonService;

  constructor(props : Props){
      super(props);
      this.state = {
	      loadingCprButton : false,
        loadingPage : true,
	      patient : props.initialPatient,
	      snackbarOpen : false,
          snackbarColor: "info",
          snackbarText : "",
          snackbarTitle : "" }
      this.modifyPatient = this.modifyPatient.bind(this);
  }
  closeSnackbar = () : void => {
    this.setState({snackbarOpen : false})
  };

  render () : JSX.Element{
    const contents = this.state.loadingPage ? <Skeleton variant="rectangular" height={200} /> : this.renderCard();
    return contents;
  }

  componentDidMount() : void {
      this.setState({loadingPage:false})
}

InitializeServices() : void{
  this.personService = this.context.personService;
}

async getPerson() : Promise<void>{
  try{
    if (this.state.patient.cpr === null || this.state.patient.cpr === ""){
	  return;
    }
    
    this.setState({
      loadingCprButton: true
    })
    
    const newPerson = await this.personService.GetPerson(this.state.patient.cpr!);
    
    const p = this.state.patient;
    p.firstname = newPerson.givenName;
    p.lastname = newPerson.familyName;
    
    p.patientContact.address.city = newPerson.patientContactDetails?.city ? newPerson.patientContactDetails.city : "";
    p.patientContact.address.zipCode = newPerson.patientContactDetails?.postalCode ? newPerson.patientContactDetails.postalCode : "";
    p.patientContact.address.road = newPerson.patientContactDetails?.street ? newPerson.patientContactDetails.street : "";
    
    this.setState({patient : p});
    

    this.setState({
      loadingCprButton: false
    })
    
  } catch(error){
	this.setState({
    loadingCprButton: false
    })
    
    if (error instanceof Response){
	   const response = error as Response;
    
      if (response.status == 404){
	     console.log("Ingen borger fundet");
	     this.setState({snackbarColor : "warning",snackbarOpen : true,snackbarTitle: "Person kan ikke fremsøges", snackbarText: "Cprnummer skal skrives uden bindestreg og være 10 cifre langt"})
         this.clearPersonFields();
         return;
	  }
    }
    throw error;
  }
  
}

clearPersonFields() : void {
	const p = this.state.patient;
    p.firstname = "";
    p.lastname = "";
    
    p.patientContact.address.city = "";
    p.patientContact.address.zipCode =  "";
    p.patientContact.address.road = "";
    
    this.setState({patient : p});
}

modifyPatient(patientModifier : (patient : PatientDetail, newValue : string) => PatientDetail, input :  React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement> ) : void{
  const valueFromInput = input.currentTarget.value;
    const modifiedPatient = patientModifier(this.state.patient,valueFromInput);
    this.setState({patient : modifiedPatient  })
  }

  renderCard() : JSX.Element{
	this.InitializeServices();
    return ( <>
        <Card>
        <CardContent>
          <Stack spacing={3}>
          <Typography variant="inherit">
          Patient
      </Typography>
            <Stack direction="row">
              <TextField size="small" id="outlined-basic" required label="CPR" value={this.state.patient.cpr} onChange={input => this.modifyPatient(this.setCpr,input) }  variant="outlined" />
              <LoadingButton loading={this.state.loadingCprButton} size="small" variant="contained" onClick={async ()=>await this.getPerson()}>Fremsøg</LoadingButton>
            </Stack>
            <Stack spacing={3} direction="row">
              <TextField disabled id="outlined-basic" label="Fornavn" value={this.state.patient.firstname} onChange={input => this.modifyPatient(this.setFirstname,input) }  variant="outlined" />
              <TextField disabled id="outlined-basic" label="Efternavn" value={this.state.patient.lastname} onChange={input => this.modifyPatient(this.setLastname,input) } variant="outlined" />
            </Stack>
            <Stack spacing={3} direction="row">
              <TextField disabled id="outlined-basic" label="Addresse" value={this.state.patient.patientContact.address.road} onChange={input => this.modifyPatient(this.setRoad,input) }  variant="outlined" />
              <TextField disabled id="outlined-basic" label="Postnummer" value={this.state.patient.patientContact.address.zipCode} onChange={input => this.modifyPatient(this.setZipcode,input) }  variant="outlined" />
              <TextField disabled id="outlined-basic" label="By" value={this.state.patient.patientContact.address.city} onChange={input => this.modifyPatient(this.setCiy,input) }  variant="outlined" />
            </Stack>
            <Stack spacing={3} direction="row">
              <TextField id="outlined-basic" type="tel" label="Primært telefonnummer" value={this.state.patient.patientContact.primaryPhone} onChange={input => this.modifyPatient(this.setPrimaryPhonenumber,input) } variant="outlined" />
              <TextField id="outlined-basic" type="tel" label="sekundært telefonnummer" value={this.state.patient.patientContact.secondaryPhone} onChange={input => this.modifyPatient(this.setSecondaryPhonenumber,input) } variant="outlined" />
            </Stack>
         </Stack>

          
        </CardContent>
    </Card>
                        <Snackbar open={this.state.snackbarOpen} autoHideDuration={6000} onClose={this.closeSnackbar} anchorOrigin={{vertical: 'bottom',horizontal: 'right'}}>
                        <Alert severity={this.state.snackbarColor} sx={{ width: '100%' }}>
                            <h5>{this.state.snackbarTitle}</h5>
                            {this.state.snackbarText}
                        </Alert>
                    </Snackbar>
                    </>
    )
  }
  

  setLastname(oldPatient : PatientDetail, newValue : string ) : PatientDetail {
    const modifiedPatient = oldPatient;
    modifiedPatient.lastname = newValue;
    return modifiedPatient;
  }
  setFirstname(oldPatient : PatientDetail, newValue : string ) : PatientDetail {
    const modifiedPatient = oldPatient;
    modifiedPatient.firstname = newValue;
    return modifiedPatient;
  }
  setCpr(oldPatient : PatientDetail, newValue : string ) : PatientDetail {
    const modifiedPatient = oldPatient;
    modifiedPatient.cpr = newValue;
    return modifiedPatient;
  }
  
  setRoad(oldPatient : PatientDetail, newValue : string ) : PatientDetail {
    const modifiedPatient = oldPatient;
    modifiedPatient.patientContact.address.road = newValue;
    return modifiedPatient;
  }
  setZipcode(oldPatient : PatientDetail, newValue : string ) : PatientDetail {
    const modifiedPatient = oldPatient;
    modifiedPatient.patientContact.address.zipCode = newValue;
    return modifiedPatient;
  }
  
  setCiy(oldPatient : PatientDetail, newValue : string ) : PatientDetail {
    const modifiedPatient = oldPatient;
    modifiedPatient.patientContact.address.city = newValue;
    return modifiedPatient;
  }
  
  setPrimaryPhonenumber(oldPatient : PatientDetail, newValue : string ) : PatientDetail {
    const modifiedPatient = oldPatient;
    modifiedPatient.patientContact.primaryPhone = newValue;
    return modifiedPatient;
  }
  
  setSecondaryPhonenumber(oldPatient : PatientDetail, newValue : string ) : PatientDetail {
    const modifiedPatient = oldPatient;
    modifiedPatient.patientContact.secondaryPhone = newValue;
    return modifiedPatient;
  }
  


}
