import * as React from 'react';
import { SelectChangeEvent } from '@mui/material/Select';
import { Component } from 'react';
import ApiContext from '../../pages/_context';
import { PatientCareplan } from '@kvalitetsit/hjemmebehandling/Models/PatientCareplan';
import { PlanDefinition } from '@kvalitetsit/hjemmebehandling/Models/PlanDefinition';
import { IQuestionnaireService } from '../../services/interfaces/IQuestionnaireService';
import { IValidationService } from '../../services/interfaces/IValidationService';
import { InvalidInputModel } from '@kvalitetsit/hjemmebehandling/Errorhandling/ServiceErrors/InvalidInputError';
import { ValidateInputEvent, ValidateInputEventData } from '@kvalitetsit/hjemmebehandling/Events/ValidateInputEvent';
import { IPlanDefinitionService } from '../../services/interfaces/IPlanDefinitionService';
import { BaseModelStatus } from '@kvalitetsit/hjemmebehandling/Models/BaseModelStatus';
import { MultiSelect, MultiSelectOption } from './MultiSelect';
import { FormControl, FormHelperText } from '@mui/material';

export interface Props {
  careplan: PatientCareplan
  SetEditedCareplan?: (careplan: PatientCareplan) => void;
  onValidation?: (error: InvalidInputModel[]) => void;
}

export interface State {
  editedCareplan: PatientCareplan
  allPlanDefinitions: PlanDefinition[]
  errors: InvalidInputModel[]

}


export class PlanDefinitionSelect extends Component<Props, State> {
  static displayName = PlanDefinitionSelect.name;
  static contextType = ApiContext
  static sectionName = "PlanDefinitionSelectSection"
  questionnaireService!: IQuestionnaireService;
  validationService!: IValidationService
  planDefinitionService!: IPlanDefinitionService

  constructor(props: Props) {
    super(props);

    this.state = {
      editedCareplan: props.careplan.clone(),
      allPlanDefinitions: [],
      errors: []
    }
    this.handleChange = this.handleChange.bind(this);

    window.addEventListener(ValidateInputEvent.eventName, async (event: Event) => {
      const data = (event as CustomEvent).detail as ValidateInputEventData
      if (PlanDefinitionSelect.sectionName == data.sectionName)
        await this.validate();
    });

  }

  InitializeServices(): void {
    this.questionnaireService = this.context.questionnaireService;
    this.planDefinitionService = this.context.planDefinitionService;
    this.validationService = this.context.validationService;
  }

  handleChange(e: SelectChangeEvent<string>): void {
    const clicked = e.target.value as unknown as string[]

    const plandefinitions = clicked.map(id => this.state.allPlanDefinitions.find(x => x.id === id))
    const careplan = this.state.editedCareplan;
    careplan.planDefinitions = plandefinitions ? plandefinitions as PlanDefinition[] : [];
    careplan.questionnaires = plandefinitions ? plandefinitions.flatMap(pd => pd?.questionnaires ?? []) : []

    this.setState({ editedCareplan: careplan })
    if (this.props.SetEditedCareplan)
      this.props.SetEditedCareplan(careplan);

  }




  async handleSelection(ids: string[]): Promise<void> {
    const plandefinitions = ids.map(id => this.state.allPlanDefinitions.find(x => x.id === id))
    const careplan = this.state.editedCareplan;
    careplan.planDefinitions = plandefinitions ? plandefinitions as PlanDefinition[] : [];
    careplan.questionnaires = plandefinitions ? plandefinitions.flatMap(pd => pd?.questionnaires ?? []) : []

    this.setState({ editedCareplan: careplan })
    if (this.props.SetEditedCareplan){
      this.props.SetEditedCareplan(careplan);
    }

      await this.validate()
    }

  async componentDidMount(): Promise<void> {
    try {
      this.populatePlanDefinitions();
    } catch (error: unknown) {
      this.setState(() => { throw error })
    }
  }

  async populatePlanDefinitions(): Promise<void> {
    try {
      const planDefinitions = await this.planDefinitionService.GetAllPlanDefinitions([BaseModelStatus.ACTIVE]);
      this.setState({
        allPlanDefinitions: planDefinitions
      })
    } catch (error) {
      this.setState(() => { throw error });
    }
  }


  async validate(): Promise<void> {
    const errors = await this.validationService.ValidatePlanDefinitions(this.state.editedCareplan.planDefinitions);
    this.setState({ errors: errors })
    if (this.props.onValidation)
      this.props.onValidation(errors);
  }

  render(): JSX.Element {

    this.InitializeServices();
    let firstError = ""
    let hasError = false
    if (this.state.errors && this.state.errors.length !== 0) {
      firstError = this.state.errors[0].message;
      hasError = true;
    }



    return (
      <FormControl fullWidth required>
        <MultiSelect onChange={(planDefinition) => this.handleSelection(planDefinition)} value={this.state.editedCareplan.planDefinitions.map((x) => x.id!)} id="select-plandefinition">
          {this.state.allPlanDefinitions.map(planDefinition => {
            return <MultiSelectOption key={"option" + planDefinition.id} value={planDefinition.id}>{planDefinition.name}</MultiSelectOption>
          })}
        </MultiSelect>
        {hasError ? <FormHelperText error={true}>{firstError}</FormHelperText> : <></>}
      </FormControl>
    )
  }

}


