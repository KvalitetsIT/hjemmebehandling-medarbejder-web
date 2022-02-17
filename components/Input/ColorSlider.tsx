import * as React from 'react';
import { Component } from 'react';
import ApiContext from '../../pages/_context';
import { Box, Button, ButtonGroup, Card, CardContent, CardHeader, createTheme, Divider, Grid, Slider, TextField, ThemeProvider, Typography } from '@mui/material';
import { CategoryEnum } from '@kvalitetsit/hjemmebehandling/Models/CategoryEnum';
import { Questionnaire } from '@kvalitetsit/hjemmebehandling/Models/Questionnaire';
import { Question } from '@kvalitetsit/hjemmebehandling/Models/Question';
import { ThresholdNumber } from '@kvalitetsit/hjemmebehandling/Models/ThresholdNumber';
import { ThresholdCollection } from '@kvalitetsit/hjemmebehandling/Models/ThresholdCollection';

export interface Props {
    questionnaire: Questionnaire
    question: Question
    onChange: (values: ThresholdCollection, question: Question, questionnaire: Questionnaire) => void
}

export interface State {
    min: number
    max: number
    desiredNumberOfThresholds: number
}


export class ColorSlider extends Component<Props, State> {
    static displayName = ColorSlider.name;
    static contextType = ApiContext
    allowedNumberOfThresholds = [3, 5];

    green = '#61BD84'
    yellow = '#FFD78C'
    red = '#EE6969'

    getChipColorFromCategory(category: CategoryEnum): string {
        if (category === CategoryEnum.RED)
            return this.red
        if (category === CategoryEnum.YELLOW)
            return this.yellow
        if (category === CategoryEnum.GREEN)
            return this.green

        return ""

    }

    constructor(props: Props) {
        super(props);
        const questionThresholdNumbers = props.questionnaire.thresholds?.find(q => q.questionId == props.question.Id)?.thresholdNumbers ?? []
        const isNumberOfThresholdsInQuestionAllowed = this.allowedNumberOfThresholds.some(at => at == questionThresholdNumbers.length)
        let desiredThresholdCount = questionThresholdNumbers.length;
        if (!isNumberOfThresholdsInQuestionAllowed) {
            desiredThresholdCount = this.allowedNumberOfThresholds[0]
        }

        this.state = {
            min: this.calculateMin(),
            max: this.calculateMax(),
            desiredNumberOfThresholds: desiredThresholdCount
        }
    }

    CreateNewThresholds(): void {
        const defaultThreshold = Array.from(Array(this.state.desiredNumberOfThresholds + 1).keys());
        const defaultThresholdCollection = this.NumbersToThresholdCollection(this.props.question, defaultThreshold)
        this.props.onChange(defaultThresholdCollection, this.props.question, this.props.questionnaire)
    }


    render(): JSX.Element {

        const questionnaire = this.props.questionnaire;
        const question = this.props.question;

        const thresholdForQuestion = questionnaire.thresholds?.find(thres => thres.questionId == question.Id)
        if (this.state.desiredNumberOfThresholds != thresholdForQuestion?.thresholdNumbers?.length) {
            this.CreateNewThresholds();
            return (<></>);
        }

        const marks: number[] = []
        const minVal = this.calculateMin()
        const maxVal = this.calculateMax()
        marks.push(minVal)

        let thresholdNumbers: ThresholdNumber[] = []
        if (thresholdForQuestion?.thresholdNumbers)
            thresholdNumbers = thresholdForQuestion.thresholdNumbers;


        return (
            <Card elevation={2}>
                <CardHeader subheader={<Typography variant="h6">{(question as Question).question}</Typography>} action={
                    <ButtonGroup variant="text" >
                        {this.allowedNumberOfThresholds.map(number => {
                            const isDesired = number == this.state.desiredNumberOfThresholds
                            return (
                                <Button sx={{ paddingLeft: 1, paddingRight: 1 }} onClick={() => { this.setState({ desiredNumberOfThresholds: number }); this.forceUpdate(); }}>
                                    <Typography variant='h6' fontWeight={isDesired ? "bold" : "initial"}>
                                        {number} grænser
                                    </Typography>
                                </Button>
                            )
                        })}
                    </ButtonGroup>
                } />
                <Divider />
                <CardContent>
                    <Grid container sx={{ alignItems: "center" }}>
                        <Grid item xs={1} >
                            <TextField label="Min" value={this.state.min} onChange={(event) => this.setMin(Number(event.currentTarget.value), minVal)} type="number" size='small'></TextField>
                        </Grid>
                        <Grid item xs={10} sx={{ paddingLeft: 10, paddingRight: 10, position: "relative", zIndex: 1 }}>
                            <ThemeProvider theme={createTheme({
                                components: {
                                    MuiSlider: {
                                        styleOverrides: {
                                            track: {
                                                background: this.generateColor(thresholdNumbers),
                                                border: 0
                                            },
                                            thumbColorPrimary: {
                                                backgroundColor: 'white'
                                            }
                                        }
                                    }
                                }
                            })}>
                                <Slider
                                    disableSwap
                                    sx={{
                                        minHeight: 150,

                                    }}
                                    key={"slider_" + question.Id}
                                    value={[minVal, ...thresholdNumbers!.map(x => x?.to ?? minVal)]}
                                    aria-labelledby="discrete-slider"
                                    valueLabelDisplay="off"
                                    step={0.1}
                                    min={this.state.min}
                                    max={this.state.max}
                                    marks={thresholdNumbers?.map(x => new mark(x))}
                                    onChange={(event, value) => this.setSliderPoint(value as number[])}
                                />
                            </ThemeProvider>
                        </Grid>
                        <Grid item xs={1}>
                            <TextField label="Max" value={this.state.max} onChange={(event) => this.setMax(Number(event.currentTarget.value), maxVal)} type="number" size='small'></TextField>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        )
    }

