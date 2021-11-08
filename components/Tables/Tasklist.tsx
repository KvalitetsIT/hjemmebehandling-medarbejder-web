import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';
import Chip from '@mui/material/Chip';
import React, { Component } from 'react';
import { Skeleton } from '@mui/material';
import { CategoryEnum } from '../Models/CategoryEnum';
import { TaskType } from '../Models/TaskType';
import { Link } from 'react-router-dom';
import ApiContext from '../../pages/_context';
import { Questionnaire } from '../Models/Questionnaire';
import IQuestionnaireService from '../../services/interfaces/IQuestionnaireService';

export interface Props {
    taskType : TaskType
    pageSize : number
}

export interface State {
  questionnaires : Array<Questionnaire>
  loading : boolean
}

export class Tasklist extends Component<Props,State> {
  static displayName = Tasklist.name;
  static contextType = ApiContext
  questionnaireService! : IQuestionnaireService;

  constructor(props : Props){
    super(props);

    this.state = {
        questionnaires : [],
        loading : true
    }
    
}

  render () {
    this.InitializeServices();
    let contents = this.state.loading ? <Skeleton variant="rectangular" height={400} /> : this.renderTableData(this.state.questionnaires);
    return contents;
  }

  InitializeServices(){
    this.questionnaireService = this.context.questionnaireService;
  }
  componentDidMount(){
    
      this.populateQuestionnaireResponses()
  }

  async  populateQuestionnaireResponses() {
    let responses: Questionnaire[] = []
    if(this.props.taskType === TaskType.UNFINISHED_RESPONSE) {
      responses = await this.questionnaireService.GetUnfinishedQuestionnaireResponses(1, this.props.pageSize)
    }
    if(this.props.taskType === TaskType.UNANSWERED_QUESTIONNAIRE) {
      responses = await this.questionnaireService.GetUnansweredQuestionnaires(1, this.props.pageSize)
    }

    this.setState({
        questionnaires : responses,
        loading : false
    });
}

getChipColorFromCategory(category : CategoryEnum){
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

getDanishColornameFromCategory(category : CategoryEnum){
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
  renderTableData(questionnaireResponses : Array<Questionnaire>){
        return (
            
            <TableContainer component={Paper}>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Kategori</TableCell>
            <TableCell align="left">Navn</TableCell>
            <TableCell align="left">CPR</TableCell>
            <TableCell align="left">Status</TableCell>
            <TableCell align="left">Spørgeskema</TableCell>
            <TableCell align="left">Besvaret</TableCell>
            <TableCell align="left"></TableCell>
            
          </TableRow>
                    {questionnaireResponses.map((questionnaire) => ( 
                        <>
                        {questionnaire.questionnaireResponses.map((questionnaireResponse) => {
                            return (
                              <TableRow
                                key={questionnaireResponse.patient.cpr}>
                                <TableCell component="th" scope="row">
                                  <Chip color={this.getChipColorFromCategory(questionnaireResponse.category)} label={this.getDanishColornameFromCategory(questionnaireResponse.category)} />
                                </TableCell>
                                <TableCell align="left">
                                  <Button  component={Link} to={"/patients/"+questionnaireResponse.patient.cpr} variant="text">{questionnaireResponse.patient.firstname + " " + questionnaireResponse.patient.lastname}</Button>
                                </TableCell>
                                <TableCell align="left">{questionnaireResponse.patient.cpr}</TableCell>
                                <TableCell align="left">{questionnaireResponse.status ? questionnaireResponse.status : "-" }</TableCell>
                                <TableCell align="left">{questionnaire.name}</TableCell>
                                <TableCell align="left">{questionnaireResponse.answeredTime ? questionnaireResponse.answeredTime.toLocaleDateString()+" "+questionnaireResponse.answeredTime.toLocaleTimeString() : "Ikke besvaret"}</TableCell>
                                <TableCell align="left">
                                  <Button component={Link} disabled={questionnaireResponse.status ? false : true} to={"/patients/"+questionnaireResponse.patient.cpr+"/questionnaires/"+questionnaire.id} variant="contained">Se besvarelse</Button>
                              </TableCell>
                              </TableRow>
                            )
                        })}
                        </>
                      
                
              ))}
        </TableHead>
        <TableBody>
          
        </TableBody>
      </Table>
    </TableContainer>
        )
  }
}
