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

export interface Props {
    careplan : PatientCareplan
    SetEditedCareplan : (careplan : PatientCareplan) => void;
}

export interface State {
    editedCareplan : PatientCareplan
    
}


export class PlanDefinitionSelect extends Component<Props,State> {
  static displayName = PlanDefinitionSelect.name;
  static contextType = ApiContext

  constructor(props : Props){
      super(props);
      this.state = {
        editedCareplan : props.careplan.clone()
          }
      this.handleChange = this.handleChange.bind(this);
      
  }

  handleChange(e: SelectChangeEvent<string>) {
    let clicked = e.target.value as unknown as string[]

    let plandefinitions = clicked.map(id => this.GetPlanDefinitions().find(x=>x.id == id)) 
    let careplan = this.state.editedCareplan;
    careplan.planDefinitions = plandefinitions ? plandefinitions as PlanDefinition[] : [];


    this.setState({editedCareplan : careplan})
    this.props.SetEditedCareplan(careplan);
  };

  //TODO: CALL SERVICE INSTED
  GetPlanDefinitions() : PlanDefinition[] {
    let def1 = new PlanDefinition();
    def1.id = "def1"
    def1.name = "Imundefekt"

    let def2 = new PlanDefinition();
    def2.id = "def2"
    def2.name = "Smerter"

    let def3 = new PlanDefinition();
    def3.id = "def3"
    def3.name = "Alm infektion"

    let def4 = new PlanDefinition();
    def4.id = "def4"
    def4.name = "Svær infektion"

    return [def1, def2,def3,def4]
}


  render () {
    return (
        <Select multiple value={this.state.editedCareplan.planDefinitions.map(x=>x.id) as unknown as string}  onChange={this.handleChange}>
        {this.GetPlanDefinitions().map(patientGroup => {
            return (
                <MenuItem key={patientGroup.name} value={patientGroup.id}>{patientGroup.name}</MenuItem>
            )
        })}
    </Select>
    )
  }



}
