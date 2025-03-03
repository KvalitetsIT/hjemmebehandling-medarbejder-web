import { Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";

import React from "react";

import { Dataset } from "./ChartData";
import { Chart, ChartProps } from "./Charts";

export interface TableChartProps extends Omit<ChartProps, "renderChart"> {}

export const TableChart = (props: TableChartProps) => {

    const renderTable = (answerLabels: (string | undefined)[], datasets: Array<Dataset>): JSX.Element => {
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

    return (
        <Chart
            chartData={props.chartData}
            renderChart={(data) => {
                let answerData = data.answerData
                let answerLabels = data.answerLabels
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
                return (<>{renderTable(answerLabels, dataSets)}</>)
            }}
        />
    )
}

