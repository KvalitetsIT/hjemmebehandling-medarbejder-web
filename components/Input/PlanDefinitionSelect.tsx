import * as React from 'react';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { Component } from 'react';
import ApiContext from '../../pages/_context';
import { PatientCareplan } from '@kvalitetsit/hjemmebehandling/Models/PatientCareplan';
import { PlanDefinition } from '@kvalitetsit/hjemmebehandling/Models/PlanDefinition';
import IQuestionnaireService from '../../services/interfaces/IQuestionnaireService';
import { FormControl, FormHelperText, InputLabel } from '@mui/material';
import IValidationService from '../../services/interfaces/IValidationService';
import { InvalidInputModel } from '../../services/Errors/InvalidInputError';

export interface Props {
    careplan : PatientCareplan
    SetEditedCareplan? : (careplan : PatientCareplan) => void;
    onValidation? : (error : InvalidInputModel[]) => void;
}

export interface State {
    editedCareplan : PatientCareplan
    allPlanDefinitions : PlanDefinition[]
    errors : InvalidInputModel[]
    
}


export class PlanDefinitionSelect extends Component<Props,State> {
  static displayName = PlanDefinitionSelect.name;
  static contextType = ApiContext
    questionnaireService! : IQuestionnaireService;
    validationService! : IValidationService
    
  constructor(props : Props){
      super(props);
      this.state = {
        editedCareplan : props.careplan.clone(),
        allPlanDefinitions : [],
        errors : []
          }
      this.handleChange = this.handleChange.bind(this);
      
  }

  InitializeServices() : void{
    this.questionnaireService = this.context.questionnaireService;
    this.validationService = this.context.validationService;
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
      
    try{

      const planDefinitions =  await this.questionnaireService.GetAllPlanDefinitions();
      
      this.setState({
        allPlanDefinitions : planDefinitions
      })
    } catch(error){
      this.setState(()=>{throw error});
    }
}


async validate() : Promise<void>{
  const errors = await this.validationService.ValidatePlanDefinitions(this.state.editedCareplan.planDefinitions);
  this.setState({errors : errors})
  if(this.props.onValidation)
    this.props.onValidation(errors);
}

  render () : JSX.Element {
      this.InitializeServices();
      let firstError = ""
      let hasError = false
      if(this.state.errors && this.state.errors.length !== 0){
          firstError = this.state.errors[0].message;
          hasError = true;
      }

    return (
      <FormControl fullWidth required>
      <InputLabel error={this.state.errors.length !== 0} id="demo-simple-select-label">Vælg patientgrupper</InputLabel>
        <Select onClose={()=>this.validate()} label="Vælg patientgrupper" multiple value={this.state.editedCareplan.planDefinitions.map(x=>x.id) as unknown as string}  onChange={this.handleChange}>
        {this.state.allPlanDefinitions.map(patientGroup => {
            return (
                <MenuItem key={patientGroup.name} value={patientGroup.id}>{patientGroup.name}</MenuItem>
            )
        })}
    </Select>
    {hasError ? <FormHelperText error={true}>{firstError}</FormHelperText> : <></>}
    </FormControl>
    )
  }



}
