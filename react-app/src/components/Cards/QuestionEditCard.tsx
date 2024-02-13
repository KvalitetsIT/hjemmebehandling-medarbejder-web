import { Question, QuestionTypeEnum, Option } from "@kvalitetsit/hjemmebehandling/Models/Question";
import { CategoryEnum } from "@kvalitetsit/hjemmebehandling/Models/CategoryEnum";
import { Alert, Box, Button, ButtonGroup, Card, CardActions, CardContent, CardHeader, Container, Divider, FormControl, FormControlLabel, Grid, GridSize, IconButton, InputLabel, MenuItem, Radio, RadioGroup, Select, SelectChangeEvent, Stack, Table, TableCell, TableContainer, TableRow, TextField, Typography } from "@mui/material";
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
import { CriticalLevelEnum, InvalidInputModel } from "@kvalitetsit/hjemmebehandling/Errorhandling/ServiceErrors/InvalidInputError";
import { Tooltip } from '@mui/material'
import { v4 as uuid } from 'uuid';
import { MeasurementType } from "@kvalitetsit/hjemmebehandling/Models/MeasurementType";
import { ValidationError } from "yup";
import { ValidateInputEvent, ValidateInputEventData } from "@kvalitetsit/hjemmebehandling/Events/ValidateInputEvent";
import CreateQuestionnairePage from "../../pages/questionnaires/create";
import { ErrorMessage } from "../Errors/MessageWithWarning";
import { ThresholdOption } from "@kvalitetsit/hjemmebehandling/Models/ThresholdOption";


interface Props {
    key: Key | null | undefined
    parentQuestion?: Question
    question: Question
    sectionName?: string
    disabled: boolean
    deletable?: boolean
    allMeasurementTypes: MeasurementType[]
    active?: boolean

    onUpdate: (updatedQuestion: Question) => void
    getThreshold?: (question: Question) => ThresholdCollection
    addSubQuestionAction?: (referenceQuestion: Question | undefined, isParent: boolean) => void
    removeQuestionAction: (questionToRemove: Question) => void
    moveItemUp: (question: Question) => void
    moveItemDown: (question: Question) => void
    onValidation: (uniqueId: string, error: InvalidInputModel[]) => void
}
interface State {
    variant?: "text" | "number"
    errors: InvalidInputModel[];
}

export class QuestionEditCard extends Component<Props, State>{
    static defaultProps = {}

    constructor(props: Props) {
        super(props);
        this.state = {
            variant: undefined, //this.getVariant(props.question),
            errors: [],
        }
        this.onValidateEvent = this.onValidateEvent.bind(this)
    }
    componentDidMount(): void {
        window.addEventListener(ValidateInputEvent.eventName, this.onValidateEvent);
    }

