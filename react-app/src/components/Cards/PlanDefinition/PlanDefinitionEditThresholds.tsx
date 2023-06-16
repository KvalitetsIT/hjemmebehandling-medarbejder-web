import React, { Component } from 'react';
import { Grid, Skeleton, Typography } from '@mui/material';
import ApiContext from '../../../pages/_context';
import { IPersonService } from '../../../services/interfaces/IPersonService';
import { InvalidInputModel } from '@kvalitetsit/hjemmebehandling/Errorhandling/ServiceErrors/InvalidInputError';
import { IValidationService } from '../../../services/interfaces/IValidationService';
import { ICollectionHelper } from '@kvalitetsit/hjemmebehandling/Helpers/interfaces/ICollectionHelper';
import { PlanDefinition } from '@kvalitetsit/hjemmebehandling/Models/PlanDefinition';
import { Question, QuestionTypeEnum } from '@kvalitetsit/hjemmebehandling/Models/Question';
import { Questionnaire } from '@kvalitetsit/hjemmebehandling/Models/Questionnaire';
import { ThresholdCollection } from '@kvalitetsit/hjemmebehandling/Models/ThresholdCollection';
import ThresholdEditor from './ThresholdEditor';


export enum Color {
    green = '#61BD84',
    yellow = '#FFD78C',
    red = '#EE6969',
    grey = "grey"
}


export interface Props {
    planDefinition: PlanDefinition
    onError: (error?: Error) => void
    onSetThreshold: (newThresholds: ThresholdCollection, question: Question, questionnaire: Questionnaire) => void
}

export interface State {
    loading: boolean
    defaultNumberOfThresholds: number

}

export class PlanDefinitionEditThresholds extends Component<Props, State> {
    static contextType = ApiContext;
    static displayName = PlanDefinitionEditThresholds.name;
    personService!: IPersonService;
    validationService!: IValidationService;
    collectionHelper!: ICollectionHelper;

    constructor(props: Props) {
        super(props);
        this.state = {
            loading: false,
            defaultNumberOfThresholds: 3
        }
    }

    render(): JSX.Element {
        const contents = this.state.loading ? <Skeleton variant="rectangular" height={200} /> : this.renderCard();
        return contents;
    }

    componentDidMount(): void {
        this.setState({ loading: false })
    }

    errorArray: Map<number, InvalidInputModel[]> = new Map<number, InvalidInputModel[]>();


    renderCard(): JSX.Element {
        return (

            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Typography marginTop={2}>{this.props.planDefinition.questionnaires ? "De valgte spørgeskemaer indeholder nedenstående Alarmgrænser" : "Der er endnu ikke valgt nogle spørgeskemaer"} </Typography>
                </Grid>

                {this.props.planDefinition.questionnaires?.map(questionnaire => {
                    if (!questionnaire.thresholds)
                        questionnaire.thresholds = [];

                    return (
                        <>
                            {questionnaire.questions?.filter(x => x.type === QuestionTypeEnum.OBSERVATION).map(question => {

                                return (
                                    <Grid item xs={12}>
                                        <ThresholdEditor
                                            key={"tresholdEditor" + question.Id}
                                            onChange={this.props.onSetThreshold}
                                            questionnaire={questionnaire}
                                            question={question}
                                            onError={error => this.onError(error)}
                                        ></ThresholdEditor>
                                    </Grid>
                                )
                            })}
                        </>
                    )
                })}
            </Grid>
        )
    }
    onError(error?: Error): void {
        this.props.onError(error)
    }
}

