import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { QuestionnaireResponse, QuestionnaireResponseStatus } from '../Models/QuestionnaireResponse';
import { Component, useContext } from 'react';
import { IBackendApi } from '../../apis/IBackendApi';
import { Alert, AlertColor, Autocomplete, Button, CircularProgress, InputAdornment, Snackbar, SnackbarCloseReason, Stack, TextField } from '@mui/material';
import ApiContext from '../../pages/_context';
import { Slider, Typography, withStyles } from '@material-ui/core';
import { Question } from '../Models/Question';
import { createTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import { CategoryEnum } from '../Models/CategoryEnum';
import { PatientDetail } from '../Models/PatientDetail';
import { PatientSimple } from '../Models/PatientSimple';
import IPatientService from '../../services/interfaces/IPatientService';
import { breakpoints } from '@mui/system';
import { Link } from 'react-router-dom';

export interface Props {
}

export interface State {
    patientResults : PatientSimple[]
    loading : boolean
}


export class SearchPatientInput extends Component<Props,State> {
  static displayName = SearchPatientInput.name;
  static contextType = ApiContext
  patientService! : IPatientService

  constructor(props : Props){
      super(props);
      this.state = {
          patientResults : [],
        loading: false
      }
      
  }

InitialiseServices(){
    this.patientService= this.context.patientService;
}

async searchForPatient(searchString : string){
    this.setState({loading:true})

    if(searchString.length < 3){
        this.setState({patientResults : [], loading : false});
        return;
    }
        

    
    let patientSearchResults = await this.patientService.SearchPatient(searchString);
    console.log(patientSearchResults)
    this.setState({patientResults : patientSearchResults, loading : false});
    this.forceUpdate();
}
  render () {
      this.InitialiseServices();
    return (
        <Autocomplete
        autoComplete
        getOptionLabel={(option) => option.firstname + " " + option.lastname + " ("+option.cpr+")"}
        options={this.state.patientResults}
        onInputChange={async (a,b)=>await this.searchForPatient(b)}
        renderOption={(a,b) => (<Stack><Button component={Link} to={"/patients/"+b.cpr}>{b.firstname + " " + b.lastname + " (" + b.cpr + ")"}</Button></Stack>)}
        sx={{ width: 300 }}
        renderInput={(params) => <TextField  {...params} InputProps={{ 
            ...params.InputProps,
            endAdornment: (
              <InputAdornment position="end">
                {this.state.loading ? <CircularProgress color="inherit" size={20} /> : ""}
              </InputAdornment>
            ),
          }}  label={<Typography>Søg</Typography>} />}
        /> 
    )
  }



}
