import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@material-ui/core';
import Chip from '@mui/material/Chip';
import React, { Component } from 'react';
import { Alert, AlertColor, Box, Button, Stack } from '@mui/material';
import { CategoryEnum } from '../Models/CategoryEnum';
import { QuestionnaireResponse, QuestionnaireResponseStatus } from '../Models/QuestionnaireResponse';
import { QuestionnaireResponseStatusSelect } from '../Input/QuestionnaireResponseStatusSelect';
import ApiContext from '../../pages/_context';
import IQuestionAnswerService from '../../services/interfaces/IQuestionAnswerService';
import IQuestionnaireService from '../../services/interfaces/IQuestionnaireService';
import { Questionnaire } from '../Models/Questionnaire';
import IDateHelper from '../../globalHelpers/interfaces/IDateHelper';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import { PatientCareplan } from '../Models/PatientCareplan';
import { LoadingSmallComponent } from '../Layout/LoadingSmallComponent';

export interface Props {
    questionnaires : Questionnaire
    careplan : PatientCareplan
}

export interface State {
  thresholdModalOpen : boolean
  questionnaireResponses : QuestionnaireResponse[]
loading: boolean
  pagesize : number
    page : number
}

export class AnswerTable extends Component<Props,State> {
  static displayName = AnswerTable.name;
  static contextType = ApiContext

  questionAnswerService! : IQuestionAnswerService;
  questionnaireService! : IQuestionnaireService;
  datehelper! : IDateHelper

constructor(props : Props){
    super(props);
    this.state = {
        thresholdModalOpen : false,
        questionnaireResponses : [],
        loading: true,
        pagesize : 6,
        page : 1
    }
}

  render () : JSX.Element{
    this.InitializeServices();
    const contents = this.renderTableData(this.props.questionnaires);
    return contents;
  }

  InitializeServices() : void{
    this.questionAnswerService = this.context.questionAnswerService;
    this.questionnaireService = this.context.questionnaireService;
    this.datehelper = this.context.dateHelper;
  }

  async componentDidMount() :  Promise<void>{
      try{
      await this.populateData(this.state.page)
    }  catch(error : any){
        this.setState(()=>{throw error})
      }  
  }
    async populateData(page : number) :  Promise<void> {
        this.setState({loading: true})
        const careplan = this.props.careplan
        const questionnaireResponses = await this.questionnaireService.GetQuestionnaireResponses(careplan.id,[this.props.questionnaires.id],page,this.state.pagesize)
        this.setState({questionnaireResponses : []}) //Without this the StatusSelect will not destroy and recreate status-component, which will result it to show wrong status (JIRA: RIM-103)
        this.setState({questionnaireResponses : questionnaireResponses,page : page, loading: false})

    }

 async NextPage() :  Promise<void>{
    const currenpage = this.state.page;
    const nextPage =currenpage+1
    await this.populateData(nextPage)

    this.forceUpdate()
}

 async PreviousPage() : Promise<void> {
     const currenpage = this.state.page;
     const nextPage = currenpage-1
     await this.populateData(nextPage)

    this.forceUpdate()
}

getChipColorFromCategory(category : CategoryEnum) : "error" | "warning"|"primary" | "default" | "success"{
    if(category === CategoryEnum.RED)
        return "error"
    if(category === CategoryEnum.YELLOW)
        return "warning"
    if(category === CategoryEnum.GREEN)
        return "success"
    if(category === CategoryEnum.BLUE)
        return "primary"

    return "default"
}

getDisplayNameFromCategory(category : CategoryEnum) : string {
    if(category === CategoryEnum.RED)
        return "Rød"
    if(category === CategoryEnum.YELLOW)
        return "Gul"
    if(category === CategoryEnum.GREEN)
        return "Grøn"
    if(category === CategoryEnum.BLUE)
        return "Blå"

    return "Ukendt"
}


  renderTableData(questionaire : Questionnaire) : JSX.Element{
    if(this.state.loading)
        return (<LoadingSmallComponent/>)

    const questionaireResponses = this.state.questionnaireResponses;
    if(!questionaireResponses || questionaireResponses.length === 0 && this.state.page == 1){
        return (
            <>
            <Typography>Ingen besvarelser for spørgeskema endnu. </Typography>
            <Typography variant="caption">Spørgeskemaet besvares {questionaire.frequency.ToString()}</Typography>
            </>
        )
    }

    
    let hasMorePages = false;

    

    if(this.state.questionnaireResponses.length === this.state.pagesize)
        hasMorePages = true;

    const questionnairesResponsesToShow = this.state.questionnaireResponses.slice(0,this.state.pagesize)
 
    
    
    return (<>
    <Box textAlign="right">
    <Button disabled={!hasMorePages} onClick={async ()=>await this.NextPage()}>Tidligere <NavigateBeforeIcon/> </Button>
    <Button disabled={this.state.page <= 1} onClick={async ()=>await this.PreviousPage()}>Senere <NavigateNextIcon  /></Button>
              
            </Box>
    <TableContainer component={Paper}>
    
      <Table aria-label="simple table">
        <TableHead>
            
          <TableRow>
          <TableCell>
         
            </TableCell>
            {questionnairesResponsesToShow.map(collection => {

                let severity = this.getChipColorFromCategory(collection.category) as string
               
                if(collection.status === QuestionnaireResponseStatus.Processed)
                    severity = "info"
                    
                return (
                    <TableCell align="center">
     
                            <Stack component={Alert} spacing={1} alignItems="center" alignContent="center" alignSelf="center" textAlign="center" icon={false} severity={severity as AlertColor}>
                                <Typography align="center">{collection.answeredTime ? this.datehelper.DayIndexToDay(collection.answeredTime.getUTCDay()) : ""}</Typography>
                                <Typography align="center" variant="caption">{collection.answeredTime ? this.datehelper.DateToString(collection.answeredTime) : ""}</Typography>
                                <QuestionnaireResponseStatusSelect questionnaireResponse={collection} />  
                            </Stack>
                     
                      
       
                      </TableCell>
                    
                )
            })}
            
          </TableRow>
            
        </TableHead>
        <TableBody>
                    {this.questionnaireService.findAllQuestions(questionnairesResponsesToShow).map(question => {
                        return (
                            <>
                            
                            <TableRow>
                                <TableCell>
                                    {question.question}                                    
                                </TableCell>
                                
                                {questionnairesResponsesToShow.map(questionResponse => {
                                    const answer = this.questionnaireService.findAnswer(question,questionResponse);
                                    const category = answer ? this.questionAnswerService.FindCategory(question,answer) : CategoryEnum.GREEN;
                                    return (
                                        <TableCell> <Chip component={Box} width="100%" size="medium"  color={this.getChipColorFromCategory(category)} label={answer ? answer.ToString() : ""} variant="filled" /></TableCell>
                                    )
                                })}
                            </TableRow>
                            </>
                        )
                    })}
        <TableRow>
        <TableCell></TableCell>

           
             </TableRow>         
        </TableBody>
      </Table>
    </TableContainer>

    
    </>
        )
  }
    
}
