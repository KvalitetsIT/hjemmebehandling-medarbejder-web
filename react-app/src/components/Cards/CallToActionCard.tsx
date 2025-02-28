import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Component } from 'react';
import { CallToActionQuestion, Question } from '../Models/Question';
import { Tooltip, Button, CardActions, CardHeader, Divider, Grid, IconButton, Stack, Typography } from '@mui/material';
import { TextFieldValidation } from '../Input/TextFieldValidation';
import { EnableWhenSelect } from '../Input/EnableWhenSelect';
import { EnableWhen } from '../Models/EnableWhen';
import { QuestionSelector } from '../Input/QuestionSelector';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { InvalidInputModel } from '../Errorhandling/ServiceErrors/InvalidInputError';

export interface Props {
    callToActionQuestion: CallToActionQuestion
    allQuestions: Question[] | undefined
    sectionName: string
    onValidation: (uniqueId: string, error: InvalidInputModel[]) => void
}

class EnableWhenExtended<T> extends EnableWhen<T> {
    original?: boolean
}

interface State {
    callToActionQuestion: CallToActionQuestion
    existingEnableWhens?: EnableWhenExtended<boolean>[]
}

export class CallToActionCard extends Component<Props, State> {
    static displayName = CallToActionCard.name;
    
    

    constructor(props: Props) {
        super(props)
        this.state = {
            callToActionQuestion: props.callToActionQuestion,
            existingEnableWhens: props.callToActionQuestion.enableWhens?.map(ew => {
                let ext: EnableWhenExtended<boolean> = ew as EnableWhenExtended<boolean>;
                ext.original = true;
                return ext;
            })
        }
        this.modifyQuestion = this.modifyQuestion.bind(this);
        this.validateMessage = this.validateMessage.bind(this);
    }

    modifyQuestion(questionModifier: (question: Question, newValue: string) => Question, input: string): void {
        const modifiedQuestion = questionModifier(this.props.callToActionQuestion, input);
        this.setState({ callToActionQuestion: modifiedQuestion })
    }

    async validateMessage(message: string): Promise<InvalidInputModel[]> {
        const errors: InvalidInputModel[] = [];
        const emptyMessage = message.trim() === "";
        const ewsLength = this.state.callToActionQuestion.enableWhens?.length === 0;

        if(!emptyMessage && ewsLength) {
            errors.push( new InvalidInputModel("message", "Spørgsmål er ikke valgt"));
        }
        if (emptyMessage && !ewsLength) {
            errors.push( new InvalidInputModel("message", "Besked er ikke angivet"));
        }

        return errors;
    }
    
    async validateQuestionSelect(enableWhen: EnableWhen<boolean>): Promise<InvalidInputModel[]> {
        const errors: InvalidInputModel[] = []
        if(enableWhen.answer === undefined) errors.push( new InvalidInputModel("condition", "Spørgsmål er ikke valgt"))
        return errors 
    }

    render(): JSX.Element {
        const callToActionQuestion = this.state.callToActionQuestion;
        return (
            <Card component={Box} minWidth={100}>
                <CardHeader className="callToAction-cardHeader" subheader={<Typography variant="h6" className="callToActionTab">Opfordring til patienthandling</Typography>} />
                <Divider />
                <CardContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Typography>Et eller flere af spørgsmålene kan resultere i en opfordring til patienthandling. En opfordring til patienthandling er en besked til patienten der bliver vist efter spørgeskemaet er indsendt</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <TextFieldValidation
                                multiline
                                rows={3}
                                label="Besked til bruger"
                                value={callToActionQuestion?.message}
                                variant="outlined"
                                size="medium"
                                uniqueId={this.state.callToActionQuestion.Id!}
                                minWidth={800}
                                onChange={input => this.modifyQuestion(this.setMessage, input.currentTarget.value)}
                                sectionName={this.props.sectionName}
                                onValidation={this.props.onValidation}
                                validate={this.validateMessage}
                            />
                        </Grid>

                        {callToActionQuestion?.enableWhens?.map((enableWhen, index) => {
                            //const idx = this.state.existingEnableWhens?.findIndex(ew => ew.questionId === enableWhen.questionId);
                            const ew = this.state.existingEnableWhens && this.state.existingEnableWhens[index];

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
                                                uniqueId={this.state.callToActionQuestion.Id! + index}
                                                disabled={ew?.original}
                                            />
                                            {enableWhen.questionId ?
                                                <EnableWhenSelect key={index + "_whenselect_" + enableWhen.questionId} enableWhen={enableWhen} disabled={ew?.original} parentQuestion={this.getQuestionById(enableWhen.questionId)} />
                                                :
                                                <></>
                                            }
                                            <Tooltip title='Slet' placement='right'>
                                                <IconButton onClick={() => this.removeEnableWhen(index)}>
                                                    <DeleteOutlineIcon />
                                                </IconButton>
                                            </Tooltip>
                                        </Stack>

                                    </Grid>
                                </>
                            )
                        })}

                    </Grid>

                </CardContent>
                <Divider />
                <CardActions sx={{ display: "flex", justifyContent: "right", padding: 2 }}>
                    <Button variant="text" onClick={() => this.addEnableWhen()}><AddCircleIcon />Tilføj patienthandling</Button>
                </CardActions>
            </Card>
        );
    }

    addEnableWhen(): void {
        const newEnableWhen = new EnableWhen<boolean>();
        const modifiedQuestion = this.state.callToActionQuestion
        modifiedQuestion.enableWhens?.push(newEnableWhen);

        let localEnable: EnableWhenExtended<boolean> = newEnableWhen as EnableWhenExtended<boolean>;
        localEnable.original = false;
        
        let localState = this.state.existingEnableWhens;
        localState?.push(localEnable);
        this.setState({ callToActionQuestion: modifiedQuestion, existingEnableWhens: localState })
    }

    removeEnableWhen(indexToRemove: number): void {
        const modifiedQuestion = this.state.callToActionQuestion
        modifiedQuestion.enableWhens?.splice(indexToRemove, 1)

        let localState = this.state.existingEnableWhens;
        localState?.splice(indexToRemove, 1)
        this.setState({ callToActionQuestion: modifiedQuestion, existingEnableWhens: localState })
    }

    getQuestionById(questionId: string): Question | undefined {
        const questionFound = this.props.allQuestions?.find(q => q.Id === questionId);
        return questionFound;
    }

    setMessage(oldQuestion: CallToActionQuestion, newValue: string): Question {
        const modifiedQuestion = oldQuestion;
        modifiedQuestion.message = newValue;
        return modifiedQuestion;
    }
}
