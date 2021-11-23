import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';
import Chip from '@mui/material/Chip';
import React, { Component } from 'react';
import { Skeleton } from '@mui/material';
import { CategoryEnum } from '../Models/CategoryEnum';
import { TaskType } from '../Models/TaskType';
import { Link } from 'react-router-dom';
import ApiContext from '../../pages/_context';
import { Task } from '../Models/Task';
import IQuestionnaireService from '../../services/interfaces/IQuestionnaireService';

import FhirUtils from '../../util/FhirUtils';
import IDateHelper from '../../globalHelpers/interfaces/IDateHelper';
import { ConfirmationButton } from '../Input/ConfirmationButton';

export interface Props {
    taskType : TaskType
    pageSize : number
}

export interface State {
  tasks : Array<Task>
  loading : boolean
}

export class Tasklist extends Component<Props,State> {
  static displayName = Tasklist.name;
  static contextType = ApiContext
  questionnaireService! : IQuestionnaireService;
  dateHelper! : IDateHelper

  constructor(props : Props){
    super(props);

    this.state = {
        tasks : [],
        loading : true
    }
    
}

  render () : JSX.Element{
      
    this.InitializeServices();

    const contents = this.state.loading ? <Skeleton variant="rectangular" height={400} /> : this.renderTableData(this.state.tasks);
    return contents;
  }

  InitializeServices() : void{
    this.questionnaireService = this.context.questionnaireService;
    this.dateHelper = this.context.dateHelper;
  }
  async componentDidMount() : Promise<void>{
    try{
      await this.populateQuestionnaireResponses();
    }  catch(error : any){
      this.setState(()=>{throw error})
    }    
  }

  async  populateQuestionnaireResponses() : Promise<void>{
    this.setState({
      loading : true
    });

    let tasks: Task[] = []

      if(this.props.taskType === TaskType.UNFINISHED_RESPONSE) {
        tasks = await this.questionnaireService.GetUnfinishedQuestionnaireResponseTasks(1, this.props.pageSize)
      }
      if(this.props.taskType === TaskType.UNANSWERED_QUESTIONNAIRE) {
        tasks = await this.questionnaireService.GetUnansweredQuestionnaireTasks(1, this.props.pageSize)
      }

    this.setState({
        tasks : tasks,
        loading : false
    });
}

getChipColorFromCategory(category : CategoryEnum) : "error"|"warning"|"success"|"primary"|"default" {
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

getDanishColornameFromCategory(category : CategoryEnum) : string{
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

  async removeAlarm(task : Task) : Promise<void>{
    try{
      await this.questionnaireService.RemoveAlarm(task)
      await this.populateQuestionnaireResponses();
    } catch(error){
      this.setState(()=>{throw error})
    }
    
  }

  async openRemoveAlarmConfirmationBox(task : Task) : Promise<void>{
    await this.removeAlarm(task);
  }

  renderTableData(tasks : Array<Task>) : JSX.Element{
    return (<>

            <TableContainer component={Paper}>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Kategori</TableCell>
            <TableCell align="left">Navn</TableCell>
            <TableCell align="left">CPR</TableCell>
            <TableCell align="left">Spørgeskema</TableCell>
            <TableCell align="left">Besvaret</TableCell>
            <TableCell align="left"></TableCell>
            
          </TableRow>
        {!tasks ? <></> : tasks.map((task) => (
          <>
            <TableRow key={task.cpr}>
              <TableCell component="th" scope="row">
                <Chip color={this.getChipColorFromCategory(task.category)} label={this.getDanishColornameFromCategory(task.category)} />
              </TableCell>
              <TableCell align="left">
                <Button  component={Link} to={"/patients/"+task.cpr} variant="text">{task.firstname + " " + task.lastname}</Button>
              </TableCell>
              <TableCell align="left">{task.cpr}</TableCell>
              <TableCell align="left">{task.questionnaireName}</TableCell>
              <TableCell align="left">{task && task.answeredTime ? this.dateHelper.DateToString(task.answeredTime) : "Ikke besvaret"}</TableCell>
              <TableCell align="left">
                {task.category == CategoryEnum.BLUE ? 
                <ConfirmationButton variant="contained" color="primary" title="Fjern alarm?" buttonText="Fjern alarm" action={async () => await this.removeAlarm(task)}>
                  Er du sikker på at du ønsker at fjerne alarmen? - Dette vil påvirke hele afdelingen
                </ConfirmationButton>
              :
              <Button component={Link} disabled={!task.responseLinkEnabled} to={"/patients/" + task.cpr + "/questionnaires/" + FhirUtils.unqualifyId(task.questionnaireId)} variant="contained">Se besvarelse</Button>
              }
                
              </TableCell>
            </TableRow>
          </>
        ))}

        </TableHead>
        <TableBody>
          
        </TableBody>
      </Table>
    </TableContainer>

    </>
        )
  }
}
