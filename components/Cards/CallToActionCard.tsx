import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Component } from 'react';
import { CallToActionQuestion, Question } from '@kvalitetsit/hjemmebehandling/Models/Question';
import { Button, CardActions, CardHeader, Divider, Grid, IconButton, Stack, Typography } from '@mui/material';
import { TextFieldValidation } from '../Input/TextFieldValidation';
import { EnableWhenSelect } from '../Input/EnableWhenSelect';
import { EnableWhen } from '@kvalitetsit/hjemmebehandling/Models/EnableWhen';
import { QuestionSelector } from '../Input/QuestionSelector';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { InvalidInputModel } from '@kvalitetsit/hjemmebehandling/Errorhandling/ServiceErrors/InvalidInputError';

export interface Props {
    callToActionQuestion: CallToActionQuestion
    allQuestions: Question[] | undefined
    sectionName: string
    onValidation: (uniqueId: number, error: InvalidInputModel[]) => void
}

interface State {
    callToActionQuestion: CallToActionQuestion
}

export class CallToActionCard extends Component<Props, State> {
    static displayName = CallToActionCard.name;
    
    

    constructor(props: Props) {
        super(props)
        this.state = {
            callToActionQuestion: props.callToActionQuestion
        }
        this.modifyQuestion = this.modifyQuestion.bind(this);
    }

    modifyQuestion(questionModifier: (question: Question, newValue: string) => Question, input: string): void {
        const modifiedQuestion = questionModifier(this.props.callToActionQuestion, input);
        this.setState({ callToActionQuestion: modifiedQuestion })
    }


    async validateQuestionSelect(enableWhen: EnableWhen<boolean>): Promise<InvalidInputModel[]> {
        const errors: InvalidInputModel[] = []
        if(enableWhen.answer == undefined) errors.push( new InvalidInputModel("condition", "betingelse er ikke valgt"))
        return errors 
    }

    render(): JSX.Element {
        const callToActionQuestion = this.state.callToActionQuestion;
        return (
            <Card component={Box} minWidth={100}>
                <CardHeader subheader={<Typography variant="h6">Opfordring til patienthandling</Typography>} />
                <Divider />
                <CardContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Typography>Et eller flere af sp??rgsm??lene kan resultere i en opfordring til patienthandling. En opfordring til patienthandling er en besked til patienten der bliver vist efter sp??rgeskemaet er indsendt</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <TextFieldValidation
                                label="Besked til bruger"
                                value={callToActionQuestion?.message}
                                variant="outlined"
                                size="medium"
                                uniqueId={1}
                                minWidth={800}
                                onChange={input => this.modifyQuestion(this.setMessage, input.currentTarget.value)}
                                sectionName={this.props.sectionName}
                                onValidation={this.props.onValidation}
                            />
                        </Grid>

                        {callToActionQuestion?.enableWhens?.map((enableWhen, index) => {
                            const questionsToShowInSelector = this.props.allQuestions;
                            return (
                                <>
                                    <Grid item xs={12} alignItems="baseline">
                                        <Stack spacing={2} direction="row">
                                            <QuestionSelector 
                                                key={index + "_questionselect_" + enableWhen.questionId} 
                                                enableWhen={enableWhen} updateParent={() => this.forceUpdate()} 
                                                allQuestions={questionsToShowInSelector} 
                                                onValidation={this.props.onValidation}
                                                validate={this.validateQuestionSelect}
                                                sectionName={this.props.sectionName}
                                                uniqueId={2}
                                            />
                                            {enableWhen.questionId ?
                                                <EnableWhenSelect key={index + "_whenselect_" + enableWhen.questionId} enableWhen={enableWhen} parentQuestion={this.getQuestionById(enableWhen.questionId)} />
                                                :
                                                <></>
                                            }
                                            <IconButton onClick={() => this.removeEnableWhen(index)}>
                                                <DeleteOutlineIcon />
                                            </IconButton>
                                        </Stack>

                                    </Grid>
                                </>
                            )
                        })}

                    </Grid>

                </CardContent>
                <Divider />
                <CardActions sx={{ display: "flex", justifyContent: "left", padding: 2 }}>
                    <Button variant="text" onClick={() => this.addEnableWhen()}><AddCircleIcon />Tilf??j betingelse</Button>
                </CardActions>
            </Card>
        );
    }

    addEnableWhen(): void {
        const newEnableWhen = new EnableWhen<boolean>();
        const modifiedQuestion = this.state.callToActionQuestion
        modifiedQuestion.enableWhens?.push(newEnableWhen);
        this.setState({ callToActionQuestion: modifiedQuestion })
    }

    removeEnableWhen(indexToRemove: number): void {
        const modifiedQuestion = this.state.callToActionQuestion
        modifiedQuestion.enableWhens?.splice(indexToRemove, 1)
        this.setState({ callToActionQuestion: modifiedQuestion })
    }

    getQuestionById(questionId: string): Question | undefined {
        const questionFound = this.props.allQuestions?.find(q => q.Id == questionId);
        return questionFound;
    }

    setMessage(oldQuestion: CallToActionQuestion, newValue: string): Question {
        const modifiedQuestion = oldQuestion;
        modifiedQuestion.message = newValue;
        return modifiedQuestion;
    }
}
