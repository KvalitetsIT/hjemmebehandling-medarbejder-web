import { Button, Card, CardContent, CardHeader, Divider, Typography } from "@mui/material";
import React from "react";
import { Component, ReactNode } from "react";
import ChartData from "./ChartData";
import { QuestionChart } from "./QuestionChart";
import { QuestionTable } from "./QuestionTable";

export enum DisplayModeEnum {
    GRAPH = "Graf",
    TABLE = "Tabel"
}


export interface Props {
    chartData: ChartData
    showThresholds: boolean
    cardAction?: JSX.Element
}
export interface State {
    displayType: DisplayModeEnum
}

export default class ResponseViewCard extends Component<Props, State> {
    static defaultProps = {
        showThresholds: true,
    }

    constructor(props: Props) {
        super(props);
        this.state = {
            displayType: DisplayModeEnum.GRAPH
        }
    }

    renderGraphTableSwitch() {
        const graphButtonWeight = this.state.displayType == DisplayModeEnum.GRAPH ? "bold" : "normal";
        const tableButtonWeight = this.state.displayType == DisplayModeEnum.TABLE ? "bold" : "normal";
        return (
            <>
                <Button sx={{ fontWeight: graphButtonWeight }} onClick={() => this.setState({ displayType: DisplayModeEnum.GRAPH })}>Graf</Button>
                <Button sx={{ fontWeight: tableButtonWeight }} onClick={() => this.setState({ displayType: DisplayModeEnum.TABLE })}>Liste</Button>
            </>
        )
    }

    render(): ReactNode {
        const chartData = this.props.chartData;

        return (
            <Card>
                <CardHeader action={this.props.cardAction ?? this.renderGraphTableSwitch()} subheader={<Typography variant="h6" fontWeight="bold">{chartData.label}</Typography>} />
                <Divider />
                <CardContent>
                    {/*this.state.displayType == DisplayModeEnum.GRAPH ? <QuestionChart showThresholds={this.props.showThresholds} chartData={chartData} /> : <></>*/}
                    {this.state.displayType == DisplayModeEnum.TABLE ? <QuestionTable chartData={chartData} /> : <></>}
                </CardContent>
            </Card>
        )
    }
}