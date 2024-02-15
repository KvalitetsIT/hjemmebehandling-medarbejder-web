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
        console.log("props", this.props)
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

                {/*<QuestionEditor {...this.props} value={this.props.question} onChange={this.props.onUpdate} /> */}
                <QuestionEditor
                
                    value={this.props.question}
                    variant = {this.state.variant}
                    thresholds={this.props.getThreshold ? this.props.getThreshold(this.props.question): undefined}
                    {...this.props}
                />

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
