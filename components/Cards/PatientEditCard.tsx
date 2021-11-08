import { Button, CardContent, Divider, Typography } from '@material-ui/core';
import React, { Component } from 'react';
import Stack from '@mui/material/Stack';
import { Card, Skeleton, TextField } from '@mui/material';
import { PatientDetail } from '../Models/PatientDetail';
import ApiContext from '../../pages/_context';
import IPersonService from '../../services/interfaces/IPersonService';

export interface Props {
    initialPatient : PatientDetail
}

export interface State {
    loading : boolean;
    patient : PatientDetail
}

export class PatientEditCard extends Component<Props,State> {
  static contextType = ApiContext;
  static displayName = PatientEditCard.name;
  personService!: IPersonService;

  constructor(props : Props){
      super(props);
      this.state = {loading : true, patient : props.initialPatient}
      this.modifyPatient = this.modifyPatient.bind(this);
  }

  render () {
    let contents = this.state.loading ? <Skeleton variant="rectangular" height={200} /> : this.renderCard();
    return contents;
  }

  componentDidMount(){
      this.setState({loading:false})
}

InitializeServices(){
  this.personService = this.context.personService;
}

async getPerson(){
  try{
    if (this.state.patient.cpr == null || this.state.patient.cpr==""){
	  return;
    }
    
    this.setState({
      loading: true
    })
    let newPerson = await this.personService.GetPerson(this.state.patient.cpr);
    
    let p = this.state.patient;
    p.firstname = newPerson.givenName;
    p.lastname = newPerson.familyName;
    p.patientContact.address.city = newPerson.patientContactDetails.city;
    p.patientContact.address.zipCode = newPerson.patientContactDetails.postalCode;
    p.patientContact.address.road = newPerson.patientContactDetails.street;    
    this.setState({patient : p});
    

    this.setState({
      loading: false
    })
    
  } catch(error){
    this.setState({
      loading: false
    })
    throw error;
  }
  
}

modifyPatient(patientModifier : (patient : PatientDetail, newValue : string) => PatientDetail, input :  React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement> ){
    let valueFromInput = input.currentTarget.value;
    let modifiedPatient = patientModifier(this.state.patient,valueFromInput);
    this.setState({patient : modifiedPatient  })
  }

  renderCard(){
	this.InitializeServices();
    return (
        <Card>
        <CardContent>
          <Stack spacing={3}>
          <Typography variant="inherit">
          Patient
      </Typography>
            <Stack direction="row">
              <TextField size="small" id="outlined-basic" required type="number" label="CPR" value={this.state.patient.cpr} onChange={input => this.modifyPatient(this.setCpr,input) }  variant="outlined" />
              <Button size="small" variant="contained" onClick={async ()=>await this.getPerson()}>Fremsøg</Button>
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
              <TextField id="outlined-basic" type="tel" label="Telefonnummer" value={this.state.patient.patientContact.primaryPhone} onChange={input => this.modifyPatient(this.setPhonenumber,input) } variant="outlined" />
              <TextField id="outlined-basic" type="email" label="Email" value={this.state.patient.patientContact.emailAddress} onChange={input => this.modifyPatient(this.setEmail,input) } variant="outlined" />
            </Stack>
            <Divider/>
            <Typography variant="inherit">
          Pårørede
      </Typography>
      <Stack spacing={3} direction="row">
              <TextField id="outlined-basic" label="Fornavn" value={this.state.patient.contact.fullname} onChange={input => this.modifyPatient(this.setRelativeContactsName,input) }  variant="outlined" />
            </Stack>
            <Stack spacing={3} direction="row">
              <TextField id="outlined-basic" label="Addresse" value={this.state.patient.contact.address.road} onChange={input => this.modifyPatient(this.setRelativeContactsRoad,input) }  variant="outlined" />
              <TextField id="outlined-basic" label="Postnummer" value={this.state.patient.contact.address.zipCode} onChange={input => this.modifyPatient(this.setRelativeContactsZipcode,input) }  variant="outlined" />
              <TextField id="outlined-basic" label="By" value={this.state.patient.contact.address.city} onChange={input => this.modifyPatient(this.setRelativeContactsCity,input) }  variant="outlined" />
            </Stack>
            <Stack spacing={3} direction="row">
              <TextField id="outlined-basic" type="tel" label="Telefonnummer" value={this.state.patient.contact.primaryPhone} onChange={input => this.modifyPatient(this.setRelativeContactsPhonenumber,input) } variant="outlined" />
              <TextField id="outlined-basic" type="email" label="Email" value={this.state.patient.contact.emailAddress} onChange={input => this.modifyPatient(this.setRelativeContactsEmail,input) } variant="outlined" />
            </Stack>
            
            
          </Stack>

          
        </CardContent>
    </Card>
    )
  }
  