    getVariant(question: Question): "number" | "text" | undefined {
        const options: Option[] | undefined = question.options
        let questionIsOfTypeChoice = question.type === QuestionTypeEnum.CHOICE;

        if (!questionIsOfTypeChoice) return undefined
        const isNumbers = options && options.every(x => !Number.isNaN(parseFloat(x.option)))
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

    onValidateEvent(event: Event): void {
        const data = (event as CustomEvent).detail as ValidateInputEventData
        if (CreateQuestionnairePage.sectionName === data.sectionName) {
            this.validate();
        }
    }

    validate(): void {
        const optionsAreMissing = this.state.variant && this.props.question.type == QuestionTypeEnum.CHOICE && !(this.props.question.options != undefined && this.props.question.options?.length > 0)
        const e = optionsAreMissing ? [new InvalidInputModel(CreateQuestionnairePage.sectionName, "Der mangler svarmuligheder")] : []
        this.setState(prevState => ({ ...prevState, errors: e }))
    }

    onUpdate(updatedQuestion: Question) {
        this.props.onUpdate(updatedQuestion)
        this.validate()
    }

    renderErrors(): ReactNode {
        return (<>
            {this.state.errors.map(e => (<ErrorMessage color={"warning"} message={e.message} />))}
        </>)
    }


    render(): ReactNode {
        const parrentQuestion = this.props.parentQuestion;
        const parentQuestionHasGoodType = parrentQuestion === undefined || parrentQuestion?.type === QuestionTypeEnum.BOOLEAN
        const className = this.props.parentQuestion !== undefined ? "focusedChildQuestionEditCard" : "focusedParentQuestionEditCard"

        const Header = () => (
            <CardHeader subheader={
                <><div>
                    {this.props.parentQuestion && (
                        <Grid container marginTop={1} marginBottom={3} columns={12}>
                            <Grid item xs={12}>
                                <Box>
                                    <EnableWhenSelect
                                        enableWhen={this.props.question.enableWhen!}
                                        {...this.props}
                                    />
                                </Box>
                            </Grid>
                        </Grid>
                    )

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
                                validate={this.validateQuestionName}
                                onChange={input => {
                                    const newValue = input.currentTarget.value;
                                    this.onUpdate({ ...this.props.question, question: newValue })
                                }}
                                sectionName={this.props.sectionName}
                                {...this.props}

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
                                    this.onUpdate({ ...this.props.question, abbreviation: newValue })
                                }}

                                validate={this.validateAbbreviation}
                                {...this.props}

                            />
                        </Grid>

                    </Grid>
                </div>
                </>
            } />
        )

        const Content = () => (
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
                                this.onUpdate({ ...this.props.question, helperText: newValue })
                            }}
                            required
                            sectionName={this.props.sectionName}

                            {...this.props}

                        />
                    </Grid>
                    <Grid item xs>
                        <QuestionTypeSelect
                            uniqueId={this.props.question.Id! + '_questionType'}
                            onChange={input => {
                                const newType = input.target.value as unknown as QuestionTypeEnum

                                this.onUpdate({ ...this.props.question, type: newType })
                            }}
                            {...this.props}
                        />
                    </Grid>

                    {this.props.question.type === QuestionTypeEnum.CHOICE && (
                        <Grid item xs>
                            <FormControl sx={{ minWidth: 200 }} required>
                                <InputLabel>Vælg typen af svar</InputLabel>
                                <Select
                                    label="Vælg typen af svar"
                                    onChange={input => {
                                        this.setState({ variant: input.target.value as "text" | "number" | undefined })
                                        this.onUpdate({ ...this.props.question })
                                    }}
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

                <QuestionEditor {...this.props} value={this.props.question} onChange={this.props.onUpdate} />

                {this.renderErrors()}

            </CardContent >
        )


        const Actions = () => (
            <CardActions disableSpacing>
                <Button className="add-child-question" sx={{ padding: 2 }} disabled={this.props.question.type !== QuestionTypeEnum.BOOLEAN || this.props.parentQuestion !== undefined} onClick={() => this.props.addSubQuestionAction!(this.props.question, true)}>
                    <AddCircleOutlineIcon sx={{ paddingRight: 1, width: 'auto' }} />
                    Tilføj underspørgsmål
                </Button>

                <Stack direction="row" spacing={2} sx={{ marginLeft: "auto" }}>
                    <ButtonGroup variant="text" >
                        <Tooltip title='Slet' placement='right'>
                            <IconButton sx={{ color: '#5D74AC', padding: 2, width: 50 }} className="delete-question" disabled={this.props.deletable} onClick={() => this.props.removeQuestionAction(this.props.question)}>
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
        )

        return (
            <Card>
                <Grid key={this.props.key} container columns={48}>
                    <Grid sx={{ display: "flex", justifyContent: "space-between", flexDirection: "column" }} paddingTop={2} paddingBottom={2} className={className} item xs={1} >
                        <Button sx={{ minWidth: 0 }} onClick={() => this.props.moveItemUp(this.props.question)}><KeyboardArrowUpIcon fontSize="large" /></Button>
                        <Button sx={{ minWidth: 0 }} onClick={() => this.props.moveItemDown(this.props.question)}><KeyboardArrowDownIcon fontSize="large" /></Button>
                    </Grid>
                    <Grid item xs={47 as GridSize}>
                        <Header />
                        {!parentQuestionHasGoodType &&
                            <Alert color="warning">Overspørgsmålets spørgsmålstype understøtter ikke underspørgsmål - Dette spørgsmål vil blive slettet</Alert>
                        }

                        <Divider />
                        <Content />
                        <Divider />
                        <Actions />
                    </Grid >
                </Grid >
            </Card >
        )
    }
}


