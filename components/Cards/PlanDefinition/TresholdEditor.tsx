import ChartData from "@kvalitetsit/hjemmebehandling/Charts/ChartData"
import { QuestionChart } from "@kvalitetsit/hjemmebehandling/Charts/QuestionChart"
import { CategoryEnum } from "@kvalitetsit/hjemmebehandling/Models/CategoryEnum"
import { Question } from "@kvalitetsit/hjemmebehandling/Models/Question"
import { Questionnaire } from "@kvalitetsit/hjemmebehandling/Models/Questionnaire"
import { ThresholdCollection } from "@kvalitetsit/hjemmebehandling/Models/ThresholdCollection"
import { ThresholdNumber } from "@kvalitetsit/hjemmebehandling/Models/ThresholdNumber"
import { Card, CardHeader, Typography, ButtonGroup, Button, Divider, CardContent, Grid, Box, Stack } from "@mui/material"
import { Component } from "react"
import ApiContext from "../../../pages/_context"
import { ColorSlider } from "../../Input/ColorSlider"
import TresholdInput from "../../Input/TresholdInput"

interface TresholdEditorProps {
    questionnaire: Questionnaire
    question: Question
    onChange: (values: ThresholdCollection, question: Question, questionnaire: Questionnaire) => void
}

interface TresholdEditorState {
    min: number
    max: number
    desiredNumberOfThresholds: number

}

export default class TresholdEditor extends Component<TresholdEditorProps, TresholdEditorState> {

    static displayName = ColorSlider.name;
    static contextType = ApiContext
    allowedNumberOfThresholds = [3, 5];

    constructor(props: TresholdEditorProps) {
        super(props);
        const questionThresholdCollection = props.questionnaire.thresholds?.find(q => q.questionId == props.question.Id)


        const questionThresholdNumbers = questionThresholdCollection?.thresholdNumbers?.sort((a, b) => parseInt(a.id) - parseInt(b.id)) ?? []
        console.log("questionThresholdNumbers", questionThresholdNumbers)

        const isNumberOfThresholdsInQuestionAllowed = this.allowedNumberOfThresholds.some(at => at == questionThresholdNumbers.length)
        let desiredThresholdCount = questionThresholdNumbers.length;
        if (!isNumberOfThresholdsInQuestionAllowed) {
            desiredThresholdCount = this.allowedNumberOfThresholds[0]
        }

        this.state = {
            min: this.calculateMin(questionThresholdCollection),
            max: this.calculateMax(questionThresholdCollection),
            desiredNumberOfThresholds: desiredThresholdCount,
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

        console.log("thresholds", thresholdNumbers)

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

                        <Grid item xs={12}>



                            <Grid container spacing={2} >
                                <Grid item xs={8}>
                                    <Box width="100%" marginBottom={5}>
                                        <Typography>
                                            Vælg et maksimum og et minimum for alarmgrænnserne.
                                            Værdier bliver valideringspunkter for patientents indtastning.
                                            Værdierne kan derfor ikke overskrives.
                                            Minimum værdien kan også sættes, dette kan være relevant f.eks. temperatur.
                                        </Typography>
                                    </Box>
                                    <Stack spacing={1}>
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

                                        {thresholdNumbers?.map((x) => {
                                            return (
                                                <TresholdInput
                                                    threshold={x}
                                                    onChange={(x) => this.updateTreshold(x)}
                                                ></TresholdInput>
                                            )
                                        })}

                                    </Stack>

                                </Grid>
                                <Grid item xs={4}>
                                    <QuestionChart
                                        chartData={new ChartData([], this.props.question, thresholdForQuestion, () => { return "" })}
                                        showThresholds={true}
                                        minimal={false}
                                    ></QuestionChart>
                                </Grid>
                            </Grid>


                        </Grid>

                    </Grid>
                </CardContent >
            </Card >



        )
    }

    updateTreshold(treshold: ThresholdNumber): void {

        console.log("Change: ", treshold)

        const question = this.props.question;
        const questionnaire = this.props.questionnaire;

        const thresholdCollection = this.props.questionnaire.thresholds?.find(thres => thres.questionId == question.Id)!;
        if (thresholdCollection && thresholdCollection.thresholdNumbers) {
            const index = thresholdCollection.thresholdNumbers.findIndex(entry => entry.id == treshold.id)
            thresholdCollection.thresholdNumbers[index] = treshold;
        }

        this.props.onChange(thresholdCollection, question, questionnaire)
    }
}