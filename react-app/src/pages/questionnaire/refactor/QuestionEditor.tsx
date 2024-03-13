import { QuestionTypeEnum } from "@kvalitetsit/hjemmebehandling/Models/Question"
import { FormikErrors, FormikTouched } from "formik"
import { ValidatedAutoComplete } from "../../../components/Input/validated/ValidatedAutocomplete"
import { ValidatedTextField } from "../../../components/Input/validated/ValidatedTextField"
import { MeasurementType, Question } from "./Model"
import { FormProps, FormValues, ValidatedForm } from "./ValidatedForm"
import * as yup from 'yup';
import { CardHeader, Grid, Box, CardContent, FormControl, InputLabel, MenuItem, Select, CardActions, Stack, ButtonGroup, Button, Tooltip, IconButton, Alert, Divider, Card, GridSize } from "@mui/material"
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { useState } from "react"
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

interface QuestionEditorProps extends FormProps<Question> {
    isDeletable?: boolean
    loading?: boolean
    parentQuestion?: Question

    onAddSubQuestion?: () => void
    onDelete?: () => void
    onAdd?: () => void
    onItemDown?: (question: Question) => void
    onItemUp?: (question: Question) => void
}

export const QuestionEditor = (props: QuestionEditorProps) => {

    const [variant, setVariant] = useState<"text" | "number" | undefined>()


    const addSubQuestion = () => {
        const newSubQuestion = {}
        const subQuestions: Question[] = props.subject?.subQuestions ? [...props.subject?.subQuestions, newSubQuestion] : [newSubQuestion]
        const question: Question = { ...props.subject, subQuestions: subQuestions }
        props.onChange ? props.onChange(question) : console.warn("Cannot update question since the 'onChange' property is not set")
    }


    // The validation scheme below should be used to defined all validation rules in terms of a question
    const validationSchema: yup.BaseSchema<FormValues<Question>> = yup.object().shape({

        question: yup.string().required("Text is required"),
        helperText: yup.string().required("Text is required"),
        abbreviation: yup.string().required("Text is required"),
        type: yup.mixed<QuestionTypeEnum>().required("required"),

        variant: yup.mixed<"text" | "number">().required("required"),
        // Additional fields...

    })

    console.log("Subject", props.subject)
    return (
        <ValidatedForm
            subject={{ subject: props.subject }}
            default={{ subject: props.default }}
            onChange={(values: FormValues<Question>) => { props.onChange(values as Question) }}
            scheme={validationSchema}

            onError={function (errors): void {
                throw new Error("Function not implemented.");
            }}
            onSubmit={function (submission): Promise<void> {
                throw new Error("Function not implemented.");
            }}
            onCancel={function (): void {
                throw new Error("Function not implemented.");
            }}
        >
            {(errors, touched, values, setFieldValue) => {

                const e = errors as FormikErrors<FormValues<Question>>
                const t = touched as FormikTouched<FormValues<Question>>


                const Header = () => (
                    <CardHeader subheader={
                        <>
                            <Grid container marginTop={1} columns={12}>
                                <Grid item xs>
                                    <ValidatedTextField
                                        label={"Spørgsmål"}
                                        name={"question"}
                                        error={e.question && t.question ? e.question : undefined}
                                        value={props.subject.question}
                                        onChange={(e) => props.onChange({ ...props.subject, question: e.target.value })}
                                    />
                                </Grid>
                                <Grid item xs="auto">
                                    <ValidatedTextField
                                        label={"Forkortelse til kliniker"}
                                        name={"abbreviation"}
                                        error={e.abbreviation && t.abbreviation ? e.abbreviation : undefined}
                                    />
                                </Grid>
                            </Grid>
                        </>
                    } />
                )

                const Content = () => {

                    const getLabelFrom = (type: QuestionTypeEnum): string => {
                        switch (type) {
                            case QuestionTypeEnum.BOOLEAN:
                                return "Ja / Nej"
                            case QuestionTypeEnum.OBSERVATION:
                                return "Måling"
                            case QuestionTypeEnum.GROUP:
                                return "Målingsgruppe"
                            case QuestionTypeEnum.CHOICE:
                                return "Multiple-choice"
                            default:
                                throw Error("Unsupported question type")
                        }
                    }

                    return (
                        <CardContent>
                            <Grid container spacing={2}>
                                <Grid item xs>
                                    <ValidatedTextField
                                        label={"Hjæpetekst"}
                                        name={"helperText"}
                                        error={e.helperText && t.helperText ? e.helperText : undefined}
                                    />
                                </Grid>
                                <Grid item xs>
                                    <ValidatedAutoComplete
                                        label={"Vælg spørgsmålstype"}
                                        name={"type"}
                                        loading={props.isLoading}
                                        options={Object.keys(QuestionTypeEnum) as QuestionTypeEnum[]}
                                        getOptionLabel={(type: QuestionTypeEnum) => getLabelFrom(type)}
                                        filterOptions={(options) => options.filter((option) => {
                                            try {
                                                getLabelFrom(option);
                                                return true
                                            }
                                            catch (error) {
                                                return false
                                            }
                                        })}
                                        value={values.type}
                                        defaultValue={props.default.type}
                                        noOptionsText={"Der findes ingen spørgsmålstyper"}
                                        error={e.type && t.type ? e.type : undefined}
                                        onChange={(_e, selected) => setFieldValue("type", selected)}
                                    />
                                </Grid>

                                {values.type === QuestionTypeEnum.CHOICE && (
                                    <Grid item xs>
                                        <ValidatedAutoComplete
                                            label={"Vælg typen af svar"}
                                            name={"variant"}
                                            loading={props.isLoading}
                                            options={["number", "text"]}
                                            getOptionLabel={(selected) => selected}
                                            value={variant}
                                            defaultValue={undefined}
                                            noOptionsText={"Der findes ingen mulige typer"}
                                            onChange={(_e, selected) => setVariant(selected as "number" | "text" | undefined)}
                                            disabled={props.subject?.options?.length !== 0 && props.subject?.options !== undefined}
                                            error={e.variant && t.variant ? e.variant : undefined}
                                        />
                                    </Grid>

                                )}
                            </Grid>


                        </CardContent >
                    )
                }

                const Actions = () => (
                    <CardActions disableSpacing>
                        <Button
                            className="add-child-question"
                            sx={{ padding: 2 }}
                            disabled={props.subject?.type !== QuestionTypeEnum.BOOLEAN || props.parentQuestion !== undefined}
                            onClick={() => addSubQuestion()}>
                            <AddCircleOutlineIcon sx={{ paddingRight: 1, width: 'auto' }} />
                            Tilføj underspørgsmål
                        </Button>

                        <Stack direction="row" spacing={2} sx={{ marginLeft: "auto" }}>
                            <ButtonGroup variant="text" >
                                <Tooltip title='Slet' placement='right'>
                                    <IconButton sx={{ color: '#5D74AC', padding: 2, width: 50 }}
                                        className="delete-question"
                                        disabled={props.isDeletable}
                                        onClick={() => { props.onDelete ? props.onDelete() : console.warn("Deleting the question is not possible since the 'onDelete' property haven't been set") }}>
                                        <DeleteOutlineIcon />
                                    </IconButton>
                                </Tooltip>
                                <Button
                                    disabled={props.parentQuestion !== undefined}
                                    sx={{ padding: 2 }}
                                    onClick={() => props.onAdd ? props.onAdd() : console.warn("Could not add question, since the 'onAdd' property haven't been set")}>
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
                        <Grid container columns={48}>
                            <Grid sx={{ display: "flex", justifyContent: "space-between", flexDirection: "column" }} paddingTop={2} paddingBottom={2} className={className} item xs={1} >
                                <Button
                                    sx={{ minWidth: 0 }}
                                    onClick={() => props.onItemUp ? props.subject && props.onItemUp(props.subject) : console.warn("Moving the question cannot be done, since the property 'onItemDown' haven't been set")}
                                >
                                    <KeyboardArrowUpIcon fontSize="large" />
                                </Button>
                                <Button
                                    sx={{ minWidth: 0 }}
                                    onClick={() => props.onItemDown ? props.subject && props.onItemDown(props.subject) : console.warn("Moving the question cannot be done, since the property 'onItemDown' haven't been set")}
                                >
                                    <KeyboardArrowDownIcon fontSize="large" />
                                </Button>
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
        </ValidatedForm >
    )
}


export const defaultQuestion: Question = {}

QuestionEditor.defaultProps = {
    default: defaultQuestion
}


