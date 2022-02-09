import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Component } from 'react';
import { CallToActionQuestion, Question } from '@kvalitetsit/hjemmebehandling/Models/Question';
import { Button, CardHeader, Divider, Grid, Typography } from '@mui/material';
import { TextFieldValidation } from '../Input/TextFieldValidation';
import { EnableWhenSelect } from '../Input/EnableWhenSelect';
import { EnableWhen } from '@kvalitetsit/hjemmebehandling/Models/EnableWhen';
import { QuestionSelector } from '../Input/QuestionSelector';

export interface Props {
    callToActionQuestion: CallToActionQuestion
    allQuestions: Question[] | undefined
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

    render(): JSX.Element {
        const callToActionQuestion = this.props.callToActionQuestion;
        return (
            <Card component={Box} minWidth={100}>
                <CardHeader subheader={<Typography variant="h6">Call-to-action</Typography>} />
                <Divider />
                <CardContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Typography>Et eller flere af spørgsmålene kan resultere i en call-to-action. En call-to-action er en besked til patienten der bliver vist efter spørgeskemaet er indsendt</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <TextFieldValidation
                                label="Besked til bruger"
                                value={callToActionQuestion.message}
                                variant="outlined"
                                size="medium"
                                uniqueId={1}
                                minWidth={800}
                                onChange={input => this.modifyQuestion(this.setMessage, input.currentTarget.value)}
                            />
                        </Grid>

                        {this.state.callToActionQuestion.enableWhens?.map((enableWhen) => {
                            return (
                                <>
                                    <Grid item xs={12}>
                                        <QuestionSelector enableWhen={enableWhen} updateParent={() => this.forceUpdate()} allQuestions={this.props.allQuestions} />
                                        {enableWhen.questionId ?
                                            <EnableWhenSelect enableWhen={enableWhen} parentQuestion={this.getQuestionById(enableWhen.questionId)} />
                                            :
                                            <></>
                                        }
                                    </Grid>
                                </>
                            )
                        })}

                    </Grid>

                </CardContent>
                <Button onClick={() => this.addEnableWhen()}>Tilføj</Button>
            </Card>
        );
    }

    addEnableWhen() : void {
        const newEnableWhen = new EnableWhen<boolean>();
        const modifiedQuestion = this.state.callToActionQuestion
        modifiedQuestion.enableWhens?.push(newEnableWhen);
        console.log("modifiedQuestion.enableWhens")
        console.log(modifiedQuestion.enableWhens)
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
