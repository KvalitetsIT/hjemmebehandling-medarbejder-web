import { Question, QuestionTypeEnum, Option } from "@kvalitetsit/hjemmebehandling/Models/Question";
import { CategoryEnum } from "@kvalitetsit/hjemmebehandling/Models/CategoryEnum";
import { Alert, Box, Button, ButtonGroup, Card, CardActions, CardContent, CardHeader, Container, Divider, FormControl, FormControlLabel, Grid, GridSize, IconButton, InputLabel, MenuItem, Radio, RadioGroup, Select, Stack, Table, TableCell, TableContainer, TableRow, TextField } from "@mui/material";
import { Component, Key, ReactNode, useEffect, useState } from "react";
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
import { InvalidInputModel } from "@kvalitetsit/hjemmebehandling/Errorhandling/ServiceErrors/InvalidInputError";
import { Tooltip } from '@mui/material'
import { v4 as uuid } from 'uuid';
import { MeasurementType } from "@kvalitetsit/hjemmebehandling/Models/MeasurementType";


interface Props {
    key: Key | null | undefined
    parentQuestion?: Question
    question: Question
    getThreshold?: (question: Question) => ThresholdCollection
    addSubQuestionAction?: (referenceQuestion: Question | undefined, isParent: boolean) => void
    removeQuestionAction: (questionToRemove: Question) => void
    moveItemUp: (question: Question) => void
    moveItemDown: (question: Question) => void
    onValidation: (uniqueId: string, error: InvalidInputModel[]) => void
    sectionName?: string
    disabled: boolean
    deletable?: boolean
    onUpdate: (updatedQuestion: Question) => void
    allMeasurementTypes: MeasurementType[]
    active?: boolean

}
interface State {
    variant?: "text" | "number"
}

export class QuestionEditCard extends Component<Props, State>{
    static defaultProps = {
    }

    constructor(props: Props) {
        super(props);
        this.state = {
            variant: this.getVariant(props.question.options)
        }
    }

    getVariant(options: Option[] | undefined): "number" | "text" | undefined {
        if (options === undefined || this.props.question.type !== QuestionTypeEnum.CHOICE) return undefined
        const isNumbers = options.every(x => !Number.isNaN(parseFloat(x.option)))
        return isNumbers ? "number" : "text"
    }

    async validateAbbreviation(value: string): Promise<InvalidInputModel[]> {
        const errors: InvalidInputModel[] = []
        if (value.length <= 0) errors.push(new InvalidInputModel("abbreviation", "Forkortelse til kliniker mangler"))
        return errors
    };

    async validateQuestionName(value: string): Promise<InvalidInputModel[]> {
        const errors: InvalidInputModel[] = []
        if (value.length <= 0) errors.push(new InvalidInputModel("question", "Spørgsmål er endnu ikke udfyldt"))
        return errors
    }
    async validateChoiceInput(value: string): Promise<InvalidInputModel[]> {
        const errors: InvalidInputModel[] = []
        if (value.length <= 0) errors.push(new InvalidInputModel("question", "Svarmulighed er endnu ikke udfyldt"))
        return errors
    }
    /*
        async validateHelperText(value: string): Promise<InvalidInputModel[]> {
            const errors: InvalidInputModel[] = []
            if (value.length <= 0) errors.push(new InvalidInputModel("helperText", "hjælpetekst er endnu ikke udfyldt"))
            return errors
        }
    */

