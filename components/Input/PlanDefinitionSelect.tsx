import * as React from 'react';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { Component } from 'react';
import ApiContext from '../../pages/_context';
import { PatientCareplan } from '../Models/PatientCareplan';
import { PlanDefinition } from '../Models/PlanDefinition';
import IQuestionnaireService from '../../services/interfaces/IQuestionnaireService';
import { FormControl, InputLabel } from '@mui/material';

export interface Props {
    careplan : PatientCareplan
    SetEditedCareplan? : (careplan : PatientCareplan) => void;
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

  InitializeServices() : void{
    this.questionnaireService = this.context.questionnaireService;
  }

  handleChange(e: SelectChangeEvent<string>) : void {
    const clicked = e.target.value as unknown as string[]

    const plandefinitions = clicked.map(id => this.state.allPlanDefinitions.find(x=>x.id === id)) 
    const careplan = this.state.editedCareplan;
    careplan.planDefinitions = plandefinitions ? plandefinitions as PlanDefinition[] : [];
    careplan.questionnaires = plandefinitions ? plandefinitions.flatMap(pd => pd?.questionnaires ?? []) : []

    this.setState({editedCareplan : careplan})
    if(this.props.SetEditedCareplan)
      this.props.SetEditedCareplan(careplan);
  }

  async componentDidMount() : Promise<void>{
    try{
    this.populatePlanDefinitions();
  }  catch(error : any){
    this.setState(()=>{throw error})
  }  
  }
  async populatePlanDefinitions() : Promise<void>{
      
    const planDefinitions =  await this.questionnaireService.GetAllPlanDefinitions();

    this.setState({
        allPlanDefinitions : planDefinitions
    })
}


  render () : JSX.Element {
      this.InitializeServices();
    return (
      <FormControl fullWidth>
      <InputLabel id="demo-simple-select-label">Vælg patientgrupper</InputLabel>
        <Select label="Vælg patientgrupper" multiple value={this.state.editedCareplan.planDefinitions.map(x=>x.id) as unknown as string}  onChange={this.handleChange}>
        {this.state.allPlanDefinitions.map(patientGroup => {
            return (
                <MenuItem key={patientGroup.name} value={patientGroup.id}>{patientGroup.name}</MenuItem>
            )
        })}
    </Select>
    </FormControl>
    )
  }



}
