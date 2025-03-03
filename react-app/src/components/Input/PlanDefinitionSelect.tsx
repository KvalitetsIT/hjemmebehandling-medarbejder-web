import * as React from 'react';
import { SelectChangeEvent } from '@mui/material/Select';
import { Component } from 'react';
import ApiContext, { IApiContext } from '../../pages/_context';
import { PatientCareplan } from '../Models/PatientCareplan';
import { PlanDefinition } from '../Models/PlanDefinition';
import { IQuestionnaireService } from '../../services/interfaces/IQuestionnaireService';
import { IValidationService } from '../../services/interfaces/IValidationService';
import { InvalidInputModel } from '../Errorhandling/ServiceErrors/InvalidInputError';
import { ValidateInputEvent, ValidateInputEventData } from '../Events/ValidateInputEvent';
import { BaseModelStatus } from '../Models/BaseModelStatus';
import { MultiSelect, MultiSelectOption } from './MultiSelect';
import { FormControl, FormHelperText } from '@mui/material';
import { Frequency } from '../Models/Frequency';
import { Questionnaire } from '../Models/Questionnaire';
import { ICareplanService } from '../../services/interfaces/ICareplanService';
import { ErrorMessage } from '../Errors/MessageWithWarning';

export interface Props {
  careplan: PatientCareplan
  SetEditedCareplan?: (careplan: PatientCareplan) => void;
  onValidation?: (error: InvalidInputModel[]) => void;
  plandefinitionsToDisable?: string[]
}

export interface State {
  editedCareplan: PatientCareplan
  allPlanDefinitions: PlanDefinition[]
  errors: InvalidInputModel[]
  unresolvedQuestionnaires: string[]
}


export class PlanDefinitionSelect extends Component<Props, State> {
  static displayName = PlanDefinitionSelect.name;
  static contextType = ApiContext

   
static sectionName = "PlanDefinitionSelectSection"
  questionnaireService!: IQuestionnaireService;
  validationService!: IValidationService
  //planDefinitionService!: IPlanDefinitionService
  careplanService!: ICareplanService

  constructor(props: Props) {
    super(props);
     

    this.state = {
      editedCareplan: props.careplan.clone(),
      allPlanDefinitions: [],
      errors: [],
      unresolvedQuestionnaires: []
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSelection = this.handleSelection.bind(this);

    window.addEventListener(ValidateInputEvent.eventName, async (event: Event) => {
      const data = (event as CustomEvent).detail as ValidateInputEventData
      if (PlanDefinitionSelect.sectionName === data.sectionName)
        await this.validate();
    });

  }

  InitializeServices(): void {
const api = this.context as IApiContext
    this.questionnaireService =   api.questionnaireService;
    //this.planDefinitionService =   api.planDefinitionService;
    this.validationService =   api.validationService;
    this.careplanService =   api.careplanService;
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


  private mergeQuestionnaires(a: Questionnaire[], b: Questionnaire[]): Questionnaire[] {
    return a.concat(b.filter(q => !a.map(q => q.id).includes(q.id)))
  }

  getPlandefinitionFromIds(ids: string[]){
    return ids.map(id => this.state.allPlanDefinitions.find(x => x.id === id)).filter((x): x is PlanDefinition => !!x)
  }


  async handleSelection(ids: string[]): Promise<void> {

    if (!Array.isArray(ids)) ids = [ids]

    const plandefinitions = this.getPlandefinitionFromIds(ids)

    const careplan = this.state.editedCareplan;

    careplan.planDefinitions = plandefinitions ? plandefinitions as PlanDefinition[] : [];

    const selectedQuestionnaires = plandefinitions.flatMap(pd => pd?.questionnaires ? pd.questionnaires as Questionnaire[] : []);
    const existingQuestionnanires = careplan.questionnaires.filter(q => selectedQuestionnaires.map(q => q.id).includes(q.id));

    careplan.questionnaires = this.mergeQuestionnaires(existingQuestionnanires, selectedQuestionnaires)

    careplan.questionnaires.forEach(q => q.frequency = q.frequency ? q.frequency : new Frequency())

    this.setState({ editedCareplan: careplan })
    if (this.props.SetEditedCareplan) {
      this.props.SetEditedCareplan(careplan);
    }

    await this.validate()
  }

  async componentDidMount(): Promise<void> {
    try {
      this.populatePlanDefinitions();
      this.getUnresolvedQuestionnnaires();
    } catch (error: unknown) {
      this.setState(() => { throw error })
    }
  }

  async populatePlanDefinitions(): Promise<void> {
    try {
      const planDefinitions = await this.careplanService.GetAllPlanDefinitionsForCareplan([BaseModelStatus.ACTIVE]);
      this.setState({
        allPlanDefinitions: planDefinitions
      })
    } catch (error) {
      this.setState(() => { throw error });
    }
  }

  async getUnresolvedQuestionnnaires(): Promise<void> {
    try {
      if (this.props.careplan.id) {
        const unresolvedQuestionnaires = await this.careplanService.GetUnresolvedQuestionnaires(this.props.careplan.id)
        this.setState({
          unresolvedQuestionnaires: unresolvedQuestionnaires
        })
      }
    } catch (error) {
      this.setState(() => { throw error });
    }
  }


  isPlandefinitionUnresolved(planDefinition: PlanDefinition): boolean {
    let result = false;
    
    this.state.unresolvedQuestionnaires.forEach((id) => {
      if(planDefinition.questionnaires !== undefined ) result = planDefinition.questionnaires?.map(x => x.id).includes(id)
    })
      
    return result;
  }



  async validate(): Promise<void> {
    const plandefinitionErrors = await this.validationService.ValidatePlanDefinitions(this.state.editedCareplan.planDefinitions);
    //const questionnaireErrors =  await this.validationService.ValidateQuestionnaires(this.state.editedCareplan.questionnaires);

    const errors = plandefinitionErrors.concat(/*questionnaireErrors*/);


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
        <MultiSelect onChange={(_, planDefinition) => this.handleSelection(planDefinition ? planDefinition as [] : [])} value={this.state.editedCareplan.planDefinitions.map((x) => x.id!)} id="select-plandefinition">
          {this.state.allPlanDefinitions.map(planDefinition => {
            return (
              <MultiSelectOption key={"option" + planDefinition.id} /*disabled={this.isPlandefinitionUnresolved(planDefinition)}*/ value={planDefinition.id}>
                {planDefinition.name}
              </MultiSelectOption>
            )
          })}
        </MultiSelect>
        {hasError ? <FormHelperText error={true}><ErrorMessage message={firstError}/></FormHelperText> : <></>}
      </FormControl>
    )
  }

}


