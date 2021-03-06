import * as React from 'react';
import { Component } from 'react';
import { Autocomplete, Button, CircularProgress, InputAdornment, Stack, TextField } from '@mui/material';
import ApiContext from '../../pages/_context';
import { Typography } from '@material-ui/core';
import { PatientSimple } from '@kvalitetsit/hjemmebehandling/Models/PatientSimple';
import { IPatientService } from '../../services/interfaces/IPatientService';
import { Link } from 'react-router-dom';
import { NotFoundError } from '@kvalitetsit/hjemmebehandling/Errorhandling/ServiceErrors/NotFoundError';
import { PatientDetail } from '@kvalitetsit/hjemmebehandling/Models/PatientDetail';

export interface State {
  patientResults: PatientSimple[]
  loading: boolean
}


export class SearchPatientInput extends Component<{}, State> {
  static displayName = SearchPatientInput.name;
  static contextType = ApiContext
  patientService!: IPatientService

  constructor(props: {}) {
    super(props);
    this.state = {
      patientResults: [],
      loading: false
    }

  }

  InitialiseServices(): void {
    this.patientService = this.context.patientService;
  }

  async searchForPatient(searchString: string): Promise<void> {
    this.setState({ loading: true })

    if (searchString.length < 3) {
      this.setState({ patientResults: [], loading: false });
      return;
    }

    let patientSearchResults: PatientDetail[] = [];
    try {
      patientSearchResults = await this.patientService.SearchPatient(searchString);
    } catch (error: unknown) {
      const noResults = error instanceof NotFoundError
      if (noResults)
        patientSearchResults = []
      else
        this.setState(() => { throw error })
    }

    this.setState({ patientResults: patientSearchResults, loading: false });
    this.forceUpdate();
  }
  render(): JSX.Element {
    this.InitialiseServices();
    return (
      <Autocomplete
        className="search"
        autoComplete
        getOptionLabel={(option) => option.firstname + " " + option.lastname + " (" + option.cpr + ")"}
        noOptionsText="Ingen resultater"
        options={this.state.patientResults}
        onInputChange={async (a, b) => await this.searchForPatient(b)}
        renderOption={(a, b) => (<Stack><Button component={Link} to={"/patients/" + b.cpr}>{b.firstname + " " + b.lastname + " (" + b.cpr + ")"}</Button></Stack>)}
        renderInput={(params) => <TextField {...params} InputProps={{
          ...params.InputProps,
          endAdornment: (
            <InputAdornment position="end" variant="standard">
              {this.state.loading ? <CircularProgress color="inherit" size={20} /> : ""}
            </InputAdornment>
          ),
        }} label={<Typography>S??g efter patient</Typography>} />}
      />
    )
  }



}
