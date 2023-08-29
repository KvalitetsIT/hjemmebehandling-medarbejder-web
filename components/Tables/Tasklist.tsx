import Chip from '@mui/material/Chip';
import React, { Component } from 'react';
import { Button, Card, Skeleton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { CategoryEnum } from '@kvalitetsit/hjemmebehandling/Models/CategoryEnum';
import { TaskType } from '@kvalitetsit/hjemmebehandling/Models/TaskType';
import { Link } from 'react-router-dom';
import ApiContext from '../../pages/_context';
import { Task } from '@kvalitetsit/hjemmebehandling/Models/Task';
import { IQuestionnaireService } from '../../services/interfaces/IQuestionnaireService';
import FhirUtils from '../../util/FhirUtils';
import IDateHelper from '@kvalitetsit/hjemmebehandling/Helpers/interfaces/IDateHelper';
import { ConfirmationButton } from '../Input/ConfirmationButton';
import IsEmptyCard from '@kvalitetsit/hjemmebehandling/Errorhandling/IsEmptyCard';
import { LoadingSmallComponent } from '../Layout/LoadingSmallComponent';
import { PageSelectorButtons } from '../Input/PageSelectorButtons';

export interface Props {
  taskType: TaskType
  pageSize: number
}

export interface State {
  tasks: Array<Task>
  loading: boolean
  smallLoading: boolean
  pageNumber: number
}

export class Tasklist extends Component<Props, State> {
  static displayName = Tasklist.name;
  static contextType = ApiContext
  declare context: React.ContextType<typeof ApiContext>
  questionnaireService!: IQuestionnaireService;
  dateHelper!: IDateHelper

  constructor(props: Props) {
    super(props);
    this.state = {
      tasks: [],
      loading: false,
      smallLoading: true,
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

  async getData(pageNumber: number): Promise<Task[]> {
    this.setState({
      smallLoading: true
    });

    let tasks: Task[] = []
    try {
      if (this.props.taskType === TaskType.UNFINISHED_RESPONSE) {
        tasks = await this.questionnaireService.GetUnfinishedQuestionnaireResponseTasks(pageNumber, this.props.pageSize)
      }
      if (this.props.taskType === TaskType.UNANSWERED_QUESTIONNAIRE) {
        tasks = await this.questionnaireService.GetUnansweredQuestionnaireTasks(pageNumber, this.props.pageSize)
      }
    } catch (error) {
      this.setState(() => { throw error })
    }

    this.setState({
      smallLoading: false
    });
    return tasks;
  }

  async populateQuestionnaireResponses(pageNumber: number, tasks: Task[]): Promise<void> {
    this.setState({
      pageNumber: pageNumber,
      tasks: tasks,
      smallLoading: false
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
      //Remove alarm using api
      await this.questionnaireService.RemoveAlarm(task)

      //Get new data to refresh table
      const data = await this.getData(this.state.pageNumber)
      await this.populateQuestionnaireResponses(this.state.pageNumber, data);

    } catch (error) {
      this.setState(() => { throw error })
    }

  }

  async openRemoveAlarmConfirmationBox(task: Task): Promise<void> {
    await this.removeAlarm(task);
  }

  async setPageNumber(pageNumber: number): Promise<void> {
    this.setState({ pageNumber: pageNumber })
  }

  renderTableData(tasks: Array<Task>): JSX.Element {
    return (<>
      <TableContainer component={Card}>
        {this.state.smallLoading ? <LoadingSmallComponent /> :

          <IsEmptyCard jsxWhenEmpty="Ingen besvarelser til rådighed" list={tasks}>
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
                {this.state.smallLoading ? <LoadingSmallComponent /> :
                  <>
                    {!tasks ? <></> : tasks.map((task) => (
                      <>
                        <TableRow key={"" + task.cpr + task.questionnaireId}>
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
                              <ConfirmationButton
                                variant="contained"
                                color="primary"
                                title="Fjern alarm"
                                buttonText="Fjern alarm"
                                className="remove-alarm__button"
                                contentOfDoActionBtn={'Fjern alarm'}
                                contentOfCancelBtn={'Fortryd'}
                                action={async () => await this.removeAlarm(task)}
                              >
                                <>
                                  Er du sikker på, at du ønsker at fjerne alarmen? - Dette vil påvirke hele afdelingen
                                </>
                              </ConfirmationButton>
                              :
                              <Button className="answer__button" component={Link} disabled={!task.responseLinkEnabled} to={"/patients/" + task.cpr + "/questionnaires/" + FhirUtils.unqualifyId(task.questionnaireId)} color="primary" variant="contained">Se besvarelse</Button>
                            }
                          </TableCell>
                        </TableRow>
                      </>
                    ))}
                  </>
                }
              </TableBody>
            </Table>
          </IsEmptyCard>
        }
      </TableContainer>
      <PageSelectorButtons
        currentPageNumber={this.state.pageNumber}
        setPage={async (pageNumber, data) => await this.populateQuestionnaireResponses(pageNumber, data as Task[])}
        getData={async (pageNumber) => (await this.getData(pageNumber)) as Task[]}
      />
    </>
    )
  }
}
