import * as React from 'react';
import { Component } from 'react';
import ApiContext from '../../pages/_context';
import { Grid, Slider, TextField, Typography } from '@mui/material';
import { CategoryEnum } from '@kvalitetsit/hjemmebehandling/Models/CategoryEnum';
import { Questionnaire } from '@kvalitetsit/hjemmebehandling/Models/Questionnaire';
import { Question } from '@kvalitetsit/hjemmebehandling/Models/Question';
import { ThresholdNumber } from '@kvalitetsit/hjemmebehandling/Models/ThresholdNumber';

export interface Props {
    questionnaire: Questionnaire
    question: Question
    onChange: (values: number[], question: Question, questionnaire: Questionnaire) => void
}

export interface State {
    min: number
    max: number
}


export class ColorSlider extends Component<Props, State> {
    static displayName = ColorSlider.name;
    static contextType = ApiContext

    getChipColorFromCategory(category: CategoryEnum): string {
        if (category === CategoryEnum.RED)
            return "red"
        if (category === CategoryEnum.YELLOW)
            return "yellow"
        if (category === CategoryEnum.GREEN)
            return "success"
        if (category === CategoryEnum.BLUE)
            return "blue"

        return ""

    }

    constructor(props: Props) {
        super(props);
        this.state = {
            min: 0,
            max: 500
        }

    }

    render(): JSX.Element {
        const questionnaire = this.props.questionnaire;
        const question = this.props.question;

        const thresholdForQuestion = questionnaire.thresholds?.find(thres => thres.questionId == question.Id)
        const marks: number[] = []
        const minVal = Math.min(...thresholdForQuestion!.thresholdNumbers!.map(t => t?.from ?? 9999));
        const maxVal = Math.max(...thresholdForQuestion!.thresholdNumbers!.map(t => t?.to ?? 0));
        marks.push(minVal)
        const thresholdNumbers = thresholdForQuestion!.thresholdNumbers;

        return (
            <Grid container>
                <Grid item xs={1}>
                    <TextField value={this.state.min} onChange={(event) => this.setMin(Number(event.currentTarget.value), minVal)} type="number" size='small'></TextField>
                </Grid>
                <Grid item xs={10} sx={{ paddingLeft: 10, paddingRight: 10 }}>
                    <Slider
                        disableSwap
                        value={[minVal, ...thresholdNumbers!.map(x => x?.to ?? minVal)]}
                        aria-labelledby="discrete-slider"
                        valueLabelDisplay="auto"
                        step={1}
                        min={this.state.min}
                        max={this.state.max}
                        marks={thresholdNumbers?.map(x => new mark(x))}
                        onChange={(event, value) => this.props.onChange(value as number[], this.props.question, this.props.questionnaire)}
                    />
                </Grid>
                <Grid item xs={1}>
                    <TextField value={this.state.max} onChange={(event) => this.setMax(Number(event.currentTarget.value), maxVal)} type="number" size='small'></TextField>
                </Grid>
            </Grid>
        )
    }

    setMax(number: number, minVal: number): void {
        const toSet = number < minVal ? minVal : number
        this.setState({ max: toSet })
    }

    setMin(number: number, maxVal: number): void {
        const toSet = number > maxVal ? maxVal : number
        this.setState({ min: toSet })
    }
}

class mark {
    label: JSX.Element
    value: number
    constructor(thresholdnumber: ThresholdNumber) {
        this.label = this.renderBelowMark(thresholdnumber);
        this.value = thresholdnumber.from!;
    }

    renderBelowMark(thresholdnumber: ThresholdNumber) {
        return (
            <>
                <Typography variant="h6">{this.categoryToString(thresholdnumber.category)}</Typography>
                <Typography variant="caption">Område: {thresholdnumber.from} - {thresholdnumber.to}</Typography>
            </>
        )
    }

    categoryToString(categoryEnum: CategoryEnum) {
        switch (categoryEnum) {
            case CategoryEnum.GREEN:
                return "Grøn"
            case CategoryEnum.YELLOW:
                return "Gul"
            case CategoryEnum.RED:
                return "Rød"
        }
        return "";
    }
}