  setLastname(oldPatient : PatientDetail, newValue : string ) : PatientDetail {
    let modifiedPatient = oldPatient;
    modifiedPatient.lastname = newValue;
    return modifiedPatient;
  }
  setFirstname(oldPatient : PatientDetail, newValue : string ) : PatientDetail {
    let modifiedPatient = oldPatient;
    modifiedPatient.firstname = newValue;
    return modifiedPatient;
  }
  setCpr(oldPatient : PatientDetail, newValue : string ) : PatientDetail {
    let modifiedPatient = oldPatient;
    modifiedPatient.cpr = newValue;
    return modifiedPatient;
  }
  
  setRoad(oldPatient : PatientDetail, newValue : string ) : PatientDetail {
    let modifiedPatient = oldPatient;
    modifiedPatient.patientContact.address.road = newValue;
    return modifiedPatient;
  }
  setZipcode(oldPatient : PatientDetail, newValue : string ) : PatientDetail {
    let modifiedPatient = oldPatient;
    modifiedPatient.patientContact.address.zipCode = newValue;
    return modifiedPatient;
  }
  
  setCiy(oldPatient : PatientDetail, newValue : string ) : PatientDetail {
    let modifiedPatient = oldPatient;
    modifiedPatient.patientContact.address.city = newValue;
    return modifiedPatient;
  }
  
  setPhonenumber(oldPatient : PatientDetail, newValue : string ) : PatientDetail {
    let modifiedPatient = oldPatient;
    modifiedPatient.patientContact.primaryPhone = newValue;
    return modifiedPatient;
  }
  
  setEmail(oldPatient : PatientDetail, newValue : string ) : PatientDetail {
    let modifiedPatient = oldPatient;
    modifiedPatient.patientContact.emailAddress = newValue;
    return modifiedPatient;
  }


  setRelativeContactsName(oldPatient : PatientDetail, newValue : string ) : PatientDetail {
    let modifiedPatient = oldPatient;
    modifiedPatient.contact.fullname = newValue;
    return modifiedPatient;
  }
  setRelativeContactsPhonenumber(oldPatient : PatientDetail, newValue : string ) : PatientDetail {
    let modifiedPatient = oldPatient;
    modifiedPatient.contact.primaryPhone = newValue;
    return modifiedPatient;
  }

  setRelativeContactsEmail(oldPatient : PatientDetail, newValue : string ) : PatientDetail {
    let modifiedPatient = oldPatient;
    modifiedPatient.contact.emailAddress = newValue;
    return modifiedPatient;
  }
  setRelativeContactsCity(oldPatient : PatientDetail, newValue : string ) : PatientDetail {
    let modifiedPatient = oldPatient;
    modifiedPatient.contact.address.city = newValue;
    return modifiedPatient;
  }
  setRelativeContactsRoad(oldPatient : PatientDetail, newValue : string ) : PatientDetail {
    let modifiedPatient = oldPatient;
    modifiedPatient.contact.address.road = newValue;
    return modifiedPatient;
  }
  setRelativeContactsZipcode(oldPatient : PatientDetail, newValue : string ) : PatientDetail {
    let modifiedPatient = oldPatient;
    modifiedPatient.contact.address.zipCode = newValue;
    return modifiedPatient;
  }


}
