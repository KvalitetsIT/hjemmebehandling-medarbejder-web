import ChartData from "@kvalitetsit/hjemmebehandling/Charts/ChartData"
import { QuestionChart } from "@kvalitetsit/hjemmebehandling/Charts/QuestionChart"
import { CategoryEnum } from "@kvalitetsit/hjemmebehandling/Models/CategoryEnum"
import { Question } from "@kvalitetsit/hjemmebehandling/Models/Question"
import { Questionnaire } from "@kvalitetsit/hjemmebehandling/Models/Questionnaire"
import { ThresholdCollection } from "@kvalitetsit/hjemmebehandling/Models/ThresholdCollection"
import { ThresholdNumber } from "@kvalitetsit/hjemmebehandling/Models/ThresholdNumber"
import { Card, CardHeader, Typography, ButtonGroup, Button, Divider, CardContent, Grid, Box, Stack   } from "@mui/material"
import { Component } from "react"
import ApiContext from "../../../pages/_context"
import { MissingDetailsError } from "../../Errors/MissingDetailsError"
import { ColorSlider } from "../../Input/ColorSlider"
import ThresholdInput from "../../Input/ThresholdInput"

interface TresholdEditorProps {
    questionnaire: Questionnaire
    question: Question
    onChange: (values: ThresholdCollection, question: Question, questionnaire: Questionnaire) => void
    onError: (error?: Error) => void
}

interface TresholdEditorState {
    min: number
    max: number
    desiredNumberOfThresholds: number
    errors: (Error | undefined)[]
}

export default class TresholdEditor extends Component<TresholdEditorProps, TresholdEditorState> {

    static displayName = ColorSlider.name;
    static contextType = ApiContext
    allowedNumberOfThresholds = [3, 5];

    constructor(props: TresholdEditorProps) {
        super(props);
        const questionThresholdCollection = props.questionnaire.thresholds?.find(q => q.questionId == props.question.Id)

        const questionThresholdNumbers = questionThresholdCollection?.thresholdNumbers ?? []

        const isNumberOfThresholdsInQuestionAllowed = this.allowedNumberOfThresholds.some(at => at == questionThresholdNumbers.length)
        let desiredThresholdCount = questionThresholdNumbers.length;
        if (!isNumberOfThresholdsInQuestionAllowed) {
            desiredThresholdCount = this.allowedNumberOfThresholds[0]
        }

        this.state = {
            min: this.calculateMin(questionThresholdCollection),
            max: this.calculateMax(questionThresholdCollection),
            desiredNumberOfThresholds: desiredThresholdCount,
            errors: []
        }
    }

    calculateMin(thresholdCollection?: ThresholdCollection): number {
        let minOf: number[] = [0]
        if (thresholdCollection)
            minOf = thresholdCollection!.thresholdNumbers!.map(t => t?.from ?? 9999);
        const minVal = Math.min(...minOf);
        return minVal;
    }

    calculateMax(thresholdCollection?: ThresholdCollection): number {
        let maxOf: number[] = [10]
        if (thresholdCollection)
            maxOf = thresholdCollection!.thresholdNumbers!.map(t => t?.to ?? 9999);
        const maxVal = Math.max(...maxOf);
        return maxVal;
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

    CreateNewThresholds(): void {
        const defaultThreshold = Array.from(Array(this.state.desiredNumberOfThresholds + 1).keys());
        const defaultThresholdCollection = this.NumbersToThresholdCollection(this.props.question, defaultThreshold)
        this.props.onChange(defaultThresholdCollection, this.props.question, this.props.questionnaire)
        this.setState({
            min: this.calculateMin(defaultThresholdCollection),
            max: this.calculateMax(defaultThresholdCollection),
        })

    }
    NumbersToThresholdCollection(question: Question, numbers: number[]): ThresholdCollection {
        const thresholdCollection = new ThresholdCollection();
        thresholdCollection.questionId = question.Id!
        thresholdCollection.thresholdNumbers = [];

        const categoryByIndex = [CategoryEnum.YELLOW, CategoryEnum.GREEN, CategoryEnum.YELLOW, CategoryEnum.RED]
        for (let i = numbers.length - 1; i > 0; i--) {
            const threshold = new ThresholdNumber();
            threshold.to = numbers[i] * 10
            threshold.from = numbers[i - 1] * 10
            threshold.category = categoryByIndex[i % 4]
            thresholdCollection.thresholdNumbers.push(threshold);
        }
        return thresholdCollection;
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
        const minVal = this.calculateMin(thresholdForQuestion)
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

                    <Grid container>
                        <Grid item xs={8}>

                            <Box width="100%">
                                <Typography>
                                    Vælg et maksimum og et minimum for alarmgrænnserne.
                                    Værdier bliver valideringspunkter for patientents indtastning.
                                    Værdierne kan derfor ikke overskrives.
                                    Minimum værdien kan også sættes, dette kan være relevant f.eks. temperatur.
                                </Typography>
                            </Box>
                            <Stack width="100vh" bottom={0} position="absolute" marginBottom={4} spacing={2}>
                                <Grid container>
                                    <Grid item xs={4} textAlign="center">
                                        <Typography>Farve</Typography>
                                    </Grid>
                                    <Grid item xs={4} textAlign="center">
                                        <Typography>Fra</Typography>
                                    </Grid>
                                    <Grid item xs={4} textAlign="center">
                                        <Typography>Til (maksimum)</Typography>
                                    </Grid>
                                </Grid>
                                {thresholdNumbers?.map((x, i) => {
                                    return (
                                        <ThresholdInput
                                            threshold={x}
                                            onChange={(property) => this.updateTreshold(i, property)}
                                            onError={x => this.onError(i, x)}
                                        ></ThresholdInput>
                                    )
                                })}
                            </Stack>


                        </Grid>
                        <Grid xs={4}>

                            <QuestionChart
                                chartData={new ChartData([], this.props.question, thresholdForQuestion, () => { return "" })}
                                showThresholds={true}
                                minimal={false}
                                minHeight={450}
                                range={{
                                    min: Math.min(...thresholdNumbers.map(x => x.from!)),
                                    max: Math.max(...thresholdNumbers.map(x => x.to!)),
                                }}
                            ></QuestionChart>


                        </Grid>

                    </Grid>

                </CardContent >
            </Card >
        )
    }

    updateTreshold(index: number, property: string): void {
        const question = this.props.question;
        const questionnaire = this.props.questionnaire;
        const thresholdCollection = this.props.questionnaire.thresholds?.find(thres => thres.questionId == question.Id)
        if (property == "to") {
            if (index > 0) thresholdCollection!.thresholdNumbers![index - 1].from = thresholdCollection!.thresholdNumbers![index].to
        }
        if (property == "from") {
            if (index < thresholdCollection!.thresholdNumbers!.length - 1) thresholdCollection!.thresholdNumbers![index + 1].to = thresholdCollection!.thresholdNumbers![index].from
        }
        if (thresholdCollection) this.props.onChange(thresholdCollection, question, questionnaire)

    }

    onError(index: number, error?: Error): void {


        const errors = this.state.errors
        if (error) {
            errors[index] = error;

        } else {
            errors[index] = undefined;
        }
        this.setState({ errors: errors });

        const errorStrings = errors.filter(x => x != undefined).map(x => x!.message)
        this.props.onError(errorStrings.length > 0 ? new MissingDetailsError(errorStrings) : undefined)
    }
}