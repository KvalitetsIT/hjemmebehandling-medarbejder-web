import * as React from 'react';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { QuestionnaireResponse, QuestionnaireResponseStatus } from '../Models/QuestionnaireResponse';
import { Component } from 'react';
import { Alert, AlertColor, Snackbar } from '@mui/material';
import ApiContext from '../../pages/_context';
import IQuestionnaireService from '../../services/interfaces/IQuestionnaireService';

export interface Props {
    questionnaireResponse : QuestionnaireResponse
    onUpdate : (newStatus : QuestionnaireResponseStatus) => void;
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
      console.log("New year, new me!")
  }

  closeSnackbar = () : void => {
    this.setState({snackbarOpen : false})
  };
InitializeServices() : void{
  this.questionnaireService = this.context.questionnaireService;
}
  handleChange = async (event: SelectChangeEvent) : Promise<void> => {
    const collectionStatus = event.target.value as QuestionnaireResponseStatus;
    const changes = new QuestionnaireResponse();
    changes.status = collectionStatus;

    this.setState({snackbarColor : "info",snackbarOpen : true,snackbarTitle: "Opdaterer ...", snackbarText: "Ændrer status til: " + changes.status , status : collectionStatus})


    try{
         const newStatus = await this.questionnaireService.UpdateQuestionnaireResponseStatus(this.props.questionnaireResponse.id, collectionStatus)
        this.setState({snackbarColor : "success",snackbarOpen : true,snackbarTitle: "Opdateret!", snackbarText: "Ny status: " + changes.status , status : newStatus})
    } catch(error : unknown){
        this.setState(()=>{throw error})
    }

    if(this.props.onUpdate)
       this.props.onUpdate(this.state.status!);
  };
  
  render () : JSX.Element {
    this.InitializeServices()
    return ( <>
<FormControl className="answer__status" variant="standard" fullWidth>
                        <Select
                        labelId="demo-simple-select-standard-label"
                        id="demo-simple-select-standard"
                        value={this.state.status}
                        label="Status"
                        onChange={this.handleChange}
                    >
                        <MenuItem value={QuestionnaireResponseStatus.NotProcessed}>{QuestionnaireResponseStatus.NotProcessed}</MenuItem>
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
