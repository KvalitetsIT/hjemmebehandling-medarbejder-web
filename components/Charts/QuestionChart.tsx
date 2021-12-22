import * as React from 'react';
import { Component } from 'react';
import ApiContext from '../../pages/_context';
import { CategoryEnum } from '../Models/CategoryEnum';
import { QuestionnaireResponse } from '../Models/QuestionnaireResponse';
import { Question } from '../Models/Question';
import { Line } from 'react-chartjs-2';
import { NumberAnswer } from '../Models/Answer';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Button, ButtonGroup, Table, TableCell, TableRow, Tooltip } from '@mui/material';
import InsertChartIcon from '@mui/icons-material/InsertChart';
import TableRowsIcon from '@mui/icons-material/TableRows';
import { ThresholdNumber } from '../Models/ThresholdNumber';
import IDateHelper from '../../globalHelpers/interfaces/IDateHelper';

export enum DisplayModeEnum {
  GRAPH = "Graf",
  TABLE = "Tabel"
}

export interface Props {
  question: Question
  questionnaireResponses: QuestionnaireResponse[]
  thresholds: ThresholdNumber[]
  minimal: boolean;
}

export interface State {
  displayMode: DisplayModeEnum
}

export class QuestionChart extends Component<Props, State> {
  static displayName = QuestionChart.name;
  static contextType = ApiContext
  static defaultProps = {
    minimal: false
  }

  dateHelper!: IDateHelper

  constructor(props: Props) {
    super(props);
    this.state = {
      displayMode: DisplayModeEnum.GRAPH
    }

  }
  initialiszeServices(): void {
    this.dateHelper = this.context.dateHelper;
  }

  getChipColorFromCategory(category: CategoryEnum): string {
    const transparency = 1
    if (category === CategoryEnum.RED)
      return "rgba(215,11,4," + transparency + ")"
    if (category === CategoryEnum.YELLOW)
      return "rgba(255, 255, 0," + transparency + ")"
    if (category === CategoryEnum.BLUE)
      return "rgba(75,192,192," + transparency + ")"

    return "rgba(185,232,64," + transparency + ")"

  }

  getDisplayNameFromCategory(category: CategoryEnum): string {
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

  createThresholdDataset(question: Question, length: number): Array<{ label: string, data: number[], fill: boolean, backgroundColor: string, borderColor: string }> {

    const datasets: { label: string; data: number[]; fill: boolean; backgroundColor: string; borderColor: string; }[] = [];
    this.props.thresholds.forEach(threshold => {
      const dataFrom = [];
      const dataTo = [];

      for (let i = 0; i < length; i++) {
        if (!(threshold.from === undefined)) {
          dataFrom.push(threshold.from)
        }
        if (!(threshold.to === undefined)) {
          dataTo.push(threshold.to)
        }
      }

      //For each threshold, we add two lines; from and to

      //First create the from-line
      const fromDataset = {
        label: this.getDisplayNameFromCategory(threshold.category) + " (min)",
        data: dataFrom,
        pointRadius: 0,
        fill: false,
        datalabels: {
          color: 'rgba(0,100,200,0)'
        },
        order: threshold.category,
        backgroundColor: this.getChipColorFromCategory(threshold.category),
        borderColor: this.getChipColorFromCategory(threshold.category)
      }

      datasets.push(fromDataset)

      //Then create the to-line
      const toDataset = {
        label: this.getDisplayNameFromCategory(threshold.category) + " (max)",
        data: dataTo,
        pointRadius: 0,
        fill: false,
        datalabels: {
          color: 'rgba(0,100,200,0)'
        },
        order: threshold.category,
        backgroundColor: this.getChipColorFromCategory(threshold.category),
        borderColor: this.getChipColorFromCategory(threshold.category)
      }
      datasets.push(toDataset)
    })

    //Return the from and to line
    return datasets
  }

  renderGraph(data: { labels: (string | undefined)[], datasets: {} }): JSX.Element {
    //Remove all the legends for the thresholdvalues (since we are only interested in the question being a legend)
    const q = this.props.question.question
    const options = {
      scales : {
        y : {
          ticks : {
            display : !this.props.minimal
          }
        },
        x: {
          ticks : {
            display : !this.props.minimal
          }
        }
      },
      plugins: {
        legend: {
          labels: {
            filter: function (item: { text: string }) {
              return item.text === q
            }
          }
        }
      }
    }
    let plugins : any[] = []
    if(!this.props.minimal){
      plugins = [ChartDataLabels as any]
    }

    return (<Line height={100} plugins={plugins} options={options} data={data as any} />)
  }
  renderTable(answerLabels: (string | undefined)[], datasets: Array<{ data: number[] }>): JSX.Element {
    return (
      <>
        <Table>
          <TableRow>
            <TableCell>

            </TableCell>
            {answerLabels.map(label => {
              return (<TableCell>{label}</TableCell>)
            })}
          </TableRow>
          <TableRow>
            <TableCell>

            </TableCell>
            {datasets[0].data.map(label => {
              return (<TableCell>{label}</TableCell>)
            })}
          </TableRow>
        </Table>
      </>
    )
  }
  render(): JSX.Element {

    this.initialiszeServices();

    const questionnaireResponses = this.props.questionnaireResponses;
    const question = this.props.question;

    const answersData: number[] = [] //Contains all numbers that should be shown in chart
    const answersLabels = [] // Contains the x-axes values (dates)

    //Go through all responses and push answers and dates to answerData, and answerLabels
    for (let responseIndex = 0; responseIndex < questionnaireResponses.length; responseIndex++) {


      const response = questionnaireResponses[responseIndex];
      if (response && response.questions) {
        const questionnaireQuestion = Array.from(response.questions.keys()).find(x => x.Id == question.Id);
        const answer = response.questions.get(questionnaireQuestion!) as NumberAnswer

        answersData.push(answer.answer)
        answersLabels.push(this.dateHelper.DateToString(response.answeredTime!))
      }
    }


    const dataSets = []; //Each entry represents one line in the chart


    dataSets.push({ // This is the question-line of the graph
      label: this.props.minimal ? undefined : this.props.question.question,
      data: answersData,
      fill: false,
      datalabels: {
        align: "start",
        offset: 10, //space between point (the dot) and the number
        clip: false //if true, data will be removed if outside the chart-area
      },
      pointRadius: 5,
      backgroundColor: "rgba(0,100,200,1)", // point color
      borderColor: "rgba(0,100,200,1)",
      order: -99999 //If order is lowest, the line will be in front of other lines
    })

    this.createThresholdDataset(question, questionnaireResponses.length).forEach(x => dataSets.push(x))

    const data = {
      labels: answersLabels,
      datasets: dataSets,
    };


    let button = <></>
    if (!this.props.minimal) {
      button = (
        <>
          <ButtonGroup sx={{ paddingTop: 2 }} variant="text">
            <Tooltip title="Vis i graf">
              <Button disabled={this.state.displayMode == DisplayModeEnum.GRAPH} onClick={() => this.setState({ displayMode: DisplayModeEnum.GRAPH })}><InsertChartIcon /></Button>
            </Tooltip>
            <Tooltip title="Vis i tabel">
              <Button disabled={this.state.displayMode == DisplayModeEnum.TABLE} onClick={() => this.setState({ displayMode: DisplayModeEnum.TABLE })}><TableRowsIcon /></Button>
            </Tooltip>
          </ButtonGroup>
        </>
      )
    }


    if (this.state.displayMode === DisplayModeEnum.TABLE)
      return (<>{this.renderTable(answersLabels, dataSets)}{button}</>)

    return (<>{this.renderGraph(data)}{button}</>);
  }



}
