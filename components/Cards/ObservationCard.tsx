import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Component } from 'react';
import { PatientCareplan } from '@kvalitetsit/hjemmebehandling/Models/PatientCareplan';
import { CardHeader, Divider, Grid, GridSize, Typography } from '@mui/material';
import { Questionnaire } from '@kvalitetsit/hjemmebehandling/Models/Questionnaire';
import { QuestionnaireResponse } from '@kvalitetsit/hjemmebehandling/Models/QuestionnaireResponse';
import ApiContext from '../../pages/_context';
import { ThresholdSlider } from '@kvalitetsit/hjemmebehandling/Charts/ThresholdSlider';
import IDateHelper from '@kvalitetsit/hjemmebehandling/Helpers/interfaces/IDateHelper';
import { IQuestionnaireService } from '../../services/interfaces/IQuestionnaireService';
import { NumberAnswer } from '@kvalitetsit/hjemmebehandling/Models/Answer';
import ChartData from '@kvalitetsit/hjemmebehandling/Charts/ChartData';
import ResponseViewCard from '@kvalitetsit/hjemmebehandling/Charts/ResponseViewCard';
import { Question, QuestionTypeEnum } from '@kvalitetsit/hjemmebehandling/Models/Question';
import { LoadingSmallComponent } from '../Layout/LoadingSmallComponent';

export interface Props {
    careplan: PatientCareplan;
    questionnaire: Questionnaire;
}

export interface State {
    questionnaireResponses: QuestionnaireResponse[]
    loading: boolean

}

export class ObservationCard extends Component<Props, State> {
    static displayName = ObservationCard.name;
    static contextType = ApiContext
    questionnaireService!: IQuestionnaireService;
    dateHelper!: IDateHelper

    constructor(props: Props) {
        super(props);
        this.state = {
            questionnaireResponses: [],
            loading: true
        }
    }
    initialiseServices(): void {
        this.questionnaireService = this.context.questionnaireService;
        this.dateHelper = this.context.dateHelper;
    }

    async componentDidMount(): Promise<void> {
        try {
            const responses = await this.questionnaireService.GetQuestionnaireResponses(this.props.careplan!.id!, [this.props.questionnaire.id], 1, 50)
            this.setState({ questionnaireResponses: responses, loading: false })
        } catch (error: unknown) {
            this.setState(() => { throw error })
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

        if (elementsInArray == 1)
            return 12;
        return 6
    }

    render(): JSX.Element {
        this.initialiseServices()

        if (this.state.loading)
            return (<LoadingSmallComponent />)



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

        if (allQuestions.length == 0) {
            return (
                <></>
            )
        }

        let counter = 0

        return (
            <>
                {allQuestions.map(question => {
                    const isFirst = counter++ == 0;
                    const threshold = this.props.questionnaire!.thresholds?.find(x => x.questionId == question.Id)

                    const dateToString = (date: Date) => this.dateHelper.DateToString(date);
                    const chartData = new ChartData(this.state.questionnaireResponses, question, threshold, dateToString);
                    const subheader = question.abbreviation ?? question.question ?? ""
                    return (
                        <Grid paddingLeft={isFirst ? 0 : 2} item xs={this.getColumnSize(allQuestions.length)}>
                            <ResponseViewCard chartData={chartData} />
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