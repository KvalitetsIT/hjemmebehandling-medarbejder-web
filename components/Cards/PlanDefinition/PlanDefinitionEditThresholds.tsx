import React, { Component } from 'react';
import { Card, CardContent, CardHeader, Divider, Grid, Skeleton, Typography } from '@mui/material';
import ApiContext from '../../../pages/_context';
import { IPersonService } from '../../../services/interfaces/IPersonService';
import { InvalidInputModel } from '@kvalitetsit/hjemmebehandling/Errorhandling/ServiceErrors/InvalidInputError';
import { IValidationService } from '../../../services/interfaces/IValidationService';
import { ICollectionHelper } from '@kvalitetsit/hjemmebehandling/Helpers/interfaces/ICollectionHelper';
import { PlanDefinition } from '@kvalitetsit/hjemmebehandling/Models/PlanDefinition';
import { Question, QuestionTypeEnum } from '@kvalitetsit/hjemmebehandling/Models/Question';
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
        console.log(this.props.planDefinition)
        return (

            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Typography>De valgte spørgeskemaer indeholder nedenstående Alarmgrænser</Typography>
                </Grid>
                <Grid item xs={12}>
                    {this.state.planDefinition.questionnaires?.map(questionnaire => {
                        if (!questionnaire.thresholds)
                            questionnaire.thresholds = [];


                        return (
                            <>
                                {questionnaire.questions?.filter(x => x.type == QuestionTypeEnum.OBSERVATION).map(question => {

                                    return (
                                        <>
                                            <Card >
                                                <CardHeader subheader={<Typography variant="h6">{(question as Question).question}</Typography>} />
                                                <Divider />
                                                <CardContent >

                                                    <ColorSlider onChange={this.setThreshold} questionnaire={questionnaire} question={question} defaultNumberOfThresholds={3}></ColorSlider>

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

    setThreshold(newThresholds: ThresholdCollection, question: Question, questionnaire: Questionnaire): void {
        const thresholdCollection = newThresholds
        const modified = this.state.planDefinition;
        const questionnaireIndex = modified.questionnaires!.findIndex(q => q.id == questionnaire.id);
        if (modified.questionnaires && questionnaireIndex != -1) {
            let thresholdIndex = modified.questionnaires![questionnaireIndex!].thresholds!.findIndex(t => t.questionId == question.Id)
            if (thresholdIndex == -1) {
                thresholdIndex = 0;
            }

            modified.questionnaires![questionnaireIndex].thresholds![thresholdIndex] = thresholdCollection;
        }
        this.setState({ planDefinition: modified })
    }

   

    setPlanDefinitionName(planDefinition: PlanDefinition, newValue: string): PlanDefinition {
        const modifiedPlanDefinition = planDefinition;
        modifiedPlanDefinition.name = newValue;
        return modifiedPlanDefinition;
    }


}


