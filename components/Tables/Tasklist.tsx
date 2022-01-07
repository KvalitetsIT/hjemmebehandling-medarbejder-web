import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import Chip from '@mui/material/Chip';
import React, { Component } from 'react';
import { Button, ButtonGroup, Card, Skeleton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { CategoryEnum } from '@kvalitetsit/hjemmebehandling/Models/CategoryEnum';
import { TaskType } from '@kvalitetsit/hjemmebehandling/Models/TaskType';
import { Link } from 'react-router-dom';
import ApiContext from '../../pages/_context';
import { Task } from '@kvalitetsit/hjemmebehandling/Models/Task';
import IQuestionnaireService from '../../services/interfaces/IQuestionnaireService';
import FhirUtils from '../../util/FhirUtils';
import IDateHelper from '@kvalitetsit/hjemmebehandling/Helpers/interfaces/IDateHelper';
import { ConfirmationButton } from '../Input/ConfirmationButton';
import IsEmptyCard from '@kvalitetsit/hjemmebehandling/Errorhandling/IsEmptyCard';

export interface Props {
  taskType: TaskType
  pageSize: number
}

export interface State {
  tasks: Array<Task>
  loading: boolean
  pageNumber: number
}

export class Tasklist extends Component<Props, State> {
  static displayName = Tasklist.name;
  static contextType = ApiContext
  questionnaireService!: IQuestionnaireService;
  dateHelper!: IDateHelper

  constructor(props: Props) {
    super(props);
    this.state = {
      tasks: [],
      loading: true,
      pageNumber: 1
    }

  }

  render(): JSX.Element {

    this.InitializeServices();

    const contents = this.state.loading ? <Skeleton variant="rectangular" height={400} /> : this.renderTableData(this.state.tasks);
    return contents;
  }

  InitializeServices(): void {
    this.questionnaireService = this.context.questionnaireService;
    this.dateHelper = this.context.dateHelper;
  }
  async componentDidMount(): Promise<void> {
    try {
      await this.populateQuestionnaireResponses(this.state.pageNumber);
    } catch (error: any) {
      this.setState(() => { throw error })
    }
  }

  async populateQuestionnaireResponses(pageNumber: number): Promise<void> {
    this.setState({
      loading: true
    });

    let tasks: Task[] = []

    if (this.props.taskType === TaskType.UNFINISHED_RESPONSE) {
      tasks = await this.questionnaireService.GetUnfinishedQuestionnaireResponseTasks(pageNumber, this.props.pageSize)
    }
    if (this.props.taskType === TaskType.UNANSWERED_QUESTIONNAIRE) {
      tasks = await this.questionnaireService.GetUnansweredQuestionnaireTasks(pageNumber, this.props.pageSize)
    }

    this.setState({
      tasks: tasks,
      loading: false
    });
  }

  getChipColorFromCategory(category: CategoryEnum): "error" | "warning" | "success" | "primary" | "default" {
    if (category === CategoryEnum.RED)
      return "error"
    if (category === CategoryEnum.YELLOW)
      return "warning"
    if (category === CategoryEnum.GREEN)
      return "success"
    if (category === CategoryEnum.BLUE)
      return "primary"

    return "default"

  }

  getDanishColornameFromCategory(category: CategoryEnum): string {
    if (category === CategoryEnum.RED)
      return "Rød"
    if (category === CategoryEnum.YELLOW)
      return "Gul"
    if (category === CategoryEnum.GREEN)
      return "Grøn"
    if (category === CategoryEnum.BLUE)
      return "Blå"

    return "Ukendt"
  }

  async removeAlarm(task: Task): Promise<void> {
    try {
      await this.questionnaireService.RemoveAlarm(task)
      await this.populateQuestionnaireResponses(this.state.pageNumber);
    } catch (error) {
      this.setState(() => { throw error })
    }

  }

  async openRemoveAlarmConfirmationBox(task: Task): Promise<void> {
    await this.removeAlarm(task);
  }

  async nextPage() : Promise<void> {
    const nextPageNumber = this.state.pageNumber + 1
    this.setState({ pageNumber: nextPageNumber })
    await this.populateQuestionnaireResponses(nextPageNumber)
  }
  async previousPage() : Promise<void> {
    const previousPageNumber = this.state.pageNumber - 1
    this.setState({ pageNumber: previousPageNumber })
    await this.populateQuestionnaireResponses(previousPageNumber)
  }

  renderTableData(tasks: Array<Task>): JSX.Element {

    const hasMorePages: boolean = this.state.tasks.length >= this.props.pageSize;
    const currentpage = this.state.pageNumber
    const previouspage: number = currentpage - 1

    return (<>
      <IsEmptyCard jsxWhenEmpty="Ingen besvarelser til rådighed" list={tasks}>
        <TableContainer component={Card}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell style={{ width: '3%' }} >Alarm</TableCell>
                <TableCell style={{ width: '35%' }} align="left">Navn</TableCell>
                <TableCell style={{ width: '12%' }} align="left">CPR</TableCell>
                <TableCell style={{ width: '12%' }} align="left">Patientgruppe</TableCell>
                <TableCell style={{ width: '12%' }} align="left">Spørgeskema</TableCell>
                <TableCell style={{ width: '12%' }} align="left">Besvaret</TableCell>
                <TableCell align="right"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {!tasks ? <></> : tasks.map((task) => (
                <>
                  <TableRow key={task.cpr}>
                    <TableCell component="th" scope="row">
                      <Chip className="chip__alarm" color={this.getChipColorFromCategory(task.category)} label={this.getDanishColornameFromCategory(task.category)} />
                    </TableCell>
                    <TableCell align="left">
                      <Button className="patient__button" component={Link} to={"/patients/" + task.cpr} variant="text">{task.firstname + " " + task.lastname}</Button>
                    </TableCell>
                    <TableCell align="left">{task.cprToString()}</TableCell>
                    <TableCell align="left">{task.planDefinitionName}</TableCell>
                    <TableCell align="left">{task.questionnaireName}</TableCell>
                    <TableCell align="left">{task && task.answeredTime ? this.dateHelper.DateToString(task.answeredTime) : "Ikke besvaret"}</TableCell>
                    <TableCell className="action-button__cell" align="right">
                      {task.category == CategoryEnum.BLUE ?
                        <ConfirmationButton variant="contained" color="primary" title="Fjern alarm" buttonText="Fjern alarm" className="remove-alarm__button" action={async () => await this.removeAlarm(task)}>
                          Er du sikker på at du ønsker at fjerne alarmen? - Dette vil påvirke hele afdelingen
                        </ConfirmationButton>
                        :
                        <Button className="answer__button" component={Link} disabled={!task.responseLinkEnabled} to={"/patients/" + task.cpr + "/questionnaires/" + FhirUtils.unqualifyId(task.questionnaireId)} color="primary" variant="contained">Se besvarelse</Button>
                      }
                    </TableCell>
                  </TableRow>
                </>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </IsEmptyCard>
      <ButtonGroup>
        <Button variant="text" className='button__page-switch' onClick={async () => await this.previousPage()} disabled={previouspage <= 0}><NavigateBeforeIcon /></Button>
        <Button variant="text" className='button__page-switch' disabled> {currentpage} </Button>
        <Button variant="text" className='button__page-switch' onClick={async () => await this.nextPage()} disabled={!hasMorePages}><NavigateNextIcon /></Button>
      </ButtonGroup>

    </>
    )
  }
}
