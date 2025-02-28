import { Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import React, { ReactElement } from "react";
import ChartData, { Dataset } from "./ChartData";

import IDateHelper from "../Helpers/interfaces/IDateHelper";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { ChartOptions } from "chart.js";

export interface ChartProps {
    chartData: ChartData
    renderChart: (props: ChartData) => React.ReactElement
}

export const Chart = (props: ChartProps) => {
    return (<>{props.renderChart(props.chartData)}</>)
}