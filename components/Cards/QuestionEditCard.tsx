import { Question, QuestionTypeEnum } from "@kvalitetsit/hjemmebehandling/Models/Question";
import { Alert, Box, Button, ButtonGroup, Card, CardActions, CardContent, CardHeader, Divider, Grid, GridSize, IconButton, Stack, Table, TableCell, TableContainer, TableRow } from "@mui/material";
import { Component, Key, ReactNode } from "react";
import { EnableWhenSelect } from "../Input/EnableWhenSelect";
import { QuestionTypeSelect } from "../Input/QuestionTypeSelect";
import { TextFieldValidation } from "../Input/TextFieldValidation";
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { CategorySelect } from "../Input/CategorySelect";
import { ThresholdCollection } from "@kvalitetsit/hjemmebehandling/Models/ThresholdCollection";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { QuestionMeasurementTypeSelect } from "../Input/QuestionMeasurementTypeSelect";

interface Props {
    key: Key | null | undefined
    parentQuestion?: Question
    question: Question
    getThreshold?: (question: Question) => ThresholdCollection
    addSubQuestionAction?: (referenceQuestion: Question | undefined, isParent: boolean) => void
    removeQuestionAction: (questionToRemove: Question) => void
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
            question: props.question
        }
        this.modifyQuestion = this.modifyQuestion.bind(this);
        this.forceCardUpdate = this.forceCardUpdate.bind(this);
    }

    modifyQuestion(questionModifier: (question: Question, newValue: string) => Question, input: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>): void {
        const valueFromInput = input.currentTarget.value;
        const modifiedQuestion = questionModifier(this.props.question, valueFromInput);
        this.setState({ question: modifiedQuestion })

    }

    forceCardUpdate(): void {
        if (this.props.forceUpdate)
            this.props.forceUpdate();

        this.forceUpdate();
    }

    render(): ReactNode {
        const parrentQuestion = this.props.parentQuestion;
        const parentQuestionHasGoodType = parrentQuestion == undefined || parrentQuestion?.type == QuestionTypeEnum.BOOLEAN
        const shouldShowThresholds = this.state.question.type == QuestionTypeEnum.BOOLEAN
        const className = this.props.parentQuestion != undefined ? "focusedChildQuestionEditCard" : "focusedParentQuestionEditCard"
        return (
            <Card>
                <Grid key={this.props.key} container columns={48}>
                    <Grid sx={{ display: "flex", justifyContent: "space-between", flexDirection: "column" }} paddingTop={2} paddingBottom={2} className={className} item xs={1} >
                        <Button sx={{ minWidth: 0 }} onClick={() => this.props.moveItemUp(this.props.question)}><KeyboardArrowUpIcon fontSize="large" /></Button>
                        <Button sx={{ minWidth: 0 }} onClick={() => this.props.moveItemDown(this.props.question)}><KeyboardArrowDownIcon fontSize="large" /></Button>
                    </Grid>
                    <Grid item xs={47 as GridSize}>
                        <CardHeader subheader={
                            <>
                                <Grid container columns={12}>

                                    {this.props.parentQuestion ?
                                        <Grid item xs={12}>
                                            <Box>
                                                <EnableWhenSelect enableWhen={this.state.question.enableWhen!} parentQuestion={this.props.parentQuestion} />
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
                        {parentQuestionHasGoodType ? <></> :
                            <Alert color="warning">
                                Overspørgsmålets spørgsmålstype understøtter ikke underspørgsmål - Dette spørgsmål vil blive slettet
                            </Alert>
                        }

                        <Divider />
                        <CardContent>

                            <Grid container spacing={2}>
                                <Grid item xs>
                                    <TextFieldValidation
                                        label="Hjælpetekst"
                                        value={this.props.question.helperText}
                                        variant="outlined"
                                        size="medium"
                                        uniqueId={1}
                                        minWidth={800}
                                        onChange={input => this.modifyQuestion(this.setHelperText, input)}
                                    />
                                </Grid>
                                <Grid item xs>
                                    <QuestionTypeSelect forceUpdate={this.forceCardUpdate} question={this.state.question} />
                                </Grid>
                                {this.state.question.type == QuestionTypeEnum.OBSERVATION ?
                                    <Grid item xs>
                                        <QuestionMeasurementTypeSelect forceUpdate={this.forceCardUpdate} question={this.state.question} />
                                    </Grid>
                                    : <></>}

                            </Grid>




                            {shouldShowThresholds ? this.renderBooleanThreshold() : <></>}

                        </CardContent>

                        <CardActions disableSpacing>
                            <Button disabled={this.props.question.type != QuestionTypeEnum.BOOLEAN || this.props.parentQuestion != undefined} onClick={() => this.props.addSubQuestionAction!(this.props.question, true)}><AddCircleOutlineIcon />Tilføj underspørgsmål</Button>

                            <Stack direction="row" spacing={2} sx={{ marginLeft: "auto" }}>

                                <ButtonGroup variant="text" >
                                    <IconButton onClick={() => this.props.removeQuestionAction(this.props.question)}>
                                        <DeleteOutlineIcon />
                                    </IconButton>
                                    <Button sx={{ padding: 2 }} onClick={() => this.props.addSubQuestionAction!(this.props.question, false)}> <AddCircleIcon />Tilføj nyt spørgsmål</Button>
                                </ButtonGroup>
                            </Stack>
                        </CardActions>

                    </Grid>
                </Grid>
            </Card>
        )
    }

    renderBooleanThreshold(): JSX.Element {


        if (!this.props.getThreshold)
            return <></>

        const thresholdCollection = this.props.getThreshold(this.state.question)

        return (
            <TableContainer>
                <Table>
                    {thresholdCollection.thresholdOptions?.map(option => {
                        return (
                            <TableRow>
                                <TableCell>
                                    {option.option == "true" ? "Ja" : "Nej"}
                                </TableCell>
                                <TableCell>
                                    <CategorySelect category={option.category} onChange={(newCategory) => { option.category = newCategory }} />
                                </TableCell>
                            </TableRow>
                        )
                    })}
                </Table>
            </TableContainer>
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