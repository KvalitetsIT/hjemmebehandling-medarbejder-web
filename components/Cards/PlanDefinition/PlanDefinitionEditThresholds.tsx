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
import { ColorSlider } from '../../Input/ColorSlider';

export interface Props {
    planDefinition: PlanDefinition
}

export interface State {
    planDefinition: PlanDefinition
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
            planDefinition: props.planDefinition,
            defaultNumberOfThresholds: 3
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

                {this.state.planDefinition.questionnaires?.map(questionnaire => {
                    if (!questionnaire.thresholds)
                        questionnaire.thresholds = [];

                    return (
                        <>
                            {questionnaire.questions?.filter(x => x.type == QuestionTypeEnum.OBSERVATION).map(question => {

                                return (
                                        <Grid item xs={12}>
                                            <ColorSlider key={"colorslider" + question.Id} onChange={this.setThreshold} questionnaire={questionnaire} question={question}></ColorSlider>
                                        </Grid>
                                )
                            })}
                        </>
                    )
                })}
            </Grid>
        )
    }

    setThreshold(newThresholds: ThresholdCollection, question: Question, questionnaire: Questionnaire): void {
        const thresholdCollection = newThresholds
        const modified = this.state.planDefinition;
        console.log("---------------")
        console.log(question.question)
        console.log(modified)
        const questionnaireIndex = modified.questionnaires!.findIndex(q => q.id == questionnaire.id);
        if (modified.questionnaires && questionnaireIndex != -1) {
            const thresholdIndex = modified.questionnaires![questionnaireIndex!].thresholds!.findIndex(t => t.questionId == question.Id)
            if (thresholdIndex == -1) {
                modified.questionnaires![questionnaireIndex].thresholds?.push(thresholdCollection);
            } else {
                modified.questionnaires![questionnaireIndex].thresholds![thresholdIndex] = thresholdCollection;
            }


        }
        console.log(modified)
        console.log("---------------")
        this.setState({ planDefinition: modified })
    }



    setPlanDefinitionName(planDefinition: PlanDefinition, newValue: string): PlanDefinition {
        const modifiedPlanDefinition = planDefinition;
        modifiedPlanDefinition.name = newValue;
        return modifiedPlanDefinition;
    }


}


