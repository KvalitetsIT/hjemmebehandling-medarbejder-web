import React, { Component } from 'react';
import { Button, Card, CardHeader, Checkbox, Divider, Grid, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import ApiContext from '../../../pages/_context';
import { IQuestionnaireService } from '../../../services/interfaces/IQuestionnaireService';
import { PlanDefinition } from '@kvalitetsit/hjemmebehandling/Models/PlanDefinition';
import { Questionnaire } from '@kvalitetsit/hjemmebehandling/Models/Questionnaire';
import { Box } from '@mui/system';
import { BaseModelStatus } from '@kvalitetsit/hjemmebehandling/Models/BaseModelStatus';

export interface Props {
    planDefinition: PlanDefinition
    onChange: () => void
    onAdd: (questionnaires: Questionnaire[]) => void
    onRemove: (questionnaires: Questionnaire[]) => void
}

export interface State {
    checked: Questionnaire[]
    chosen: Questionnaire[]
    accessible: Questionnaire[]
    loading: boolean
}

export class PlanDefinitionEditQuestionnaire extends Component<Props, State> {
    static contextType = ApiContext;
    static displayName = PlanDefinitionEditQuestionnaire.name;
    questionnaireService!: IQuestionnaireService;

    constructor(props: Props) {
        super(props);
        this.state = {
            loading: false,
            checked: [],
            chosen: props.planDefinition.questionnaires ? props.planDefinition.questionnaires: [],
            accessible: []
        }
    }

    async componentDidMount(): Promise<void> {
        this.setState({ loading: true });
        try {
            const planDefinitions = await this.questionnaireService.GetAllQuestionnaires([BaseModelStatus.ACTIVE])
            this.setState({ accessible: planDefinitions })
        } catch (error) {
            this.setState(() => { throw error })
        }
        this.setState({ loading: false })
    }

    InitializeServices(): void {
        this.questionnaireService = this.context.questionnaireService
    }

    render(): JSX.Element {
        this.InitializeServices();
        return (

            <Grid container textAlign="center" alignItems="center" spacing={2}>
                <Grid item xs={5}>
                    {this.renderList("Valgte", this.props.planDefinition.questionnaires!)}
                </Grid>
                <Grid item xs={2}>
                    <Button onClick={() => {this.props.onAdd(this.state.checked); this.props.onChange();this.setState({ checked: []})}} variant='contained'>{"<"}</Button>
                    <br />
                    <br />
                    <Button onClick={() => {this.props.onRemove(this.state.checked); this.props.onChange();this.setState({ checked: []});}} variant='contained'>{">"}</Button>
                </Grid>
                <Grid item xs={5}>

                    {this.renderList("Tilgængelige", this.getQuestinnairesNotInPlandefinition())}

                </Grid>
            </Grid>
        )
    }

    toggleChecked(questionnaire: Questionnaire): void {
        const arr = this.state.checked.includes(questionnaire) ? 
            this.state.checked.filter(i => i !== questionnaire) // remove item
            : [ ...this.state.checked, questionnaire ]; // add item
    
        this.setState({ checked: arr });
    }

    renderList(title: string, questionnaires: (Questionnaire | undefined)[]): JSX.Element {
        return (
            <Card elevation={2}>
                <CardHeader subheader={title} />
                <Divider />
                <Box sx={{ height: 230, overflow: 'auto' }}>
                    <List role="list" dense component="div" >
                        {questionnaires.map(questionnaire => {
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
        const currentQuestionnaires = this.props.planDefinition.questionnaires ?? [];
        const otherQuestionnaires = this.state.accessible ?? [];
        return this.intersect(otherQuestionnaires, currentQuestionnaires)
    }

    intersect(a: Questionnaire[], b: Questionnaire[]): Questionnaire[] {
        const toReturn = a.filter((value) => b?.findIndex(y => y.id == value?.id) == -1)
        return toReturn;
    }
    
    isChecked(questionnaire: Questionnaire): boolean {
        return this.state.checked.find(c => c.id == questionnaire.id) != undefined
    }
}
