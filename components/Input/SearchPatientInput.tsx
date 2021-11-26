import * as React from 'react';
import { Component } from 'react';
import { Autocomplete, Button, CircularProgress, InputAdornment, Stack, TextField } from '@mui/material';
import ApiContext from '../../pages/_context';
import { Typography } from '@material-ui/core';
import { PatientSimple } from '../Models/PatientSimple';
import IPatientService from '../../services/interfaces/IPatientService';
import { Link } from 'react-router-dom';

export interface State {
    patientResults : PatientSimple[]
    loading : boolean
}


export class SearchPatientInput extends Component<{},State> {
  static displayName = SearchPatientInput.name;
  static contextType = ApiContext
  patientService! : IPatientService

  constructor(props : {}){
      super(props);
      this.state = {
          patientResults : [],
        loading: false
      }
      
  }

InitialiseServices() : void{
    this.patientService= this.context.patientService;
}

async searchForPatient(searchString : string) : Promise<void>{
    this.setState({loading:true})

    if(searchString.length < 3){
        this.setState({patientResults : [], loading : false});
        return;
    }
        

    try{
    const patientSearchResults = await this.patientService.SearchPatient(searchString);
  
    console.log(patientSearchResults)
    this.setState({patientResults : patientSearchResults, loading : false});
    this.forceUpdate();
  }  catch(error : any){
    this.setState(()=>{throw error})
  }  
}
  render () : JSX.Element{
      this.InitialiseServices();
    return (
        <Autocomplete
        autoComplete
        getOptionLabel={(option) => option.firstname + " " + option.lastname + " ("+option.cpr+")"}
        options={this.state.patientResults}
        onInputChange={async (a,b)=>await this.searchForPatient(b)}
        renderOption={(a,b) => (<Stack><Button component={Link} to={"/patients/"+b.cpr}>{b.firstname + " " + b.lastname + " (" + b.cpr + ")"}</Button></Stack>)}
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
