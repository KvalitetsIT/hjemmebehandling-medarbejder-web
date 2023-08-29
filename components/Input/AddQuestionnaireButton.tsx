import * as React from 'react';
import { Component } from 'react';
import { Button, Tooltip, Typography } from '@mui/material';
import ApiContext from '../../pages/_context';
import AddIcon from '@mui/icons-material/Add';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import {IQuestionnaireService} from '../../services/interfaces/IQuestionnaireService';
import { Questionnaire } from '@kvalitetsit/hjemmebehandling/Models/Questionnaire';
import CloseIcon from '@mui/icons-material/Close';
import { PatientCareplan } from '@kvalitetsit/hjemmebehandling/Models/PatientCareplan';
import { PlanDefinition } from '@kvalitetsit/hjemmebehandling/Models/PlanDefinition';
import { IPlanDefinitionService } from '../../services/interfaces/IPlanDefinitionService';
import { BaseModelStatus } from '@kvalitetsit/hjemmebehandling/Models/BaseModelStatus';

export interface Props {
    careplan : PatientCareplan
    afterAddingQuestionnaire? : () => void
}

export interface State {
    AddQuestionnaireBool : boolean
    allPlanDefinitions : Array<PlanDefinition>
}


export class AddQuestionnaireButton extends Component<Props,State> {
  static displayName = AddQuestionnaireButton.name;
  static contextType = ApiContext
  declare context: React.ContextType<typeof ApiContext>
  questionnaireService! : IQuestionnaireService
  planDefinitionService! : IPlanDefinitionService


  constructor(props : Props){
      super(props);
      this.state= {
            AddQuestionnaireBool : false,
            allPlanDefinitions : [],
      }
  }
  InitializeServices() : void{
    this.questionnaireService = this.context.questionnaireService;
    this.planDefinitionService = this.context.planDefinitionService;
  }

  async AddQuestionnaire(questionnaireToAdd : Questionnaire) : Promise<void>{
      try{
            await this.questionnaireService.AddQuestionnaireToCareplan(this.props.careplan, questionnaireToAdd);
            this.setState({AddQuestionnaireBool : false})
            this.forceUpdate();
            if(this.props.afterAddingQuestionnaire)
            this.props.afterAddingQuestionnaire();
        } catch(error : unknown){
            this.setState(()=>{throw error});
      }
    
  }
  

  render () : JSX.Element {
      this.InitializeServices();
      
      const plandefinitions = this.state.allPlanDefinitions;

      
    const options : Array<{planDefinition : PlanDefinition, questionnaire : Questionnaire}> = this.GetQuestionnairePlanDefinitionRelations(plandefinitions);

    return (<>
    {this.state.AddQuestionnaireBool ? 
        <>
            <Autocomplete
            autoComplete
            groupBy={(option) => option.planDefinition.name!}
            getOptionLabel={(option) => option.questionnaire!.name!}
            options={options}
            
            sx={{ width: 300 }}
            renderInput={(params) => <TextField {...params} label={<Typography><AddIcon fontSize="inherit"/> Tilføj spørgeskema</Typography>} />}
            onLostPointerCapture={()=>this.setState({AddQuestionnaireBool : false})}
            onChange={(event, value) => value ? this.AddQuestionnaire(value.questionnaire) : ""}
            />
            <Button onClick={()=>this.setState({AddQuestionnaireBool : false})}> <CloseIcon fontSize="inherit"/> </Button>   
        </>
    : 
        <Tooltip placement="top" title="Tilføj ekstra spørgeskema">
            <Button onClick={()=>this.setState({AddQuestionnaireBool : true})}> <AddIcon fontSize="inherit"/> </Button>            
        </Tooltip> 
        
}       
</>
    )
  }

  /**
   * This method wil return a list of one-to-one relations between plandefinitions and questionnaires
   * Main purpose is to group questionnaires by their related plandefinition
   * @param plandefinitions 
   * @returns Object with questionnaire and planDefinition
   */
    GetQuestionnairePlanDefinitionRelations(plandefinitions: PlanDefinition[]) : Array<{planDefinition : PlanDefinition, questionnaire : Questionnaire}> {
        const options : Array<{planDefinition : PlanDefinition, questionnaire : Questionnaire}> = []
        
        for(let pdefinitionIndex = 0; pdefinitionIndex<plandefinitions.length; pdefinitionIndex++){
            const currentPlanDefinition = plandefinitions[pdefinitionIndex];
            
            for(let questionnaireIndex = 0; questionnaireIndex < currentPlanDefinition.questionnaires!.length; questionnaireIndex++){
                const currentQuestionnaire = currentPlanDefinition.questionnaires![questionnaireIndex]
                
                options.push({
                    questionnaire : currentQuestionnaire,
                    planDefinition : currentPlanDefinition
                })
            }
        }
        return options;
    }

  async componentDidMount() : Promise<void>{
      try{
    await this.populateQuestionnairesList();
}  catch(error : any){
    this.setState(()=>{throw error})
  }  
  }

  async populateQuestionnairesList() : Promise<void>{
    const allPlanDefinitions = await this.planDefinitionService.GetAllPlanDefinitions([BaseModelStatus.ACTIVE])
    this.setState({
        allPlanDefinitions : allPlanDefinitions ?? []
    })
  }
 



}
