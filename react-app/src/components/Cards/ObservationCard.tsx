import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Component } from 'react';
import { PatientCareplan } from '@kvalitetsit/hjemmebehandling/Models/PatientCareplan';
import { CardHeader, Divider, Grid, GridSize, Typography } from '@mui/material';
import { Questionnaire } from '@kvalitetsit/hjemmebehandling/Models/Questionnaire';
import { QuestionnaireResponse } from '@kvalitetsit/hjemmebehandling/Models/QuestionnaireResponse';
import ApiContext, { IApiContext } from '../../pages/_context';
import { ThresholdSlider } from '@kvalitetsit/hjemmebehandling/Charts/ThresholdSlider';
import IDateHelper from '@kvalitetsit/hjemmebehandling/Helpers/interfaces/IDateHelper';
import { IQuestionnaireService } from '../../services/interfaces/IQuestionnaireService';
import { NumberAnswer } from '@kvalitetsit/hjemmebehandling/Models/Answer';
import ChartData from '@kvalitetsit/hjemmebehandling/Charts/ChartData';
import ResponseViewCard from '@kvalitetsit/hjemmebehandling/Charts/ResponseViewCard';
import { Question, QuestionTypeEnum } from '@kvalitetsit/hjemmebehandling/Models/Question';
import { LoadingSmallComponent } from '../Layout/LoadingSmallComponent';
import { ThresholdNumber } from '@kvalitetsit/hjemmebehandling/Models/ThresholdNumber';
import { CategoryEnum } from '@kvalitetsit/hjemmebehandling/Models/CategoryEnum';
import { LineChart} from '@kvalitetsit/hjemmebehandling/Charts/LineChart';
import { TableChart} from '@kvalitetsit/hjemmebehandling/Charts/TableChart';
import { Line } from 'react-chartjs-2';
import annotationPlugin from "chartjs-plugin-annotation";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Legend,
  } from 'chart.js';
  
  ChartJS && ChartJS.register(
  
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    annotationPlugin,
    Title,
    Legend
  );

export interface Props {
    careplan: PatientCareplan;
    questionnaire?: Questionnaire;
}

export interface State {
    questionnaireResponses: QuestionnaireResponse[]
    loading: boolean
}

export class ObservationCard extends Component<Props, State> {
    static displayName = ObservationCard.name;

    static contextType = ApiContext
    //declare context: React.ContextType<typeof ApiContext>

    questionnaireService!: IQuestionnaireService;
    dateHelper!: IDateHelper

    constructor(props: Props) {
        super(props);

        this.state = {
            questionnaireResponses: [],
            loading: false
        }
    }

    initialiseServices(): void {
        const api = this.context as IApiContext
        this.questionnaireService = api.questionnaireService;
        this.dateHelper = api.dateHelper;
    }

    async componentDidMount(): Promise<void> {
        await this.getResponses()
    }

    async getResponses(): Promise<void> {
        if (this.props.questionnaire) {
            try {
                const response = await this.questionnaireService.GetQuestionnaireResponses(this.props.careplan!.id!, [this.props.questionnaire.id], 1, 50) ?? []
                
                const {list: questionnaireResponses} = response

                this.setState({ questionnaireResponses: questionnaireResponses, loading: false })
            } catch (error: unknown) {
                this.setState(() => { throw error })
            }
        }
    }

    findObservationQuestions(questionnaireResponse: QuestionnaireResponse): Question[] {
        const questions: Question[] = [];
        questionnaireResponse.questions!.forEach((answer, question) => {
            const numberAnswer: boolean = answer instanceof NumberAnswer;
            if (numberAnswer) {
                questions.push(question)
            }
        })
        return questions;
    }

    getColumnSize(elementsInArray: number): GridSize {
        if (elementsInArray === 1) return 12;
        return 6
    }

    updateAndNotify(): void {
        this.getResponses()
    }

    componentDidUpdate(prevProps: Readonly<Props>): void {
        if (prevProps.questionnaire !== this.props.questionnaire) {
            this.updateAndNotify();
        }
    }

