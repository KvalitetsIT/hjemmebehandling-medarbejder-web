import { Question, QuestionTypeEnum, Option } from "@kvalitetsit/hjemmebehandling/Models/Question";
import { Alert, Box, Button, ButtonGroup, Card, CardActions, CardContent, CardHeader, Container, Divider, FormControl, FormControlLabel, Grid, GridSize, IconButton, InputLabel, MenuItem, Radio, RadioGroup, Select, SelectChangeEvent, Stack, Table, TableCell, TableContainer, TableRow, TextField, Typography } from "@mui/material";
import { Component, Key, ReactNode, useEffect, useState } from "react";
import { EnableWhenSelect } from "../Input/EnableWhenSelect";
import { QuestionTypeSelect } from "../Input/QuestionTypeSelect";
import { TextFieldValidation } from "../Input/TextFieldValidation";
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { ThresholdCollection } from "@kvalitetsit/hjemmebehandling/Models/ThresholdCollection";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { CriticalLevelEnum, InvalidInputModel } from "@kvalitetsit/hjemmebehandling/Errorhandling/ServiceErrors/InvalidInputError";
import { Tooltip } from '@mui/material'
import { MeasurementType } from "@kvalitetsit/hjemmebehandling/Models/MeasurementType";
import { ValidateInputEvent, ValidateInputEventData } from "@kvalitetsit/hjemmebehandling/Events/ValidateInputEvent";
import CreateQuestionnairePage from "../../pages/questionnaires/create";
import { ErrorMessage } from "../Errors/MessageWithWarning";
import { QuestionEditor } from "../../pages/questionnaires/question/editor";

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

