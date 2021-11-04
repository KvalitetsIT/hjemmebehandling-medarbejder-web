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
import { Slider, Typography, withStyles } from '@material-ui/core';
import { Question } from '../Models/Question';
import { createTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import { CategoryEnum } from '../Models/CategoryEnum';
import { PatientCareplan } from '../Models/PatientCareplan';
import { PlanDefinition } from '../Models/PlanDefinition';
import IQuestionnaireService from '../../services/interfaces/IQuestionnaireService';

export interface Props {
    careplan : PatientCareplan
    SetEditedCareplan : (careplan : PatientCareplan) => void;
}

export interface State {
    editedCareplan : PatientCareplan
    allPlanDefinitions : PlanDefinition[]
    
}


export class PlanDefinitionSelect extends Component<Props,State> {
  static displayName = PlanDefinitionSelect.name;
  static contextType = ApiContext
    questionnaireService! : IQuestionnaireService;
    
  constructor(props : Props){
      super(props);
      this.state = {
        editedCareplan : props.careplan.clone(),
        allPlanDefinitions : []
          }
      this.handleChange = this.handleChange.bind(this);
      
  }

  InitializeServices(){
    this.questionnaireService = this.context.questionnaireService;
  }

  handleChange(e: SelectChangeEvent<string>) {
    let clicked = e.target.value as unknown as string[]

    let plandefinitions = clicked.map(id => this.state.allPlanDefinitions.find(x=>x.id == id)) 
    let careplan = this.state.editedCareplan;
    careplan.planDefinitions = plandefinitions ? plandefinitions as PlanDefinition[] : [];


    this.setState({editedCareplan : careplan})
    this.props.SetEditedCareplan(careplan);
  };

  async componentDidMount(){
    this.populatePlanDefinitions();
  }
  //TODO: CALL SERVICE INSTED
  async populatePlanDefinitions() {
      
    let planDefinitions =  await this.questionnaireService.GetAllPlanDefinitions();

    this.setState({
        allPlanDefinitions : planDefinitions
    })
}


  render () {
      this.InitializeServices();
    return (
        <Select multiple value={this.state.editedCareplan.planDefinitions.map(x=>x.id) as unknown as string}  onChange={this.handleChange}>
        {this.state.allPlanDefinitions.map(patientGroup => {
            return (
                <MenuItem key={patientGroup.name} value={patientGroup.id}>{patientGroup.name}</MenuItem>
            )
        })}
    </Select>
    )
  }



}
