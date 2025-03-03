import * as React from 'react';
import { Component } from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import ChartData, { Dataset } from './ChartData';
import IDateHelper from '../Helpers/interfaces/IDateHelper';


export interface Props {
    chartData: ChartData
}

export class QuestionTable extends Component<Props, {}> {
    static displayName = QuestionTable.name;
    static defaultProps = {
        dateToString: (date: Date) => date.toLocaleDateString()
    }

    dateHelper!: IDateHelper


    renderTable(answerLabels: (string | undefined)[], datasets: Array<Dataset>): JSX.Element {
        return (
            <>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Dato</TableCell>
                            <TableCell>Værdi</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {answerLabels.map((date, index) => {
                            const dateToRender = date;
                            const dataPointToRender = datasets[0].data[index];
                            return (
                                <TableRow>
                                    <TableCell>{dateToRender}</TableCell>
                                    <TableCell>{dataPointToRender}</TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </>
        )
    }



    render(): JSX.Element {

        let answerData = this.props.chartData.answerData
        let answerLabels = this.props.chartData.answerLabels


        const dataSets: Dataset[] = []; //Each entry represents one line in the chart


        dataSets.push({ // This is the question-line of the graph
            data: answerData,
            fill: false,
            datalabels: {
                align: "start",
                offset: 10, //space between point (the dot) and the number
                clip: false //if true, data will be removed if outside the chart-area
            },
            pointRadius: 5,
            backgroundColor: "black", // point color
            borderColor: "black",
            order: -99999 //If order is lowest, the line will be in front of other lines
        })
        const data: unknown = {
            labels: answerLabels,
            datasets: dataSets,
        };

        return (<>{this.renderTable(answerLabels, dataSets)}</>)

    }



}