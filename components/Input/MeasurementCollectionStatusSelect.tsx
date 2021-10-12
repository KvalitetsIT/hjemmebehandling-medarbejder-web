import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { MeasurementCollection, MeasurementCollectionStatus } from '../Models/MeasurementCollection';
import { Component } from 'react';
import { IBackendApi } from '../../apis/IBackendApi';
import { Alert, AlertColor, Snackbar, SnackbarCloseReason } from '@mui/material';

export interface Props {
    measurementCollection : MeasurementCollection
    backendApi : IBackendApi
}

export interface State {
    status : MeasurementCollectionStatus;
    
    snackbarOpen : boolean
    snackbarColor: AlertColor
    snackbarText : string
    snackbarTitle : string
}

export class MeasurementCollectionStatusSelect extends Component<Props,State> {
  static displayName = MeasurementCollectionStatusSelect.name;

  constructor(props : Props){
      super(props);
      this.state = {
          status : props.measurementCollection.status,
          snackbarOpen : false,
            snackbarColor: "info",
            snackbarText : "",
            snackbarTitle : ""

      }
  }

  closeSnackbar = (event: React.SyntheticEvent<any>, reason: SnackbarCloseReason) => {
    this.setState({snackbarOpen : false})
  };

  handleChange = async (event: SelectChangeEvent) => {
    let collectionStatus = event.target.value as MeasurementCollectionStatus;
    let changes = new MeasurementCollection();
    changes.status = collectionStatus;

    this.setState({snackbarColor : "info",snackbarOpen : true,snackbarTitle: "Opdaterer ...", snackbarText: "Ændrer status til: " + changes.status , status : collectionStatus})
    
    

    try{
        await this.props.backendApi.SetQuestionaireResponse(this.props.measurementCollection.id, changes)
        this.setState({snackbarColor : "success",snackbarOpen : true,snackbarTitle: "Opdateret!", snackbarText: "Ny status: " + changes.status , status : collectionStatus})
    } catch(error : unknown){
        if(!(error instanceof Error)) { throw error; }
        this.setState({snackbarColor : "error",snackbarOpen : true,snackbarTitle: "Fejl!", snackbarText: error.message , status : collectionStatus})
    }
    

    
  };
  
  render () {
    return ( <>
<FormControl fullWidth>
  <InputLabel id="demo-simple-select-label">Status</InputLabel>
                        <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={this.state.status}
                        label="Status"
                        onChange={this.handleChange}
                    >
                        <MenuItem value={MeasurementCollectionStatus.NotProcessed}>{MeasurementCollectionStatus.NotProcessed}</MenuItem>
                        <MenuItem value={MeasurementCollectionStatus.InProgress}>{MeasurementCollectionStatus.InProgress}</MenuItem>
                        <MenuItem value={MeasurementCollectionStatus.Processed}>{MeasurementCollectionStatus.Processed}</MenuItem>
                    </Select>
                    </FormControl>


                    <Snackbar open={this.state.snackbarOpen} autoHideDuration={6000} onClose={this.closeSnackbar} anchorOrigin={{vertical: 'bottom',horizontal: 'right'}}>
                        <Alert severity={this.state.snackbarColor} sx={{ width: '100%' }}>
                            <h5>{this.state.snackbarTitle}</h5>
                            Besvarelse : {this.props.measurementCollection.time.toDateString()} <br/>
                            {this.state.snackbarText}
                        </Alert>
                    </Snackbar>
                    </>
    )
  }



}
