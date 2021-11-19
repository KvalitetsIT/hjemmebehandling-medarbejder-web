import * as React from 'react';
import { Component } from 'react';
import { Alert, AlertColor, Button, Snackbar, Tooltip } from '@mui/material';
import ApiContext from '../../pages/_context';
import { Typography } from '@material-ui/core';
import AddIcon from '@mui/icons-material/Add';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import IQuestionnaireService from '../../services/interfaces/IQuestionnaireService';
import { Questionnaire } from '../Models/Questionnaire';
import CloseIcon from '@mui/icons-material/Close';
import { PatientCareplan } from '../Models/PatientCareplan';
import { QuestionnaireAlreadyOnCareplan } from '../../apis/Errors/QuestionnaireAlreadyOnCareplan';
import { PlanDefinition } from '../Models/PlanDefinition';

export interface Props {
    careplan : PatientCareplan
    afterAddingQuestionnaire? : () => void
}

export interface State {
    AddQuestionnaireBool : boolean
    allPlanDefinitions : Array<PlanDefinition>

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
            allPlanDefinitions : [],
            snackbarOpen : false,
            snackbarColor: "info",
            snackbarText : "",
            snackbarTitle : ""
      }
  }
  InitializeServices() : void{
    this.questionnaireService = this.context.questionnaireService;
  }

  async AddQuestionnaire(questionnaireToAdd : Questionnaire) : Promise<void>{
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
  

  render () : JSX.Element {
      this.InitializeServices();
      
      const plandefinitions = this.state.allPlanDefinitions;

      
    const options : Array<{planDefinition : PlanDefinition, questionnaire : Questionnaire}> = this.GetQuestionnairePlanDefinitionRelations(plandefinitions);

    return (<>
    {this.state.AddQuestionnaireBool ? 
        <>
            <Autocomplete
            autoComplete
            groupBy={(option) => option.planDefinition.name}
            getOptionLabel={(option) => option.questionnaire.name}
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
        <Snackbar open={this.state.snackbarOpen} autoHideDuration={6000} onClose={this.closeSnackbar} anchorOrigin={{vertical: 'bottom',horizontal: 'right'}}>
            <Alert severity={this.state.snackbarColor} sx={{ width: '100%' }}>
                <h5>{this.state.snackbarTitle}</h5>
                
                {this.state.snackbarText}
            </Alert>
        </Snackbar>
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
            
            for(let questionnaireIndex = 0; questionnaireIndex < currentPlanDefinition.questionnaires?.length; questionnaireIndex++){
                const currentQuestionnaire = currentPlanDefinition.questionnaires[questionnaireIndex]
                
                options.push({
                    questionnaire : currentQuestionnaire,
                    planDefinition : currentPlanDefinition
                })
            }
        }
        return options;
    }

  closeSnackbar = () : void => {
    this.setState({snackbarOpen : false})
  };

  async componentDidMount() : Promise<void>{
      try{
    await this.populateQuestionnairesList();
}  catch(error : any){
    this.setState(()=>{throw error})
  }  
  }

  async populateQuestionnairesList() : Promise<void>{
    const allPlanDefinitions = await this.questionnaireService.GetAllPlanDefinitions()
    this.setState({
        allPlanDefinitions : allPlanDefinitions ?? []
    })
  }
 



}
