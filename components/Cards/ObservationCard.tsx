import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Component } from 'react';
import { PatientCareplan } from '../Models/PatientCareplan';
import { Alert, CardHeader, Grid, GridSize, Typography } from '@mui/material';
import { Questionnaire } from '../Models/Questionnaire';
import { QuestionnaireResponse } from '../Models/QuestionnaireResponse';
import ApiContext from '../../pages/_context';
import IDateHelper from '../../globalHelpers/interfaces/IDateHelper';
import IQuestionnaireService from '../../services/interfaces/IQuestionnaireService';
import { NumberAnswer } from '../Models/Answer';
import { Question, QuestionTypeEnum } from '../Models/Question';
import { QuestionChart } from '../Charts/QuestionChart';
import { ThresholdSlider } from './ThresholdSlider';
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
            const responses = await this.questionnaireService.GetQuestionnaireResponses(this.props.careplan.id, [this.props.questionnaire.id], 1, 5)
            //console.log(responses)
            //console.log(this.props.questionnaire.thresholds)
            this.setState({ questionnaireResponses: responses, loading: false })
        } catch (error: any) {
            this.setState(() => { throw error })
        }
    }

    findObservationQuestions(questionnaireResponse: QuestionnaireResponse): Question[] {
        console.log(questionnaireResponse)
        const questions: Question[] = [];
        questionnaireResponse.questions.forEach((answer, question) => {
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
        if (elementsInArray == 2)
            return 6;

        return 4
    }

    render(): JSX.Element {
        this.initialiseServices()

        if (this.state.loading)
            return (<LoadingSmallComponent />)



        const allQuestions: Question[] = [];

        if (this.state.questionnaireResponses.length > 0) {
            const questionIterator = this.state.questionnaireResponses[0].questions.keys()
            let question = questionIterator.next()

            while (!question.done) {
                if (question.value.type === QuestionTypeEnum.OBSERVATION)
                    allQuestions.push(question.value)
                question = questionIterator.next()
            }
        }

        if (allQuestions.length == 0) {
            return (
                <Alert severity="info">
                    <Typography>Ingen tilgængelige målinger</Typography>
                </Alert>
            )
        }

        let counter = 0

        return (
            <Grid container >
                {allQuestions.map(question => {
                    const isFirst = counter++ == 0;
                    const threshold = this.props.questionnaire.thresholds.find(x => x.questionId == question.Id)
                    console.log(question.Id)
                    console.log(threshold)
                    return (
                        <Grid paddingLeft={isFirst ? 0 : 2} item xs={this.getColumnSize(allQuestions.length)}>
                            <Card>
                                <CardHeader subheader={question.question} />
                                <CardContent>
                                    {threshold && threshold.thresholdNumbers ?
                                        <QuestionChart thresholds={threshold.thresholdNumbers} question={question} questionnaireResponses={this.state.questionnaireResponses} /> :
                                        <QuestionChart thresholds={[]} question={question} questionnaireResponses={this.state.questionnaireResponses} />
                                    }
                                </CardContent>
                            </Card>
                            <Card marginTop={3} component={Box}>
                                <CardHeader subheader={question.question + " - Alarmgrænser"} />
                                <CardContent>
                                    {threshold && threshold.thresholdNumbers ? <ThresholdSlider threshold={threshold.thresholdNumbers} question={question} /> : <></>}
                                </CardContent>
                            </Card>
                        </Grid>
                    )
                })}
            </Grid>
        );
    }
}