    setSliderPoint(sliderPoints: number[]): void {
        if (this.hasDuplicates(sliderPoints)) //No point should have same value
            return;

        this.props.onChange(this.NumbersToThresholdCollection(this.props.question, sliderPoints), this.props.question, this.props.questionnaire)
    }


    generateColor(thresholdNumbers: ThresholdNumber[]): string {
        let string = "";
        const hundredPercent = this.max(thresholdNumbers);

        let latestPercentageTo = 0;
        thresholdNumbers.forEach((t) => {

            const percentageFrom = latestPercentageTo
            let percentageTo = 1;
            if (t.to != undefined && t.from != undefined)
                percentageTo = (t.to - t.from + percentageFrom)

            latestPercentageTo = percentageTo

            if (string != "")
                string += ", "

            string += this.getChipColorFromCategory(t.category)
            string += " "
            string += (percentageFrom / hundredPercent * 100) + "%"
            string += ", "
            string += this.getChipColorFromCategory(t.category)
            string += " "
            string += (percentageTo / hundredPercent * 100) + "%"
        });

        return "linear-gradient(90deg, " + string + ")";
    }

    max(thresholdNumbers: ThresholdNumber[]): number {
        let totalWidth: number = 0;
        thresholdNumbers.forEach(threshold => {
            const to = threshold.to ?? 100;
            const from = threshold.from ?? -100;
            totalWidth += to - from
        })
        return totalWidth
    }

    hasDuplicates(checkForDuplicatesArray: number[]): boolean {
        let morePointsWithSameValue = false;
        checkForDuplicatesArray.forEach(a => {
            let counter = 0 //a should be present once but not more than that
            checkForDuplicatesArray.forEach(b => {
                if (a == b)
                    counter++;
                if (counter > 1)
                    morePointsWithSameValue = true
            })
        })

        return morePointsWithSameValue;
    }

    calculateMin(): number {
        const questionnaire = this.props.questionnaire;
        const question = this.props.question;
        const thresholdForQuestion = questionnaire.thresholds?.find(thres => thres.questionId == question.Id)
        let minOf: number[] = [0]
        if (thresholdForQuestion)
            minOf = thresholdForQuestion!.thresholdNumbers!.map(t => t?.from ?? 9999);

        const minVal = Math.min(...minOf);
        return minVal;

    }

    calculateMax(): number {
        const questionnaire = this.props.questionnaire;
        const question = this.props.question;
        const thresholdForQuestion = questionnaire.thresholds?.find(thres => thres.questionId == question.Id)
        let maxOf: number[] = [10]
        if (thresholdForQuestion)
            maxOf = thresholdForQuestion!.thresholdNumbers!.map(t => t?.to ?? 9999);
        const maxVal = Math.max(...maxOf);
        return maxVal;
    }

    setMax(number: number, minVal: number): void {
        const toSet = number < minVal ? minVal : number
        this.setState({ max: toSet })
    }

    setMin(number: number, maxVal: number): void {
        const toSet = number > maxVal ? maxVal : number
        this.setState({ min: toSet })
    }

    NumbersToThresholdCollection(question: Question, numbers: number[]): ThresholdCollection {
        const thresholdCollection = new ThresholdCollection();
        thresholdCollection.questionId = question.Id!
        thresholdCollection.thresholdNumbers = [];

        const categoryByIndex = [CategoryEnum.GREEN, CategoryEnum.YELLOW, CategoryEnum.RED, CategoryEnum.YELLOW]
        for (let i = 0; i < numbers.length - 1; i++) {
            const threshold = new ThresholdNumber();
            threshold.from = numbers[i]
            threshold.to = numbers[i + 1]
            threshold.category = categoryByIndex[i % 4]
            thresholdCollection.thresholdNumbers.push(threshold);
        }

        return thresholdCollection;
    }
}

class mark {
    label: JSX.Element
    value: number
    constructor(thresholdnumber: ThresholdNumber) {
        this.value = thresholdnumber.from!;
        this.label = this.renderBelowMark(thresholdnumber);
    }

    renderBelowMark(thresholdnumber: ThresholdNumber) {
        return (
            <Box position="absolute" zIndex={9999999}>
                <Grid container>
                    <Grid item xs={12}>
                        <Typography variant="h6">{this.categoryToString(thresholdnumber.category)}</Typography>
                        <Typography variant="caption">Område: {thresholdnumber.from} - {thresholdnumber.to}</Typography>
                        <Box marginTop={5} minWidth={50} maxWidth={70}>
                            <TextField onChange={(e) => e.stopPropagation()} onClick={(e) => e.stopPropagation()} variant='filled' value={this.value} type="number"></TextField>
                        </Box>
                    </Grid>


                </Grid>
            </Box>
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