export const QuestionEditCardF = (props: Props) => {
    const [variant, setVariant] = useState<"text" | "number" | undefined>(undefined)
    const [errors, setErrors] = useState<InvalidInputModel[]>([])

    //window.addEventListener(ValidateInputEvent.eventName, onValidateEvent);


    useEffect(() => {
        function getVariant(question: Question): "number" | "text" | undefined {
            const options: Option[] | undefined = question.options

            if (options === undefined || options.length === 0) return undefined

            let questionIsOfTypeChoice = question.type === QuestionTypeEnum.CHOICE;

            if (!questionIsOfTypeChoice) return undefined
            const isNumbers = options && options.every(x => !Number.isNaN(parseFloat(x.option)))
            return isNumbers ? "number" : "text"
        }

        setVariant(getVariant(props.question))


    }, [props.question])

    async function validateAbbreviation(value: string): Promise<InvalidInputModel[]> {
        const errors: InvalidInputModel[] = []
        if (value.length <= 0) errors.push(new InvalidInputModel("abbreviation", "Forkortelse til kliniker mangler"))
        return errors
    };

    async function validateQuestionName(value: string): Promise<InvalidInputModel[]> {
        const errors: InvalidInputModel[] = []
        if (value.length <= 0) errors.push(new InvalidInputModel("question", "Spørgsmål er endnu ikke udfyldt"))
        return errors
    }

    function onValidateEvent(event: Event): void {
        const data = (event as CustomEvent).detail as ValidateInputEventData
        if (CreateQuestionnairePage.sectionName === data.sectionName) {
            validate();
        }
    }

    function validate(): void {
        const optionsAreMissing = variant && props.question.type === QuestionTypeEnum.CHOICE && !(props.question.options !== undefined && props.question.options?.length > 0)
        const e = optionsAreMissing ? [new InvalidInputModel(CreateQuestionnairePage.sectionName, "Der mangler svarmuligheder")] : []
        setErrors(e)
    }

    function updateQuestion(updatedQuestion: Question) {
        props.onUpdate(updatedQuestion)
        //validate()
    }

    function renderErrors(): ReactNode {
        return (<>
            {errors.map(e => (<ErrorMessage color={"warning"} message={e.message} />))}
        </>)
    }


    const Header = () => (
        <CardHeader subheader={
            <>
                <div>
                    {props.parentQuestion && (
                        <Grid container marginTop={1} marginBottom={3} columns={12}>
                            <Grid item xs={12}>
                                <Box>
                                    <EnableWhenSelect
                                        enableWhen={props.question.enableWhen!}
                                        {...props}
                                    />
                                </Box>
                            </Grid>
                        </Grid>
                    )

                    }
                    <Grid container marginTop={1} columns={12}>
                        <Grid item xs>
                            <TextFieldValidation
                                //{...props}
                                label="Spørgsmål"
                                value={props.question.question}
                                variant="outlined"
                                size="medium"
                                minWidth={500}
                                uniqueId={props.question.Id! + '_question'}
                                validate={validateQuestionName}
                                onChange={input => {
                                    const newValue = input.currentTarget.value;
                                    updateQuestion({ ...props.question, question: newValue })
                                }}
                                sectionName={props.sectionName}


                            />

                         
                              
                            


                        </Grid>
                        <Grid item xs="auto">
                            <TextFieldValidation
                                {...props}
                                label="Forkortelse til kliniker"
                                value={props.question.abbreviation}
                                variant="outlined"
                                size="medium"
                                uniqueId={props.question.Id! + '_abbreviation'}
                                onChange={input => {
                                    const newValue = input.currentTarget.value;
                                    updateQuestion({ ...props.question, abbreviation: newValue })
                                }}

                                validate={validateAbbreviation}
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
                        {...props}
                        label="Hjælpetekst"
                        value={props.question.helperText}
                        variant="outlined"
                        size="medium"
                        uniqueId={props.question.Id! + '_helperText'}
                        minWidth={800}
                        onChange={input => {
                            const newValue = input.currentTarget.value;
                            updateQuestion({ ...props.question, helperText: newValue })
                        }}
                        required
                        sectionName={props.sectionName}

                    />
                </Grid>
                <Grid item xs>
                    <QuestionTypeSelect
                        {...props}
                        uniqueId={props.question.Id! + '_questionType'}
                        onChange={input => {
                            const newType = input.target.value as unknown as QuestionTypeEnum
                            updateQuestion({ ...props.question, type: newType })
                        }}
                    />
                </Grid>

                {props.question.type === QuestionTypeEnum.CHOICE && (
                    <Grid item xs>
                        <FormControl sx={{ minWidth: 200 }} required>
                            <InputLabel>Vælg typen af svar</InputLabel>
                            <Select
                                label="Vælg typen af svar"
                                onChange={input => {
                                    const v = input.target.value as "text" | "number" | undefined
                                    setVariant(v)
                                    updateQuestion({ ...props.question })
                                }}
                                value={variant}
                                disabled={props.question.options?.length !== 0 && props.question.options !== undefined}
                            >
                                <MenuItem value="text">Tekst</MenuItem>
                                <MenuItem value="number">Tal</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                )}
            </Grid>

            {/*<QuestionEditor {...this.props} value={this.props.question} onChange={this.props.onUpdate} /> */}
            <QuestionEditor
                onChange={props.onUpdate}
                value={props.question}
                variant={variant}
                thresholds={props.getThreshold ? props.getThreshold(props.question) : undefined}
                {...props}
            />

            {renderErrors()}

        </CardContent >
    )

    const Actions = () => (
        <CardActions disableSpacing>
            <Button className="add-child-question" sx={{ padding: 2 }} disabled={props.question.type !== QuestionTypeEnum.BOOLEAN || props.parentQuestion !== undefined} onClick={() => props.addSubQuestionAction!(props.question, true)}>
                <AddCircleOutlineIcon sx={{ paddingRight: 1, width: 'auto' }} />
                Tilføj underspørgsmål
            </Button>

            <Stack direction="row" spacing={2} sx={{ marginLeft: "auto" }}>
                <ButtonGroup variant="text" >
                    <Tooltip title='Slet' placement='right'>
                        <IconButton sx={{ color: '#5D74AC', padding: 2, width: 50 }} className="delete-question" disabled={props.deletable} onClick={() => props.removeQuestionAction(props.question)}>
                            <DeleteOutlineIcon />
                        </IconButton>
                    </Tooltip>
                    <Button disabled={props.parentQuestion !== undefined} sx={{ padding: 2 }} onClick={() => props.addSubQuestionAction!(props.question, false)}>
                        <AddCircleIcon sx={{ paddingRight: 1, width: 'auto' }} />
                        Tilføj nyt spørgsmål
                    </Button>
                </ButtonGroup>
            </Stack>
        </CardActions>
    )

    const parentQuestion = props.parentQuestion;
    const parentQuestionHasGoodType = parentQuestion === undefined || parentQuestion?.type === QuestionTypeEnum.BOOLEAN
    const className = props.parentQuestion !== undefined ? "focusedChildQuestionEditCard" : "focusedParentQuestionEditCard"

    return (
        <Card>
            <Grid key={props.key} container columns={48}>
                <Grid sx={{ display: "flex", justifyContent: "space-between", flexDirection: "column" }} paddingTop={2} paddingBottom={2} className={className} item xs={1} >
                    <Button sx={{ minWidth: 0 }} onClick={() => props.moveItemUp(props.question)}><KeyboardArrowUpIcon fontSize="large" /></Button>
                    <Button sx={{ minWidth: 0 }} onClick={() => props.moveItemDown(props.question)}><KeyboardArrowDownIcon fontSize="large" /></Button>
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
