import React, { Component } from 'react';
import { Card, CardContent, CardHeader, Divider, Grid, Skeleton, Typography } from '@mui/material';
import ApiContext from '../../../pages/_context';
import { IPersonService } from '../../../services/interfaces/IPersonService';
import { InvalidInputModel } from '@kvalitetsit/hjemmebehandling/Errorhandling/ServiceErrors/InvalidInputError';
import { IValidationService } from '../../../services/interfaces/IValidationService';
import { ICollectionHelper } from '@kvalitetsit/hjemmebehandling/Helpers/interfaces/ICollectionHelper';
import { PlanDefinition } from '@kvalitetsit/hjemmebehandling/Models/PlanDefinition';
import { Question, QuestionTypeEnum } from '@kvalitetsit/hjemmebehandling/Models/Question';
import { CategoryEnum } from '@kvalitetsit/hjemmebehandling/Models/CategoryEnum';
import { ThresholdNumber } from '@kvalitetsit/hjemmebehandling/Models/ThresholdNumber';
import { Questionnaire } from '@kvalitetsit/hjemmebehandling/Models/Questionnaire';
import { ThresholdCollection } from '@kvalitetsit/hjemmebehandling/Models/ThresholdCollection';
import { ColorSlider } from '../../Input/ColorSlider';

export interface Props {
    planDefinition: PlanDefinition
}

export interface State {
    planDefinition: PlanDefinition
    loading: boolean
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
            planDefinition: props.planDefinition
        }

        this.modifyPlandefinition = this.modifyPlandefinition.bind(this);
        this.setThreshold = this.setThreshold.bind(this)
    }

    render(): JSX.Element {
        const contents = this.state.loading ? <Skeleton variant="rectangular" height={200} /> : this.renderCard();
        return contents;
    }

    componentDidMount(): void {
        this.setState({ loading: false })
    }

    InitializeServices(): void {
        this.personService = this.context.personService;
        this.validationService = this.context.validationService;
        this.collectionHelper = this.context.collectionHelper
    }

    modifyPlandefinition(plandefinitionModifier: (planDefinition: PlanDefinition, newValue: string) => PlanDefinition, input: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>): void {
        const valueFromInput = input.currentTarget.value;
        const modifiedPlanDefinition = plandefinitionModifier(this.state.planDefinition, valueFromInput);
        this.setState({ planDefinition: modifiedPlanDefinition })
    }

    errorArray: Map<number, InvalidInputModel[]> = new Map<number, InvalidInputModel[]>();

    renderCard(): JSX.Element {
        this.InitializeServices();
        return (

            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Typography>De valgte spørgeskemaer indeholder nedenstående Alarmgrænser</Typography>
                </Grid>
                <Grid item xs={12}>
                    {this.state.planDefinition.questionnaires?.map(questionnaire => {
                        if (!questionnaire.thresholds)
                            return;


                        return (
                            <>
                                {questionnaire.questions?.filter(x => x.type == QuestionTypeEnum.OBSERVATION).map(question => {

                                    return (
                                        <>
                                            <Card >
                                                <CardHeader subheader={<Typography variant="h6">{(question as Question).question}</Typography>} />
                                                <Divider />
                                                <CardContent >

                                                    <ColorSlider onChange={this.setThreshold} questionnaire={questionnaire} question={question}></ColorSlider>

                                                </CardContent>
                                            </Card>
                                        </>
                                    )
                                })}
                            </>
                        )


                    })}

                </Grid>
            </Grid>
        )
    }
    setThreshold(newThresholds: number[], question: Question, questionnaire: Questionnaire): void {

        const thresholdCollection = this.NumbersToThresholdCollection(question, newThresholds);
        const modified = this.state.planDefinition;
        const questionnaireIndex = modified.questionnaires!.findIndex(q => q.id == questionnaire.id);
        const thresholdIndex = modified.questionnaires![questionnaireIndex].thresholds!.findIndex(t => t.questionId == question.Id)
        modified.questionnaires![questionnaireIndex].thresholds![thresholdIndex] = thresholdCollection;
        this.setState({ planDefinition: modified })
    }

    NumbersToThresholdCollection(question: Question, numbers: number[]): ThresholdCollection {
        const thresholdCollection = new ThresholdCollection();
        thresholdCollection.questionId = question.Id!
        thresholdCollection.thresholdNumbers = [];
        const categoryByIndex = [CategoryEnum.GREEN, CategoryEnum.YELLOW, CategoryEnum.RED, CategoryEnum.YELLOW, CategoryEnum.GREEN]
        for (let i = 0; i < numbers.length - 1; i++) {
            const threshold = new ThresholdNumber();
            threshold.from = numbers[i]
            threshold.to = numbers[i + 1]
            threshold.category = categoryByIndex[i]
            thresholdCollection.thresholdNumbers.push(threshold);
        }
        return thresholdCollection;
    }

    setPlanDefinitionName(planDefinition: PlanDefinition, newValue: string): PlanDefinition {
        const modifiedPlanDefinition = planDefinition;
        modifiedPlanDefinition.name = newValue;
        return modifiedPlanDefinition;
    }


}


