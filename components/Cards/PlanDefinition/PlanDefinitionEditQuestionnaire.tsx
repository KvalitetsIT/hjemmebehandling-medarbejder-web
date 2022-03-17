import React, { Component } from 'react';
import { Button, Card, CardHeader, Checkbox, Divider, Grid, List, ListItem, ListItemIcon, ListItemText, Skeleton } from '@mui/material';
import ApiContext from '../../../pages/_context';
import { IPersonService } from '../../../services/interfaces/IPersonService';
import { InvalidInputModel } from '@kvalitetsit/hjemmebehandling/Errorhandling/ServiceErrors/InvalidInputError';
import { IValidationService } from '../../../services/interfaces/IValidationService';
import { IQuestionnaireService } from '../../../services/interfaces/IQuestionnaireService';
import { ICollectionHelper } from '@kvalitetsit/hjemmebehandling/Helpers/interfaces/ICollectionHelper';
import { PlanDefinition } from '@kvalitetsit/hjemmebehandling/Models/PlanDefinition';
import { Questionnaire } from '@kvalitetsit/hjemmebehandling/Models/Questionnaire';
import { Box } from '@mui/system';
import { BaseModelStatus } from '@kvalitetsit/hjemmebehandling/Models/BaseModelStatus';

export interface Props {
    planDefinition: PlanDefinition
}

export interface State {
    planDefinition: PlanDefinition
    allQuestionnaires: Questionnaire[]
    checked: Questionnaire[]
    loading: boolean
}

export class PlanDefinitionEditQuestionnaire extends Component<Props, State> {
    static contextType = ApiContext;
    static displayName = PlanDefinitionEditQuestionnaire.name;
    personService!: IPersonService;
    validationService!: IValidationService;
    collectionHelper!: ICollectionHelper;
    questionnaireService!: IQuestionnaireService;

    constructor(props: Props) {
        super(props);
        this.state = {
            loading: false,
            planDefinition: props.planDefinition,
            checked: [],
            allQuestionnaires: []
        }

        this.modifyPlandefinition = this.modifyPlandefinition.bind(this);
    }

    render(): JSX.Element {
        const contents = this.state.loading ? <Skeleton variant="rectangular" height={200} /> : this.renderCard();
        return contents;
    }

    async componentDidMount(): Promise<void> {
        try {
            const planDefinitions = await this.questionnaireService.GetAllQuestionnaires()
            this.setState({ allQuestionnaires: planDefinitions })
        } catch (error) {
            this.setState(() => { throw error })
        }
        this.setState({ loading: false })
    }

    InitializeServices(): void {
        this.personService = this.context.personService;
        this.validationService = this.context.validationService;
        this.collectionHelper = this.context.collectionHelper
        this.questionnaireService = this.context.questionnaireService
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

            <Grid container textAlign="center" alignItems="center" spacing={2}>
                <Grid item xs={4}>

                    {this.renderList("Valgte", this.state.planDefinition.questionnaires!)}


                </Grid>
                <Grid item xs={1}>
                    <Button onClick={() => this.addToPlanDefinition()} variant='contained'>{"<"}</Button>
                    <br />
                    <br />
                    <Button onClick={() => this.removeFromPlanDefinition()} variant='contained'>{">"}</Button>
                </Grid>
                <Grid item xs={4}>

                    {this.renderList("Tilgængelige", this.getQuestinnairesNotInPlandefinition())}

                </Grid>
            </Grid>
        )
    }

    toggleChecked(questionnaire: Questionnaire): void {
        const allChecked = this.state.checked;


        const { newCheckedList, wasFound } = this.removeFromList([questionnaire.id], allChecked);

        if (!wasFound)
            newCheckedList.push(questionnaire)

        this.setState({ checked: newCheckedList })
    }

    removeFromList(questionnaireId: string[], listToRemoveFrom: Questionnaire[]): { newCheckedList: Questionnaire[], wasFound: boolean } {
        const newCheckedList = [];
        let wasFound = false;
        for (let i = 0; i < listToRemoveFrom.length; i++) {
            const candidate = listToRemoveFrom[i]

            if (questionnaireId.some(c => c == candidate.id)) {
                wasFound = true
                continue
            }
            newCheckedList.push(candidate);
        }

        return {
            newCheckedList: newCheckedList,
            wasFound: wasFound
        }
    }

    addToPlanDefinition(): void {
        const toAdd = this.state.checked;
        const planDefinition = this.state.planDefinition
        const intersection = this.intersect(toAdd, planDefinition.questionnaires!);
        planDefinition.questionnaires?.push(...intersection);
        this.setState({ planDefinition: planDefinition, checked: [] })
    }

    removeFromPlanDefinition(): void {
        const planDefinition = this.state.planDefinition
        const { newCheckedList } = this.removeFromList(this.state.checked.map(c => c.id), planDefinition.questionnaires!);
        planDefinition.questionnaires = newCheckedList;
        this.setState({ planDefinition: planDefinition, checked: [] })
    }

    renderList(title: string, questionnaires: (Questionnaire | undefined)[]): JSX.Element {
        return (
            <Card elevation={2}>
                <CardHeader subheader={title} />
                <Divider />
                <Box sx={{ height: 230, overflow: 'auto' }}>
                    <List role="list" dense component="div" >
                        {questionnaires.filter(questionnaire => {
                            if (questionnaire?.status != BaseModelStatus.DRAFT) {
                                return questionnaire
                            }
                        }).map(questionnaire => {
                            const isChecked = this.isChecked(questionnaire!);
                            return (
                                <ListItem role="listitem" button onClick={() => this.toggleChecked(questionnaire!)}>
                                    <ListItemIcon>
                                        <Checkbox
                                            checked={isChecked}
                                            tabIndex={-1}
                                            disableRipple
                                        />
                                    </ListItemIcon>
                                    <ListItemText primary={questionnaire?.name} />
                                </ListItem>
                            )
                        })}

                    </List>
                </Box>
            </Card >
        )
    }

    getQuestinnairesNotInPlandefinition(): Questionnaire[] {
        const currentQuestionnaires = this.state.planDefinition.questionnaires ?? [];
        const otherQuestionnaires = this.state.allQuestionnaires ?? [];
        return this.intersect(otherQuestionnaires, currentQuestionnaires)
    }

    intersect(a: Questionnaire[], b: Questionnaire[]): Questionnaire[] {
        const toReturn = a.filter((value) => b?.findIndex(y => y.id == value?.id) == -1)
        return toReturn;
    }
    isChecked(questionnaire: Questionnaire): boolean {
        return this.state.checked.find(c => c.id == questionnaire.id) != undefined
    }

    setPlanDefinitionName(planDefinition: PlanDefinition, newValue: string): PlanDefinition {
        const modifiedPlanDefinition = planDefinition;
        modifiedPlanDefinition.name = newValue;
        return modifiedPlanDefinition;
    }



}
