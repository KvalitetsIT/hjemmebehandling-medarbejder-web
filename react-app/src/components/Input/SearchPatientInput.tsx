import * as React from 'react';
import { Component } from 'react';
import { Autocomplete, Box, CircularProgress, InputAdornment, ListItem, ListItemAvatar, ListItemText, TextField, Typography } from '@mui/material';
import ApiContext, { IApiContext } from '../../pages/_context';
import { PatientSimple } from '../Models/PatientSimple';
import { IPatientService } from '../../services/interfaces/IPatientService';
import { NotFoundError } from '../Errorhandling/ServiceErrors/NotFoundError';
import { PatientDetail } from '../Models/PatientDetail';
import { PatientAvatar } from '../Avatars/PatientAvatar';
import { Redirect } from 'react-router-dom';
export interface State {
  patientResults: PatientSimple[]
  loading: boolean
  selected: PatientSimple | null
}


export class SearchPatientInput extends Component<{}, State> {
  static displayName = SearchPatientInput.name;
  static contextType = ApiContext

  patientService!: IPatientService

  constructor(props: {}) {
    super(props);
     
    this.state = {
      patientResults: [],
      loading: false,
      selected: null
    }
  }

  InitialiseServices(): void {
    this.patientService = (this.context as IApiContext).patientService;
  }

  async searchForPatient(searchString: string): Promise<void> {
    this.setState({ loading: true })

    if (searchString.length < 2) {
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

    const redirectTo = this.state.selected ? "/patients/" + this.state.selected.cpr : "";
    redirectTo.length > 0 && this.setState({ selected: null })

    return (
      <>
        {this.state.selected && <Redirect to={redirectTo} key={new Date().toString()} push></Redirect>}
        <Autocomplete
          className="search"
          getOptionLabel={(option) => option.firstname + " " + option.lastname + " (" + option.cpr + ")"}
          noOptionsText="Ingen resultater"
          options={this.state.patientResults}
          autoHighlight={true}
          isOptionEqualToValue={(option, value) => option.cpr === value.cpr}
          onInputChange={async (a, b) => { await this.searchForPatient(b) }}
          value={this.state.selected}

          onChange={(e, value) => {
            this.setState({ selected: value })
          }}
          renderOption={(props, patient) => (

            <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
              <ListItem disableGutters disablePadding >
                <ListItemAvatar>
                  <PatientAvatar height={50} patient={patient}></PatientAvatar>
                </ListItemAvatar>
                <ListItemText
                  sx={{ marginLeft: 2 }}
                  primary={<Typography style={{ fontWeight: "bold" }}>{patient.firstname + " " + patient.lastname}</Typography>}
                  secondary={<Typography>{patient.cpr?.substring(0, 6) + " - " + patient.cpr?.substring(6)}</Typography>}
                >
                </ListItemText>
              </ ListItem>
            </Box >
          )}
          renderInput={(params) => (

            <TextField
              {...params}
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <InputAdornment position="end" variant="standard">
                    {this.state.loading ? <CircularProgress color="inherit" size={20} /> : ""}
                  </InputAdornment>
                ),
              }}
              label={<Typography>Søg efter patient</Typography>}
            />

          )}
        />
      </>

    )
  }



}
