import { Question, QuestionTypeEnum } from "@kvalitetsit/hjemmebehandling/Models/Question";
import { Box, Button, Card, CardActions, CardContent, CardHeader, Divider, Grid, Stack } from "@mui/material";
import { Component, ReactNode } from "react";
import { EnableWhenSelect } from "../Input/EnableWhenSelect";
import { QuestionTypeSelect } from "../Input/QuestionTypeSelect";
import { TextFieldValidation } from "../Input/TextFieldValidation";
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

interface Props {
    parentQuestion?: Question
    question: Question
    addSubQuestionAction?: (parentQuestion: Question) => void
    moveItemUp: (question: Question) => void
    moveItemDown: (question: Question) => void
}
interface State {
    question: Question
}

export class QuestionEditCard extends Component<Props, State>{
    static defaultProps = {
    }
    constructor(props: Props) {
        super(props);
        this.state = {
            question: props.question
        }
        this.modifyQuestion = this.modifyQuestion.bind(this);
    }

    modifyQuestion(questionModifier: (question: Question, newValue: string) => Question, input: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>): void {
        const valueFromInput = input.currentTarget.value;
        const modifiedQuestion = questionModifier(this.props.question, valueFromInput);
        this.setState({ question: modifiedQuestion })
    }

    render(): ReactNode {
        return (
            <Card>
                <CardHeader subheader={
                    <>
                        <Grid container>

                            {this.props.parentQuestion ?
                                <Grid item xs={2}>
                                    <Box>
                                        <EnableWhenSelect subQuestion={this.state.question} parentQuestion={this.props.parentQuestion} />
                                    </Box>
                                </Grid>
                                : <></>
                            }
                            <Grid item xs>


                                <TextFieldValidation
                                    label="Spørgsmål"
                                    value={this.props.question.question}
                                    variant="standard"
                                    minWidth={500}
                                    uniqueId={1}
                                    onChange={input => this.modifyQuestion(this.setQuestion, input)}
                                />
                            </Grid>
                            <Grid item xs>
                                <TextFieldValidation
                                    label="Forkortelse"
                                    value={this.props.question.abbreviation}
                                    variant="standard"
                                    uniqueId={1}
                                    onChange={input => this.modifyQuestion(this.setAbbreviation, input)}
                                />
                            </Grid>
                            <Grid item xs={1}>

                                <Stack>
                                    <Button onClick={() => this.props.moveItemUp(this.props.question)}><KeyboardArrowUpIcon/></Button>
                                    <Button onClick={() => this.props.moveItemDown(this.props.question)}><KeyboardArrowDownIcon/></Button>
                                </Stack>
                            </Grid>
                        </Grid>
                    </>
                } />
                <Divider />
                <CardContent>
                    <Stack direction="row" spacing={2}>
                        <TextFieldValidation
                            label="Hjælpetekst"
                            value={this.props.question.helperText}
                            variant="standard"
                            uniqueId={1}
                            minWidth={800}
                            onChange={input => this.modifyQuestion(this.setHelperText, input)}
                        />
                        <QuestionTypeSelect question={this.state.question} />
                    </Stack>
                </CardContent>
                <CardActions>
                    {this.props.addSubQuestionAction ? <Button disabled={this.props.question.type != QuestionTypeEnum.BOOLEAN} onClick={() => this.props.addSubQuestionAction!(this.props.question)}>Tilføj underspørgsmål</Button> : <></>}
                </CardActions>
            </Card>
        )
    }

    setQuestion(oldQuestion: Question, newValue: string): Question {
        const modifiedQuestion = oldQuestion;
        modifiedQuestion.question = newValue;
        return modifiedQuestion;
    }
    setHelperText(oldQuestion: Question, newValue: string): Question {
        const modifiedQuestion = oldQuestion;
        modifiedQuestion.helperText = newValue;
        return modifiedQuestion;
    }
    setEnableWhenAnswer(oldQuestion: Question, newValue: string): Question {
        const modifiedQuestion = oldQuestion;
        modifiedQuestion!.enableWhen!.answer = newValue.toLowerCase() == 'ja';
        return modifiedQuestion;
    }
    modifyQuestionType(oldQuestion: Question, newValue: string): Question {
        const modifiedQuestion = oldQuestion;
        modifiedQuestion!.type = newValue as QuestionTypeEnum;
        return modifiedQuestion;
    }
    setAbbreviation(oldQuestion: Question, newValue: string): Question {
        const modifiedQuestion = oldQuestion;
        modifiedQuestion!.abbreviation = newValue as QuestionTypeEnum;
        return modifiedQuestion;
    }
}