import { AppBar, Box, Breadcrumbs, CardContent, Chip, Container, Divider, Drawer, Fab, Grid, IconButton, List, ListItem, ListItemText, ListSubheader, Paper, Toolbar, Typography } from '@material-ui/core';
import React, { Component } from 'react';
import Stack from '@mui/material/Stack';
import { Backdrop, Card, ListItemButton, TextField } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import { withThemeCreator } from '@material-ui/styles';
import MenuIcon from "@mui/icons-material/Menu"
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { PatientDetail } from '../components/Models/PatientDetail';
import { PatientCard } from '../components/Cards/PatientCard';
import { Contact } from '../components/Models/Contact';


export interface Props {
}
export interface State {
    patient : PatientDetail;
}



export default class NewPatient extends Component<Props,State> {
  static displayName = NewPatient.name;

constructor(props : Props){
  
    super(props);

    this.modifyPatient = this.modifyPatient.bind(this);

    let relativeContact = new Contact();
    relativeContact.favContact = true;


    let newPatient = new PatientDetail();
    newPatient.firstname = "";
    newPatient.lastname = "";
    newPatient.patientContact = new Contact();
    newPatient.contacts = [relativeContact]
    this.state = {
      patient : newPatient
    }

}

modifyPatient(patientModifier : (patient : PatientDetail, newValue : string) => PatientDetail, input :  React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement> ){
  let valueFromInput = input.currentTarget.value;
  let modifiedPatient = patientModifier(this.state.patient,valueFromInput);
  this.setState({patient : modifiedPatient  })
}


  render () {
    return (
      <Stack direction="row" spacing={3}>
         
        <Card>
            <CardContent>
              
              <Stack spacing={3}>
              <Typography variant="inherit">
              Patient
          </Typography>
                <Stack direction="row">
                  <TextField id="outlined-basic" label="CPR" onChange={input => this.modifyPatient(this.setCpr,input) }  variant="outlined" />
                </Stack>
                <Stack spacing={3} direction="row">
                  <TextField id="outlined-basic" label="Fornavn" onChange={input => this.modifyPatient(this.setFirstname,input) }  variant="outlined" />
                  <TextField id="outlined-basic" label="Efternavn" onChange={input => this.modifyPatient(this.setLastname,input) } variant="outlined" />
                </Stack>
                <Stack spacing={3} direction="row">
                  <TextField id="outlined-basic" label="Addresse" onChange={input => this.modifyPatient(this.setRoad,input) }  variant="outlined" />
                  <TextField id="outlined-basic" label="Postnummer" onChange={input => this.modifyPatient(this.setZipcode,input) }  variant="outlined" />
                  <TextField id="outlined-basic" label="By" onChange={input => this.modifyPatient(this.setCiy,input) }  variant="outlined" />
                </Stack>
                <Stack spacing={3} direction="row">
                  <TextField id="outlined-basic" label="Telefonnummer" onChange={input => this.modifyPatient(this.setPhonenumber,input) } variant="outlined" />
                  <TextField id="outlined-basic" label="Email" onChange={input => this.modifyPatient(this.setEmail,input) } variant="outlined" />
                </Stack>
                <Divider/>
                <Typography variant="inherit">
              Pårørede
          </Typography>
          <Stack spacing={3} direction="row">
                  <TextField id="outlined-basic" label="Fornavn" onChange={input => this.modifyPatient(this.setRelativeContactsName,input) }  variant="outlined" />
                </Stack>
                <Stack spacing={3} direction="row">
                  <TextField id="outlined-basic" label="Addresse" onChange={input => this.modifyPatient(this.setRelativeContactsRoad,input) }  variant="outlined" />
                  <TextField id="outlined-basic" label="Postnummer" onChange={input => this.modifyPatient(this.setRelativeContactsZipcode,input) }  variant="outlined" />
                  <TextField id="outlined-basic" label="By" onChange={input => this.modifyPatient(this.setRelativeContactsCity,input) }  variant="outlined" />
                </Stack>
                <Stack spacing={3} direction="row">
                  <TextField id="outlined-basic" label="Telefonnummer" onChange={input => this.modifyPatient(this.setRelativeContactsPhonenumber,input) } variant="outlined" />
                  <TextField id="outlined-basic" label="Email" onChange={input => this.modifyPatient(this.setRelativeContactsEmail,input) } variant="outlined" />
                </Stack>
              </Stack>
            </CardContent>
        </Card>
        <PatientCard patient={this.state.patient}/>
        </Stack>
        
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
    modifiedPatient.contacts[0].fullname = newValue;
    return modifiedPatient;
  }
  setRelativeContactsPhonenumber(oldPatient : PatientDetail, newValue : string ) : PatientDetail {
    let modifiedPatient = oldPatient;
    modifiedPatient.contacts[0].primaryPhone = newValue;
    return modifiedPatient;
  }

  setRelativeContactsEmail(oldPatient : PatientDetail, newValue : string ) : PatientDetail {
    let modifiedPatient = oldPatient;
    modifiedPatient.contacts[0].emailAddress = newValue;
    return modifiedPatient;
  }
  setRelativeContactsCity(oldPatient : PatientDetail, newValue : string ) : PatientDetail {
    let modifiedPatient = oldPatient;
    modifiedPatient.contacts[0].address.city = newValue;
    return modifiedPatient;
  }
  setRelativeContactsRoad(oldPatient : PatientDetail, newValue : string ) : PatientDetail {
    let modifiedPatient = oldPatient;
    modifiedPatient.contacts[0].address.road = newValue;
    return modifiedPatient;
  }
  setRelativeContactsZipcode(oldPatient : PatientDetail, newValue : string ) : PatientDetail {
    let modifiedPatient = oldPatient;
    modifiedPatient.contacts[0].address.zipCode = newValue;
    return modifiedPatient;
  }
}