    render(): JSX.Element {
        this.initialiseServices();
        //this.getResponses()
        if (this.state.loading) return (<LoadingSmallComponent />)

        const allQuestions: Question[] = [];

        if (this.state.questionnaireResponses.length > 0) {
            const questionIterator = this.state.questionnaireResponses[0].questions!.keys()
            let question = questionIterator.next()

            while (!question.done) {
                if (question.value.type === QuestionTypeEnum.OBSERVATION)
                    allQuestions.push(question.value)
                question = questionIterator.next()
            }
        }

        if (allQuestions.length === 0) {
            return (
                <></>
            )
        }

        return (
            <>
                {allQuestions.map((question, i) => {
                    const threshold = this.props.questionnaire!.thresholds?.find(x => x.questionId === question.Id)
                    const graphThreshold = structuredClone(threshold);

                    // answer values can lie outside thresholds as a consequence of input validation when answering a question
                    // was split out into system-wide (organization) threshold configured on the measurement type.
                    // This code will search for such value(s), and if found add extra visual-only thresholds to be displayed by the graph.
                    if (threshold && threshold.thresholdNumbers) {
                        const froms = threshold.thresholdNumbers!.filter(t => t.from !== undefined).map(t => t.from!);
                        const tos = threshold.thresholdNumbers!.filter(t => t.to !== undefined).map(t => t.to!);

                        const minThreshold = Math.min(...froms);
                        const maxThreshold = Math.max(...tos);

                        let minAnswer, maxAnswer;
                        for (const qr of this.state.questionnaireResponses) {
                            const questionnaireQuestion = Array.from(qr.questions!.keys()).find(x => x.isEqual(question));
                            const answer = qr.questions!.get(questionnaireQuestion!) as NumberAnswer | undefined

                            if (answer?.answer !== undefined) {
                                if (minAnswer === undefined || minAnswer > answer.answer!) {
                                    minAnswer = answer.answer
                                }
                                if (maxAnswer === undefined || maxAnswer < answer.answer!) {
                                    maxAnswer = answer.answer
                                }
                            }
                        }


                        if (minAnswer !== undefined && minAnswer < minThreshold) {
                            const extraVisualThreshold = new ThresholdNumber();
                            extraVisualThreshold.category = CategoryEnum.RED;
                            extraVisualThreshold.from = minThreshold;
                            extraVisualThreshold.to = minAnswer;

                            graphThreshold?.thresholdNumbers?.push(extraVisualThreshold);
                        }
                        if (maxAnswer !== undefined && maxAnswer > maxThreshold) {
                            const extraVisualThreshold = new ThresholdNumber();
                            extraVisualThreshold.category = CategoryEnum.RED;
                            extraVisualThreshold.from = maxAnswer;
                            extraVisualThreshold.to = maxThreshold;

                            graphThreshold?.thresholdNumbers?.push(extraVisualThreshold);
                        }
                    }

                    const dateToString = (date: Date) => this.dateHelper.DateToString(date);
                    const chartData = new ChartData(this.state.questionnaireResponses, question, graphThreshold, dateToString);
                    const subheader = question.abbreviation ?? question.question ?? ""


                    return (
                        <Grid paddingLeft={i % 2 === 0 ? 0 : 3} marginBottom={2} item xs={this.getColumnSize(allQuestions.length)}>
                           
                            <ResponseViewCard
                                chartData={chartData}
                                graph={<LineChart renderChart={(options, data, plugins) => <Line style={{ minHeight: "400px", maxHeight: "600px" }} plugins={plugins} options={options} data={data as any} />} showThresholds={true} chartData={chartData} />}
                                table={<TableChart chartData={chartData} />}
                            />

                            <Card marginTop={3} component={Box}>
                                <CardHeader subheader={<Typography variant="h6" fontWeight="bold">{subheader} - Alarmgrænser</Typography>} />
                                <Divider />

                                <CardContent>
                                    {threshold && threshold.thresholdNumbers ? <ThresholdSlider threshold={threshold.thresholdNumbers} question={question} /> : <></>}
                                </CardContent>

                            </Card>

                        </Grid>
                    )
                })}
            </>
        );
    }
}