const QuestionEditor = (props: QuestionEditorProps) => {

    const [variant, setVariant] = useState<"text" | "number" | undefined>(undefined)

    const question = props.value

    function updateThresholds(thresholds: ThresholdCollection) {



    }

    function updateOptions(options: Option[]) {
        props.onChange && props.onChange({
            ...question,
            options: options
        });
    }

    switch (question?.type) {
        case QuestionTypeEnum.CHOICE:
            return (
                <MultipleChoiceEditor
                    {...props}
                    variant={variant}
                    onChange={updateOptions}
                    value={
                        question.options?.map((option, i) => {
                            const thresholdOptions = props.thresholds?.thresholdOptions;
                            return {
                                ...option,
                                triage: thresholdOptions && thresholdOptions[i] !== undefined ? thresholdOptions[i].category : CategoryEnum.BLUE
                            };
                        })
                    }
                />
            )

        case QuestionTypeEnum.BOOLEAN:
            return (
                <BooleanThresholdEditor
                    {...props}
                    value={props.thresholds}
                    onChange={updateThresholds}
                />
            )
        case QuestionTypeEnum.GROUP:
            return (
                <ObservationEditor {...props} />
            )
        case QuestionTypeEnum.OBSERVATION:
            return (
                <ObservationEditor {...props} />
            )

        default:
            return (<></>)
    }

}





