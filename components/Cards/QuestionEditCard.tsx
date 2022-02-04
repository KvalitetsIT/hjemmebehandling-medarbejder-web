import { Question, QuestionTypeEnum } from "@kvalitetsit/hjemmebehandling/Models/Question";
import { Box, Button, Card, CardActions, CardContent, CardHeader, Divider, Grid, Stack } from "@mui/material";
import { Component, Key, ReactNode } from "react";
import { EnableWhenSelect } from "../Input/EnableWhenSelect";
import { QuestionTypeSelect } from "../Input/QuestionTypeSelect";
import { TextFieldValidation } from "../Input/TextFieldValidation";
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

interface Props {
    key : Key | null | undefined
    parentQuestion?: Question
    question: Question
    addSubQuestionAction?: (parentQuestion: Question) => void
    moveItemUp: (question: Question) => void
    moveItemDown: (question: Question) => void
    forceUpdate?: () => void
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
            question: props.question,
        }
        this.modifyQuestion = this.modifyQuestion.bind(this);
        this.forceCardUpdate = this.forceCardUpdate.bind(this);
    }

    modifyQuestion(questionModifier: (question: Question, newValue: string) => Question, input: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>): void {
        const valueFromInput = input.currentTarget.value;
        const modifiedQuestion = questionModifier(this.props.question, valueFromInput);
        this.forceCardUpdate();
        this.setState({ question: modifiedQuestion })
    }

    forceCardUpdate(): void {
        if (this.props.forceUpdate)
            this.props.forceUpdate();

        this.forceUpdate();
    }

    render(): ReactNode {
        return (
            <Card>
                <Grid key={this.props.key} container>
                    <Grid className="nonFocusedQuestionEditCard" item xs={1} >
                        <Button onClick={() => this.props.moveItemUp(this.props.question)}><KeyboardArrowUpIcon fontSize="large" /></Button>
                        <Button onClick={() => this.props.moveItemDown(this.props.question)}><KeyboardArrowDownIcon fontSize="large" /></Button>
                    </Grid>
                    <Grid item xs={11}>
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
                                    <Grid item xs="auto">
                                        <TextFieldValidation
                                            label="Spørgsmål"
                                            value={this.props.question.question}
                                            variant="standard"
                                            minWidth={500}
                                            uniqueId={1}
                                            onChange={input => this.modifyQuestion(this.setQuestion, input)}
                                        />
                                    </Grid>
                                    <Grid item xs="auto">
                                        <TextFieldValidation
                                            label="Forkortelse"
                                            value={this.props.question.abbreviation}
                                            variant="standard"
                                            uniqueId={1}
                                            onChange={input => this.modifyQuestion(this.setAbbreviation, input)}
                                        />
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
                                <QuestionTypeSelect forceUpdate={this.forceCardUpdate} question={this.state.question} />
                            </Stack>
                        </CardContent>
                        <CardActions>
                            {this.props.addSubQuestionAction ? <Button disabled={this.props.question.type != QuestionTypeEnum.BOOLEAN} onClick={() => this.props.addSubQuestionAction!(this.props.question)}>Tilføj underspørgsmål</Button> : <></>}
                        </CardActions>
                    </Grid>
                </Grid>
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