    render(): ReactNode {
        const parrentQuestion = this.props.parentQuestion;
        const parentQuestionHasGoodType = parrentQuestion === undefined || parrentQuestion?.type === QuestionTypeEnum.BOOLEAN

        const shouldShowThresholds = this.props.question.type === QuestionTypeEnum.BOOLEAN
        const shouldShowMultipleChoice = this.props.question.type === QuestionTypeEnum.CHOICE
        const shouldShowObservationBlock = this.props.question.type === QuestionTypeEnum.OBSERVATION || this.props.question.type === QuestionTypeEnum.GROUP
        const className = this.props.parentQuestion !== undefined ? "focusedChildQuestionEditCard" : "focusedParentQuestionEditCard"

        const BooleanThresholdEditor = () => {

            const thresholdCollection = this.props.getThreshold ? this.props.getThreshold(this.props.question) : undefined

            return (
                <TableContainer>
                    <Table>
                        {thresholdCollection && thresholdCollection.thresholdOptions?.map(option => {
                            return (
                                <TableRow>
                                    <TableCell>
                                        {option.option === "true" ? "Ja" : "Nej"}
                                    </TableCell>
                                    <TableCell>
                                        <CategorySelect
                                            sectionName={this.props.sectionName}
                                            disabled={this.props.disabled}
                                            category={option.category}
                                            onChange={(newCategory) => { option.category = newCategory }}
                                            onValidation={this.props.onValidation}
                                            uniqueId={this.props.question.Id! + option.option}
                                        />
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                    </Table>
                </TableContainer>
            )
        }

        return (
            <Card>

                <Grid key={this.props.key} container columns={48}>
                    <Grid sx={{ display: "flex", justifyContent: "space-between", flexDirection: "column" }} paddingTop={2} paddingBottom={2} className={className} item xs={1} >
                        <Button sx={{ minWidth: 0 }} onClick={() => this.props.moveItemUp(this.props.question)}><KeyboardArrowUpIcon fontSize="large" /></Button>
                        <Button sx={{ minWidth: 0 }} onClick={() => this.props.moveItemDown(this.props.question)}><KeyboardArrowDownIcon fontSize="large" /></Button>
                    </Grid>
                    <Grid item xs={47 as GridSize}>
                        <CardHeader subheader={
                            <><div>
                                {this.props.parentQuestion ?
                                    <Grid container marginTop={1} marginBottom={3} columns={12}>
                                        <Grid item xs={12}>
                                            <Box>
                                                <EnableWhenSelect
                                                    enableWhen={this.props.question.enableWhen!}
                                                    parentQuestion={this.props.parentQuestion}
                                                    sectionName={this.props.sectionName} />
                                            </Box>
                                        </Grid>
                                    </Grid>
                                    : <></>
                                }
                                <Grid container marginTop={1} columns={12}>

                                    <Grid item xs>
                                        <TextFieldValidation
                                            label="Spørgsmål"
                                            value={this.props.question.question}
                                            variant="outlined"
                                            size="medium"
                                            minWidth={500}
                                            uniqueId={this.props.question.Id! + '_question'}
                                            onValidation={this.props.onValidation}
                                            validate={this.validateQuestionName}
                                            onChange={input => {
                                                const newValue = input.currentTarget.value;
                                                this.props.onUpdate({ ...this.props.question, question: newValue })
                                            }}
                                            sectionName={this.props.sectionName}
                                        />

                                    </Grid>
                                    <Grid item xs="auto">
                                        <TextFieldValidation
                                            label="Forkortelse til kliniker"
                                            value={this.props.question.abbreviation}
                                            variant="outlined"
                                            size="medium"
                                            uniqueId={this.props.question.Id! + '_abbreviation'}
                                            onChange={input => {
                                                const newValue = input.currentTarget.value;
                                                this.props.onUpdate({ ...this.props.question, abbreviation: newValue })
                                            }}

                                            onValidation={this.props.onValidation}
                                            validate={this.validateAbbreviation}
                                            sectionName={this.props.sectionName}
                                        />
                                    </Grid>

                                </Grid>
                            </div>
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
                                        uniqueId={this.props.question.Id! + '_helperText'}
                                        minWidth={800}
                                        onChange={input => {
                                            const newValue = input.currentTarget.value;
                                            this.props.onUpdate({ ...this.props.question, helperText: newValue })
                                        }}
                                        required
                                        sectionName={this.props.sectionName}
                                        onValidation={this.props.onValidation}
                                    />
                                </Grid>
                                <Grid item xs>
                                    <QuestionTypeSelect
                                        question={this.props.question}
                                        sectionName={this.props.sectionName}
                                        onValidation={this.props.onValidation}
                                        disabled={this.props.disabled}
                                        uniqueId={this.props.question.Id! + '_questionType'}
                                        onChange={input => {
                                            const newValue = input.target.value as unknown as QuestionTypeEnum
                                            let subQuestions: Question[] = [];
                                            if (newValue === QuestionTypeEnum.GROUP) {
                                                subQuestions = [this.createNewSubQuestion(), this.createNewSubQuestion()];
                                            }
                                            this.props.onUpdate({ ...this.props.question, type: newValue, subQuestions: subQuestions })
                                        }}

                                    />
                                </Grid>

                                {this.props.question.type === QuestionTypeEnum.CHOICE && (
                                    <Grid item xs>
                                        <FormControl sx={{ minWidth: 200 }} required>
                                            <InputLabel>Vælg typen af svar</InputLabel>
                                            <Select
                                                label="Vælg typen af svar"
                                                onChange={input => this.setState({ variant: input.target.value as "text" | "number" })}
                                                value={this.state.variant}
                                                disabled={this.props.question.options?.length !== 0 && this.props.question.options !== undefined}
                                            >
                                                <MenuItem value="text">Tekst</MenuItem>
                                                <MenuItem value="number">Tal</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>

                                )}
                            </Grid>
                            {
                                /*
                            <Grid container spacing={2}>
                                <Grid item xs={8}>
                                    {this.state.question.type === QuestionTypeEnum.OBSERVATION ?
                                        <QuestionMeasurementTypeSelect
                                            sectionName={this.props.sectionName}
                                            onValidation={this.props.onValidation}
                                            disabled={this.props.disabled}
                                            forceUpdate={this.forceCardUpdate}
                                            question={this.state.question}
                                            uniqueId={this.props.question.Id! + '_measurementType'}
                                        />
                                        : <></>}
                                </Grid>
                                <Grid item xs={4}>
                                <Button className="add-child-question" sx={{ padding: 2 }} onClick={() => this.props.addSubQuestionAction!(this.props.question, true)}>
                                <AddCircleOutlineIcon sx={{ paddingRight: 1, width: 'auto' }} />
                                Tilføj yderligere måling
                            </Button>
                                </Grid>
                            </Grid>
                                    */
                            }


                            {shouldShowObservationBlock && this.renderObservationBlock(this.props.question)}



                            {(shouldShowMultipleChoice && this.state.variant !== undefined) && (
                                <MultipleChoiceEditor
                                    variant={this.state.variant}
                                    disabled={true}
                                    options={this.props.question.options?.map((option, i) => {
                                        const thresholdOptions = this.props.getThreshold && this.props.getThreshold(this.props.question).thresholdOptions

                                        return {
                                            ...option,
                                            triage: thresholdOptions && thresholdOptions[i] !== undefined ? thresholdOptions[i].category : CategoryEnum.BLUE
                                        }
                                    })}
                                    onChange={(options) => {
                                        this.props.onUpdate && this.props.onUpdate({
                                            ...this.props.question,
                                            options: options
                                        })
                                    }}
                                    onValidation={this.props.onValidation}
                                    validate={this.validateChoiceInput}
                                />
                            )}


                            {shouldShowThresholds && <BooleanThresholdEditor />}

                        </CardContent >

                        <Divider />
                        <CardActions disableSpacing>
                            <Button className="add-child-question" sx={{ padding: 2 }} disabled={this.props.question.type !== QuestionTypeEnum.BOOLEAN || this.props.parentQuestion !== undefined} onClick={() => this.props.addSubQuestionAction!(this.props.question, true)}>
                                <AddCircleOutlineIcon sx={{ paddingRight: 1, width: 'auto' }} />
                                Tilføj underspørgsmål
                            </Button>

                            <Stack direction="row" spacing={2} sx={{ marginLeft: "auto" }}>
                                <ButtonGroup variant="text" >
                                    <Tooltip title='Slet' placement='right'>
                                        <IconButton sx={{ color: '#5D74AC', padding: 2 }} className="delete-question" disabled={this.props.deletable} onClick={() => this.props.removeQuestionAction(this.props.question)}>
                                            <DeleteOutlineIcon />
                                        </IconButton>
                                    </Tooltip>
                                    <Button disabled={this.props.parentQuestion !== undefined} sx={{ padding: 2 }} onClick={() => this.props.addSubQuestionAction!(this.props.question, false)}>
                                        <AddCircleIcon sx={{ paddingRight: 1, width: 'auto' }} />
                                        Tilføj nyt spørgsmål
                                    </Button>
                                </ButtonGroup>
                            </Stack>
                        </CardActions>

                    </Grid >
                </Grid >
            </Card >
        )
    }

    createNewSubQuestion(): Question {
        const newSubQuestion = new Question();
        newSubQuestion.Id = uuid();
        newSubQuestion.type = QuestionTypeEnum.OBSERVATION;

        return newSubQuestion;

    }
    renderObservationBlock(question: Question): JSX.Element {
        let renderQuestions: Question[] = [];
        if (question.type === QuestionTypeEnum.OBSERVATION) {
            renderQuestions.push(question);
        }
        else if (question.type === QuestionTypeEnum.GROUP) {
            if (!question.subQuestions) {
                question.subQuestions = [this.createNewSubQuestion(), this.createNewSubQuestion()]
            }
            renderQuestions.push(...question.subQuestions!);
        }
        const isGroupQuestion = question.type === QuestionTypeEnum.GROUP;

        return (
            <TableContainer>
                <Table>
                    {renderQuestions.map((question, index) => {
                        const isLast = renderQuestions.length - 1 == index
                        return (
                            <TableRow>
                                <TableCell>
                                    <Stack direction="row" spacing={2} >
                                        <QuestionMeasurementTypeSelect
                                            sectionName={this.props.sectionName}
                                            onValidation={this.props.onValidation}
                                            disabled={this.props.disabled}
                                            question={question}
                                            uniqueId={question.Id!}
                                            onChange={input => {
                                                const clickedMeasurementCode = input.target.value
                                                const clicked = this.props.allMeasurementTypes.find(mt => mt.code === clickedMeasurementCode);

                                                if (this.props.question.type === QuestionTypeEnum.GROUP) {
                                                    //find correct subQuestion to update
                                                    const subQuestion = this.props.question.subQuestions?.find(sq => sq.Id === question.Id);
                                                    subQuestion!.measurementType = clicked
                                                    this.props.onUpdate({ ...this.props.question })
                                                }
                                                else {
                                                    this.props.onUpdate({ ...this.props.question, measurementType: clicked })
                                                }
                                            }}
                                            allMeasurementTypes={this.props.allMeasurementTypes}
                                        />

                                        {isGroupQuestion && !this.props.disabled ?
                                            <ButtonGroup variant="text" >
                                                <Tooltip title='Slet' placement='right'>
                                                    <IconButton sx={{ color: '#5D74AC', padding: 2 }} className="delete-question" disabled={renderQuestions.length == 2} onClick={() => this.removeObservation(question)}>
                                                        <DeleteOutlineIcon />
                                                    </IconButton>
                                                </Tooltip>
                                                {isLast ?
                                                    <Button className="add-child-question" sx={{ padding: 2 }} onClick={() => this.addObservation()}>
                                                        <AddCircleOutlineIcon sx={{ paddingRight: 1, width: 'auto' }} />
                                                        Tilføj yderligere måling
                                                    </Button>
                                                    :
                                                    <></>
                                                }
                                            </ButtonGroup>
                                            :
                                            <></>
                                        }
                                    </Stack>
                                </TableCell>
                            </TableRow>
                        )
                    })
                    }
                </Table>
            </TableContainer>
        )
    }

    removeObservation(removeQuestion: Question): void {
        const question = { ...this.props.question };
        if (question.subQuestions && question.subQuestions.length > 2) {
            question.subQuestions = question.subQuestions?.filter(sq => sq.Id !== removeQuestion.Id/*!sq.isEqual(removeQuestion)*/);

            this.props.onUpdate(question)
        }
    }

    addObservation(): void {
        const question = { ...this.props.question };

        if (question.subQuestions) {
            question.subQuestions.push(this.createNewSubQuestion());

            this.props.onUpdate(question);
        }
    }
    renderBooleanThreshold(): JSX.Element {


        const thresholdCollection = this.props.getThreshold ? this.props.getThreshold(this.props.question) : undefined

        return (
            <TableContainer>
                <Table>
                    {thresholdCollection && thresholdCollection.thresholdOptions?.map(option => {
                        return (
                            <TableRow>
                                <TableCell>
                                    {option.option === "true" ? "Ja" : "Nej"}
                                </TableCell>
                                <TableCell>
                                    <CategorySelect
                                        sectionName={this.props.sectionName}
                                        disabled={this.props.disabled}
                                        category={option.category}
                                        onChange={(newCategory) => { option.category = newCategory }}
                                        onValidation={this.props.onValidation}
                                        uniqueId={this.props.question.Id! + option.option}
                                    />
                                </TableCell>
                            </TableRow>
                        )
                    })}
                </Table>
            </TableContainer>
        )
    }
}

/*

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
    modifiedQuestion!.enableWhen!.answer = newValue.toLowerCase() === 'ja';
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


setOptions(oldQuestion: Question, options: string[]): Question {
    const modifiedQuestion = oldQuestion;
    modifiedQuestion!.options = options;
    return modifiedQuestion;
}

}
*/


interface MultipleChoiceEditorProps {
    variant: "text" | "number",
    options?: Array<Option>
    onChange?: (options: Option[]) => void
    onValidation: (uniqueId: string, error: InvalidInputModel[]) => void
    validate?: (value: string) => Promise<InvalidInputModel[]>
    disabled?: boolean
}

const MultipleChoiceEditor = (props: MultipleChoiceEditorProps) => {

    let [options, setOptions] = useState(props.options?.map(option => { 
        if (option.triage != CategoryEnum.BLUE) return { ...option, original: true } 
        else return { ...option, original: false }
    }))


    const updateItem = (index: number, item: Option) => {
        setOptions(prevOptions => {
            if (prevOptions) prevOptions[index] = { ...prevOptions[index], ...item };
            triggerOnChange(prevOptions);
            return prevOptions;
        })
    }

    const addItem = () => {
        setOptions(prevOptions => {
            const emptyItem = { option: "", comment: "", triage: CategoryEnum.BLUE, original: false };
            const newOptions = [...prevOptions ?? [], emptyItem];
            triggerOnChange(newOptions);
            return newOptions;
        });
    }

    const deleteItem = (i: number) => {
        setOptions(prevOptions => {
            const newOptions = prevOptions?.slice(0, i).concat(prevOptions.slice(i + 1));
            triggerOnChange(newOptions);
            return newOptions;
        });
    }

    const triggerOnChange = (options: {
        original: boolean;
        option: string;
        comment: string;
        triage: CategoryEnum;
    }[] | undefined) => {
        let state = options?.map(option => option as Option) ?? [];
        props.onChange && props.onChange(state);
    }


    return (
        <>
            <FormControl >
                {options && options.map((item, i) => (
                    <>
                        <Stack minWidth={800} direction={"row"} spacing={2} marginTop={2} width={"100%"}>

                            <TextFieldValidation
                                label={"Svarmulighed"}
                                uniqueId={'svarmulighed_' + i}
                                variant="outlined"
                                size="medium"
                                onChange={(x) => {
                                    const typeIsNumber = (props.variant == 'number');
                                    const valueIsNumber = !Number.isNaN(parseFloat(x.target.value));
                                    const valueIsEmpty = x.target.value == '';

                                    if ((typeIsNumber && (valueIsNumber || valueIsEmpty)) || (props.variant == 'text')) {
                                        updateItem(i, { ...item, option: x.target.value })
                                    }
                                }}
                                value={item.option}
                                onValidation={props.onValidation}
                                validate={props.validate}
                                sectionName={'questionnaire'}

                            />

                            <TextFieldValidation
                                label={"Kommentar"}
                                uniqueId={"kommentar_" + i}
                                size="medium"
                                variant="outlined"
                                onChange={(x) => updateItem(i, { ...item, comment: x.target.value })}
                                value={item.comment}
                            />

                            <CategorySelect
                                // sectionName={this.props.sectionName}
                                // disabled={this.props.disabled}
                                label="Triagering"
                                disabled={item.original}
                                category={item.triage}
                                onChange={(newCategory) => { updateItem(i, { ...item, triage: newCategory }); }}
                                // onValidation={this.props.onValidation}
                                uniqueId={"category_" + i}
                            />


                            <Tooltip title='Slet' placement='right'>
                                <IconButton onClick={() => deleteItem(i)}>
                                    <DeleteOutlineIcon />
                                </IconButton>
                            </Tooltip>



                        </Stack>
                    </>
                ))}

                <Button sx={{ marginTop: 2, width: 150 }} onClick={() => addItem()}>
                    <AddCircleIcon sx={{ paddingRight: 1 }} />
                    Tilføj svarmulighed
                </Button>
            </FormControl>



        </>


    )
}