const ObservationEditor = (props: ObservationEditorProps) => {

    let question = props.value!

    let questions: Question[] = [];
    if (question.type === QuestionTypeEnum.OBSERVATION) {
        questions.push(question);
    }
    else if (question.type === QuestionTypeEnum.GROUP) {
        if (!question.subQuestions) {
            question.subQuestions = [createNewSubQuestion(), createNewSubQuestion()]
        }
        questions.push(...question.subQuestions!);
    }
    const isGroupQuestion = question.type === QuestionTypeEnum.GROUP;

    function createNewSubQuestion(): Question {
        const newSubQuestion = new Question();
        newSubQuestion.Id = uuid();
        newSubQuestion.type = QuestionTypeEnum.OBSERVATION;
        return newSubQuestion;
    }

    function addObservation(): void {
        if (question?.subQuestions) {
            question?.subQuestions.push(createNewSubQuestion());
            props.onChange && props.onChange(question);
        }
    }

    function removeObservation(removeQuestion: Question): void {
        if (question?.subQuestions && question.subQuestions.length > 2) {
            question.subQuestions = question?.subQuestions?.filter(sq => sq.Id !== removeQuestion.Id/*!sq.isEqual(removeQuestion)*/);
            props.onChange && props.onChange(question)
        }
    }

    function onChange(input: SelectChangeEvent<string>) {
        const clickedMeasurementCode = input.target.value
        const clicked = props.allMeasurementTypes.find(mt => mt.code === clickedMeasurementCode);

        if (question?.type === QuestionTypeEnum.GROUP) {
            //find correct subQuestion to update
            const subQuestion = question?.subQuestions?.find(sq => sq.Id === question?.Id);
            subQuestion!.measurementType = clicked
            props.onChange && props.onChange({ ...question })
        }
        else {
            props.onChange && props.onChange({ ...question, measurementType: clicked })
        }
    }

    return (
        <TableContainer>
            <Table>
                {questions.map((question, index) => {
                    const isLast = questions.length - 1 == index
                    return (
                        <TableRow>
                            <TableCell>
                                <Stack direction="row" spacing={2} >
                                    <QuestionMeasurementTypeSelect
                                        {...props}
                                        question={question}
                                        uniqueId={question.Id!}
                                        onChange={onChange}
                                        allMeasurementTypes={props.allMeasurementTypes}
                                    />

                                    {(isGroupQuestion && !props.disabled) && (
                                        <ButtonGroup variant="text" >
                                            <Tooltip title='Slet' placement='right'>
                                                <IconButton
                                                    sx={{ color: '#5D74AC', padding: 2, width: 50 }}
                                                    className="delete-question"
                                                    disabled={questions.length == 2}
                                                    onClick={() => removeObservation(question)}>
                                                    <DeleteOutlineIcon />
                                                </IconButton>
                                            </Tooltip>
                                            {isLast ?
                                                <Button className="add-child-question" sx={{ padding: 2 }} onClick={() => addObservation()}>
                                                    <AddCircleOutlineIcon sx={{ paddingRight: 1, width: 'auto' }} />
                                                    Tilføj yderligere måling
                                                </Button>
                                                :
                                                <></>
                                            }
                                        </ButtonGroup>
                                    )}
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



interface EditorProps<T> {
    disabled: boolean
    sectionName?: string
    thresholds?: ThresholdCollection
    allMeasurementTypes: MeasurementType[]
    value?: T

    onChange?: (value: T) => void
    onValidation: (uniqueId: string, error: InvalidInputModel[]) => void
}

interface QuestionEditorProps extends EditorProps<Question> { }


interface ObservationEditorProps extends EditorProps<Question> { }

interface BooleanThresholdEditorProps extends EditorProps<ThresholdCollection> { }

interface MultipleChoiceEditorProps extends EditorProps<Array<Option>> {
    variant?: "text" | "number",
}


const BooleanThresholdEditor = (props: BooleanThresholdEditorProps) => {

    const thresholdCollection = props.thresholds


    function updateCategory(category: CategoryEnum, option: ThresholdOption, index: number) {
        let updatedOptions = thresholdCollection?.thresholdOptions
        updatedOptions![index] = { ...option, category: category }
        const collection: ThresholdCollection = { ...thresholdCollection, questionId: thresholdCollection?.questionId!, thresholdOptions: updatedOptions }
        props.onChange && props.onChange(collection)
    }


    return (
        <TableContainer>
            <Table>
                {thresholdCollection && thresholdCollection.thresholdOptions?.map((option, index) => {
                    return (
                        <TableRow>
                            <TableCell>
                                {option.option === "true" ? "Ja" : "Nej"}
                            </TableCell>
                            <TableCell>
                                <CategorySelect
                                    {...props}
                                    category={option.category}
                                    onChange={(category) => updateCategory(category, option, index)}
                                    uniqueId={thresholdCollection?.questionId! + option.option}
                                />
                            </TableCell>
                        </TableRow>
                    )
                })}
            </Table>
        </TableContainer>
    )
}


const MultipleChoiceEditor = (props: MultipleChoiceEditorProps) => {

    let [options, setOptions] = useState(props.value?.map(option => {
        if (option.triage != CategoryEnum.BLUE) {
            return ({
                ...option,
                // Determines if the option were originally read from the backend or if it is recently added
                original: true
            })
        } else return { ...option, original: false }
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

    const validate = async (index: number, value: string, options: {
        original: boolean;
        option: string;
        comment: string;
        triage: CategoryEnum;
    }[] | undefined): Promise<InvalidInputModel[]> => {

        const optionInUse = !(options?.slice(0, index).every(option => option.option !== value))

        let errors: InvalidInputModel[] = []

        if (value.length <= 0) errors.push(new InvalidInputModel("question", "Svarmulighed er endnu ikke udfyldt"))
        if (optionInUse) errors.push(new InvalidInputModel("question", "Svarmuligheden er allerede i brug"))

        return errors
    }

    if (props.variant == undefined) return <></>
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
                                    updateItem(i, { ...item, option: x.target.value })

                                }}
                                type={props.variant}
                                value={item.option}
                                onValidation={props.onValidation}
                                validate={(value: string) => validate(i, value, options)}
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
                                <IconButton onClick={() => deleteItem(i)} sx={{ width: 50 }}>
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