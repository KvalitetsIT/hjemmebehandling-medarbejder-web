import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { QuestionnaireResponse, QuestionnaireResponseStatus } from '../Models/QuestionnaireResponse';
import { Component, ReactEventHandler, useContext } from 'react';
import { IBackendApi } from '../../apis/IBackendApi';
import { Alert, AlertColor, Button, Snackbar, SnackbarCloseReason, Tooltip } from '@mui/material';
import ApiContext from '../../pages/_context';
import { Slider, Typography, withStyles } from '@material-ui/core';
import { Question } from '../Models/Question';
import { createTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import { CategoryEnum } from '../Models/CategoryEnum';
import AddIcon from '@mui/icons-material/Add';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import IQuestionnaireService from '../../services/interfaces/IQuestionnaireService';
import { Questionnaire } from '../Models/Questionnaire';
import CloseIcon from '@mui/icons-material/Close';
import { PatientCareplan } from '../Models/PatientCareplan';
import { QuestionnaireAlreadyOnCareplan } from '../../apis/Errors/QuestionnaireAlreadyOnCareplan';

export interface Props {
    careplan : PatientCareplan
    afterAddingQuestionnaire? : () => void
}

export interface State {
    AddQuestionnaireBool : boolean
    allquestionnaires : Array<Questionnaire>

    snackbarOpen : boolean
    snackbarColor: AlertColor
    snackbarText : string
    snackbarTitle : string
}


export class AddQuestionnaireButton extends Component<Props,State> {
  static displayName = AddQuestionnaireButton.name;
  static contextType = ApiContext
  questionnaireService! : IQuestionnaireService


  constructor(props : Props){
      super(props);
      this.state= {
            AddQuestionnaireBool : false,
            allquestionnaires : [],
            snackbarOpen : false,
            snackbarColor: "info",
            snackbarText : "",
            snackbarTitle : ""
      }
  }
  InitializeServices(){
    this.questionnaireService = this.context.questionnaireService;
  }

  async AddQuestionnaire(questionnaireToAdd : Questionnaire){
      try{
            await this.questionnaireService.AddQuestionnaireToCareplan(this.props.careplan, questionnaireToAdd);
            this.setState({AddQuestionnaireBool : false})
            this.forceUpdate();
            if(this.props.afterAddingQuestionnaire)
            this.props.afterAddingQuestionnaire();
        } catch(error : unknown){
            if(!(error instanceof QuestionnaireAlreadyOnCareplan)) { throw error; }
            this.setState({
                snackbarColor : "error",
                snackbarOpen : true,
                snackbarTitle : "Fejl",
                snackbarText : error.displayMessage()
            })
      }
    
  }
  

  render () {
      this.InitializeServices();
      
    return (<>
    {this.state.AddQuestionnaireBool ? 
        <>
            <Autocomplete
            autoComplete
            groupBy={(option) => option.name+""}
            getOptionLabel={(option) => option.name}
            options={this.state.allquestionnaires}
            
            sx={{ width: 300 }}
            renderInput={(params) => <TextField {...params} label={<Typography><AddIcon fontSize="inherit"/> Tilføj spørgeskema</Typography>} />}
            onLostPointerCapture={()=>this.setState({AddQuestionnaireBool : false})}
            onChange={(event, value) => value ? this.AddQuestionnaire(value) : ""}
            />
            <Button onClick={()=>this.setState({AddQuestionnaireBool : false})}> <CloseIcon fontSize="inherit"/> </Button>   
        </>
    : 
        <Tooltip placement="top" title="Tilføj ekstra spørgeskema">
            <Button onClick={()=>this.setState({AddQuestionnaireBool : true})}> <AddIcon fontSize="inherit"/> </Button>            
        </Tooltip> 
        
}       
        <Snackbar open={this.state.snackbarOpen} autoHideDuration={6000} onClose={this.closeSnackbar} anchorOrigin={{vertical: 'bottom',horizontal: 'right'}}>
            <Alert severity={this.state.snackbarColor} sx={{ width: '100%' }}>
                <h5>{this.state.snackbarTitle}</h5>
                
                {this.state.snackbarText}
            </Alert>
        </Snackbar>
</>
    )
  }

  closeSnackbar = (event: React.SyntheticEvent<any>, reason: SnackbarCloseReason) => {
    this.setState({snackbarOpen : false})
  };

  componentDidMount(){
    this.populateQuestionnairesList();
  }

  async populateQuestionnairesList(){
    let allquestionnaires = await this.questionnaireService.GetQuestionnairesList()
    this.setState({
        allquestionnaires : allquestionnaires
    })
  }
 



}
