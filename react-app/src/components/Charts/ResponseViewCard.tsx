import { Button, Card, CardContent, CardHeader, Divider, Typography } from "@mui/material";
import React, { ReactElement, useState } from "react";
import { Component, ReactNode } from "react";
import { QuestionChart } from "./QuestionChart";
import { QuestionTable } from "./QuestionTable";
import ChartData from "./ChartData";
import { Chart } from "./Charts";

export enum DisplayModeEnum {
    GRAPH = "Graf",
    TABLE = "Tabel"
}

export interface Props {
    chartData: ChartData
    showThresholds: boolean
    cardAction?: JSX.Element
    graph?: ReactElement<typeof Chart>
    table?: ReactElement<typeof Chart>
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

    getFontWeight(displayMode: DisplayModeEnum) {
        return this.state.displayType == displayMode ? "bold" : "normal";
    }

    renderButton(mode: DisplayModeEnum) {
        <Button
            sx={{ fontWeight: this.getFontWeight(mode) }}
            onClick={() => this.setState({ displayType: mode })}
        >{mode.toString()}</Button>
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

    renderContent(mode: DisplayModeEnum) {
        switch (mode) {
            case DisplayModeEnum.GRAPH: return (this.props.graph)
            case DisplayModeEnum.TABLE: return (this.props.table)
            default: return (this.props.graph)
        }
    }
    render(): ReactNode {
        const chartData = this.props.chartData;

        return (
            <Card>
                <CardHeader action={this.props.cardAction ?? this.renderGraphTableSwitch()} subheader={<Typography variant="h6" fontWeight="bold">{chartData.label}</Typography>} />
                <Divider />
                <CardContent> {this.renderContent(this.state.displayType)} </CardContent>
            </Card>
        )
    }
}
