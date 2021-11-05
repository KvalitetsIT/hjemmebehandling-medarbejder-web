import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { QuestionnaireResponse, QuestionnaireResponseStatus } from '../Models/QuestionnaireResponse';
import { Component, useContext } from 'react';
import { IBackendApi } from '../../apis/IBackendApi';
import { Alert, AlertColor, Snackbar, SnackbarCloseReason } from '@mui/material';
import ApiContext from '../../pages/_context';
import IQuestionnaireService from '../../services/interfaces/IQuestionnaireService';

export interface Props {
    questionnaireResponse : QuestionnaireResponse
}

export interface State {
    status? : QuestionnaireResponseStatus;
    
    snackbarOpen : boolean
    snackbarColor: AlertColor
    snackbarText : string
    snackbarTitle : string
}

export class QuestionnaireResponseStatusSelect extends Component<Props,State> {
  static displayName = QuestionnaireResponseStatusSelect.name;
  static contextType = ApiContext
  questionnaireService! : IQuestionnaireService

  constructor(props : Props){
      super(props);
      this.state = {
          status : props.questionnaireResponse.status,
          snackbarOpen : false,
            snackbarColor: "info",
            snackbarText : "",
            snackbarTitle : ""
      }
  }

  closeSnackbar = (event: React.SyntheticEvent<any>, reason: SnackbarCloseReason) => {
    this.setState({snackbarOpen : false})
  };
InitializeServices(){
  this.questionnaireService = this.context.questionnaireService;
}
  handleChange = async (event: SelectChangeEvent) => {
    let collectionStatus = event.target.value as QuestionnaireResponseStatus;
    let changes = new QuestionnaireResponse();
    changes.status = collectionStatus;

    this.setState({snackbarColor : "info",snackbarOpen : true,snackbarTitle: "Opdaterer ...", snackbarText: "Ændrer status til: " + changes.status , status : collectionStatus})


    try{
        await this.questionnaireService.SetQuestionaireResponse(this.props.questionnaireResponse.id, changes)
        await this.questionnaireService.UpdateQuestionnaireResponseStatus(this.props.questionnaireResponse.id, collectionStatus)
        this.setState({snackbarColor : "success",snackbarOpen : true,snackbarTitle: "Opdateret!", snackbarText: "Ny status: " + changes.status , status : collectionStatus})
    } catch(error : unknown){
        if(!(error instanceof Error)) { throw error; }
        this.setState({snackbarColor : "error",snackbarOpen : true,snackbarTitle: "Fejl!", snackbarText: error.message , status : collectionStatus})
    }
    

    
  };
  
  render () {
    this.InitializeServices()
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
                        <MenuItem value={QuestionnaireResponseStatus.NotProcessed}>{QuestionnaireResponseStatus.NotProcessed}</MenuItem>
                        <MenuItem value={QuestionnaireResponseStatus.InProgress}>{QuestionnaireResponseStatus.InProgress}</MenuItem>
                        <MenuItem value={QuestionnaireResponseStatus.Processed}>{QuestionnaireResponseStatus.Processed}</MenuItem>
                    </Select>
                    </FormControl>


                    <Snackbar open={this.state.snackbarOpen} autoHideDuration={6000} onClose={this.closeSnackbar} anchorOrigin={{vertical: 'bottom',horizontal: 'right'}}>
                        <Alert severity={this.state.snackbarColor} sx={{ width: '100%' }}>
                            <h5>{this.state.snackbarTitle}</h5>
                            Besvarelse : {this.props.questionnaireResponse.answeredTime ? this.props.questionnaireResponse.answeredTime.toDateString() : ""} <br/>
                            {this.state.snackbarText}
                        </Alert>
                    </Snackbar>
                    </>
    )
  }



}
