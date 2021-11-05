import { AppBar, Box, Breadcrumbs, Button, CardContent, Chip, Container, Divider, Drawer, Fab, Grid, IconButton, List, ListItem, ListItemText, ListSubheader, Paper, Toolbar, Typography } from '@material-ui/core';
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
import ApiContext from './_context';
import IPatientService from '../services/interfaces/IPatientService';
import { FamilyRestroomTwoTone } from '@mui/icons-material';
import { LoadingComponent } from '../components/Layout/LoadingComponent';
import { CareplanCardSimple } from '../components/Cards/CareplanCardSimple';
import { PatientCareplan } from '../components/Models/PatientCareplan';
import { QuestionnaireCardSimple } from '../components/Cards/QuestionnaireCardSimple';
import { QuestionnaireListSimple } from '../components/Cards/QuestionnaireListSimple';
import { PatientEditCard } from '../components/Cards/PatientEditCard';


export interface Props {
}
export interface State {
    patient : PatientDetail;
    careplan : PatientCareplan;
    loading: boolean;
}



export default class NewPatient extends Component<Props,State> {
  static contextType = ApiContext
  static displayName = NewPatient.name;
  patientService!: IPatientService;

constructor(props : Props){
  
    super(props);

    
    this.SaveCareplan = this.SaveCareplan.bind(this);

    let relativeContact = new Contact();

    let newPatient = new PatientDetail();
    newPatient.firstname = "";
    newPatient.lastname = "";
    newPatient.patientContact = new Contact();
    newPatient.contact = relativeContact
    
    let newCareplan = new PatientCareplan();
    newCareplan.patient = newPatient;
    
    this.state = {
      patient : newPatient,
      loading : false,
      careplan : newCareplan
    }

}
InitializeServices(){
  this.patientService = this.context.patientService;
}

SaveCareplan(editedCareplan : PatientCareplan){
  this.setState({careplan : editedCareplan})
  this.forceUpdate();
}



async submitPatient(){
  this.state.careplan.patient = this.state.patient;
  
  console.log(this.state.careplan)
  try{
    this.setState({
      loading: true
    })
    let newPatient = await this.patientService.CreatePatient(this.state.patient)
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


  render () {
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
