
import { FormControl, Stack, Button, CircularProgress, Container, Grid, CardHeader, Divider, CardContent, Typography, Alert, Card, TableCell, TableRow, TableContainer, Table, CardActions } from "@mui/material";
import { Formik, Form, FormikTouched, FormikErrors, FormikValues } from "formik";
import { t } from "i18next";

import * as yup from 'yup';

import 'dayjs/locale/fr';
import 'dayjs/locale/ru';
import 'dayjs/locale/de';
import 'dayjs/locale/ar-sa';
import 'dayjs/locale/da';
import { ReactNode, useContext, useEffect, useState } from "react";
import { ValidatedTextField } from "../../../components/Input/validated/ValidatedTextField";
import { TypedSchema } from "yup/lib/util/types";
import { AnySchema, SchemaOf } from "yup";
import { ValidatedSelect } from "../../../components/Input/validated/ValidatedSelect";
import { ValidatedAutoComplete } from "../../../components/Input/validated/ValidatedAutocomplete";
import { FormProps, FormValues, ValidatedForm } from "./ValidatedForm";
import { MeasurementType, Question, Questionnaire } from "./Model";
import { QuestionTypeEnum } from "@kvalitetsit/hjemmebehandling/Models/Question";
import { v3 } from "uuid";
import { QuestionEditor, defaultQuestion } from "./QuestionEditor";
import { Prompt, useParams } from "react-router-dom";
import ApiContext from "../../_context";
import { IQuestionnaireService } from "../../../services/interfaces/IQuestionnaireService";
import { IQuestionAnswerService } from "../../../services/interfaces/IQuestionAnswerService";
import { CallToActionCard } from "../../../components/Cards/CallToActionCard";
import { ConfirmationButton } from "../../../components/Input/ConfirmationButton";
import { BaseModelStatus } from "@kvalitetsit/hjemmebehandling/Models/BaseModelStatus";


interface QuestionnaireEditorProps extends FormProps<Questionnaire> {
    loading?: boolean
}

export const QuestionniareEditor = (props: QuestionnaireEditorProps) => {

    const contextType = ApiContext

    const api = useContext(ApiContext)
    const questionnaireService: IQuestionnaireService = api.questionnaireService;
    const questionAnswerService: IQuestionAnswerService = api.questionAnswerService;

    // This is the path parameters
    const { questionnaireId } = useParams<{ questionnaireId: string }>()

    const editMode = questionnaireId ? true : false

    const validationSchema: yup.BaseSchema<FormValues<Questionnaire>> = yup.object().shape({

        name: yup.string().required("Name is required"),
        questions: yup.array().required()

        // additional fields
    })

    const updateQuestionnaire = (questionnaire: Questionnaire) => {
        props.onChange && props.onChange(questionnaire)
    }

    const updateQuestion = (question: Question, index: number) => {
        console.log("Update Question")
        let questionnaire = props.subject as Questionnaire

        if (questionnaire?.questions) questionnaire.questions[index] = question

        updateQuestionnaire(questionnaire!) // fix the "!"
    }


    if (props.isLoading) return (<></>)

    const parentQuestions = props.subject?.questions?.filter(q => q as Question && q.enableWhen?.questionId == undefined) ?? []

    return (
        <ValidatedForm
            subject={{ subject: props.subject }}
            default={{ subject: props.default }}

            scheme={validationSchema}

            onSubmit={function (submission: Partial<Questionnaire> & Record<string, any>): Promise<void> {
                throw new Error("Function not implemented.");
            }}
            onCancel={function (): void {
                throw new Error("Function not implemented.");
            }} onError={function (errors: FormikErrors<FormValues<Questionnaire>>): void {
                throw new Error("Function not implemented.");
            }}        >
            {(errors, touched, values, setFieldValue) => {

                const e = errors as FormikErrors<FormValues<Questionnaire>>
                const t = touched as FormikTouched<FormValues<Questionnaire>>


                const getChildQuestions = (questionId: string) => {
                    let toReturn = props.subject?.questions?.filter(q => q as Question && q.enableWhen?.questionId != undefined)
                    if (questionId) {
                        toReturn = toReturn?.filter(q => q as Question && q.enableWhen?.questionId == questionId)
                    }
                    return toReturn ?? []
                }

                const deleteQuestion = (index: number) => {
                    console.log("=====================================0")
                    console.log("Deleting: ", index)
                    console.log("deleting:", props.subject.questions && props.subject.questions[index])

                    if (props.subject.questions == undefined || index > props.subject.questions?.length) { console.error("index out of bound"); return }

                    let questions = [...props.subject.questions];

                    //let deleted = questions?.splice(index, 1)

                    //console.log("deleted", deleted)
                    console.log("questions", questions)

                    updateQuestionnaire({ ...props.subject })
                }


                console.log("questionnssssss", props.subject.questions)
                return (<>
                    <>
                        <Prompt
                            when={true}
                            message={() => "Du har ikke gemt eventuelle ændringerne - vil du fortsætte?"}
                        />
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Card>
                                    <CardHeader subheader={<Typography variant="h6">Spørgeskema</Typography>} />
                                    <Divider />
                                    <CardContent>

                                        <ValidatedTextField
                                            label={"Name"}
                                            name={"name"}
                                            error={e.name && t.name ? e.name : undefined}
                                        />
                                    </CardContent>
                                </Card>
                            </Grid>
                            {editMode ?
                                <Grid item xs={12}>
                                    <Alert severity="warning"><strong>OBS!</strong> Du kan rediger <i>spørgsmålstype</i>, <i>målingstype</i> eller <i>triagering</i>, ved at oprette spørgsmålet på ny og slette det oprindelige. </Alert>
                                </Grid>
                                : null}

                            {parentQuestions?.map((question: Question, i) => {
                                const childQuestions = getChildQuestions(question.Id!)

                                return (
                                    <>
                                        <Grid item xs={12}>

                                            <QuestionEditor
                                                key={"parentQuestion_" + i}
                                                subject={question}
                                                onSubmit={function (submission: Question): Promise<void> {
                                                    throw new Error("Function not implemented.");
                                                }}
                                                onCancel={function (): void {
                                                    throw new Error("Function not implemented.");
                                                }}
                                                onError={function (errors: FormikErrors<Question>): void {
                                                    throw new Error("Function not implemented.");
                                                }}
                                                onChange={(q) => updateQuestion(q, i)}
                                                onDelete={() => deleteQuestion(i)}
                                                onAdd={() => {
                                                    console.log("index", i)

                                                    let questions = props.subject.questions ?? [];
                                                    //questions.splice(i+1, 0, defaultQuestion)
                                                    questions = [...questions?.slice(0, i + 1), defaultQuestion, ...questions?.slice(i + 1)]

                                                    console.log("q", questions)

                                                    updateQuestionnaire({ ...props.subject as Questionnaire, questions: questions })
                                                }}
                                            />
                                        </Grid>
                                        {childQuestions?.map((childQuestion, j) => {
                                            return (
                                                <>
                                                    <Grid item xs={1} alignSelf="center" textAlign="center">
                                                    </Grid>
                                                    <Grid item xs={11}>
                                                        <QuestionEditor
                                                            key={"childQuestion_" + i + "_" + j}
                                                            subject={childQuestion}
                                                            onError={function (errors: FormikErrors<Question>): void {
                                                                throw new Error("Function not implemented.");
                                                            }}
                                                            onSubmit={function (submission: Question): Promise<void> {
                                                                throw new Error("Function not implemented.");
                                                            }}
                                                            onCancel={function (): void {
                                                                throw new Error("Function not implemented.");
                                                            }} onChange={function (item: Question): void {
                                                                throw new Error("Function not implemented.");
                                                            }}

                                                        />

                                                    </Grid>
                                                </>
                                            )
                                        })}
                                    </>
                                )
                            })}
                            <Grid item xs={12}>
                                {/* <CallToActionCard allQuestions={allQuestions} callToActionQuestion={callToAction!} sectionName={CreateQuestionnairePageF.sectionName} onValidation={onValidation} />  */}
                            </Grid>
                            <Grid item xs={12}>
                                <Card>
                                    <CardContent>
                                        <Typography>Hvis du ønsker at arbejde videre på spørgeskemaet, skal du gemme som kladde og kan fortsætte oprettelsen på et senere tidspunkt. Er du derimod færdig med spørgeskemaet, skal du blot trykke gem.</Typography>
                                    </CardContent>
                                    <Divider />
                                    <TableContainer component={Card}>
                                        <Table sx={{ width: '100%' }} aria-label="simple table">
                                            <TableRow>
                                                <TableCell align="left">
                                                    {editMode ?
                                                        <CardActions sx={{ display: "flex", justifyContent: "left" }}>
                                                            <ConfirmationButton
                                                                color="error"
                                                                variant="outlined"
                                                                title={"Inaktiver spørgeskema"}
                                                                action={async () => { throw new Error("not Implemented") }}
                                                                skipDialog={false}
                                                                buttonText={"Inaktivere spørgskema"}
                                                                contentOfCancelBtn={"Fortryd"}
                                                                contentOfDoActionBtn={"Inaktiver"}                                                    >
                                                                <Typography>Ønsker du at inaktivere spørgskemaet {props.subject?.name}? </Typography>
                                                            </ConfirmationButton>
                                                        </CardActions>
                                                        :
                                                        null
                                                    }
                                                </TableCell>
                                                <TableCell align="right">
                                                    <CardActions sx={{ display: "flex", justifyContent: "right" }}>
                                                        <Button className='draft-button'
                                                            variant="contained"
                                                            disabled={(props.subject?.id !== undefined) && (props.subject?.status !== undefined && (props.subject.status !== BaseModelStatus.DRAFT))}
                                                            onClick={() => {
                                                                throw new Error("Not implemented")
                                                            }}
                                                        >Gem som kladde</Button>
                                                        <ConfirmationButton
                                                            color="primary"
                                                            variant="contained"
                                                            contentOfDoActionBtn="Forstået"
                                                            contentOfCancelBtn="Fortryd"
                                                            action={async () => {
                                                                throw new Error("Not implemented")
                                                            }}

                                                            skipDialog={false}
                                                            buttonText={'Gem og aktivér'}
                                                            title="Definer alarmgrænser"
                                                        >
                                                            <Typography>Alarmgrænser skal defineres for den/de nye målinger, der er tilføjet, ellers vil der ikke blive triageret på rød, gul, grøn. Alarmgrænserne defineres i den/de patiengrupper, hvor spørgeskemaet er tilføjet.</Typography>
                                                        </ConfirmationButton>
                                                    </CardActions>
                                                </TableCell>
                                            </TableRow>
                                        </Table>
                                    </TableContainer>
                                </Card>
                            </Grid>
                        </Grid>
                        {/*errorToast ?? <></>*/}
                    </>
                </>)
            }}
        </ValidatedForm>
    )


}

const defaultQuestionnaire: Questionnaire = {
    name: "",
    questions: [],
    status: BaseModelStatus.DRAFT
}

QuestionniareEditor.defaultProps = {
    default: defaultQuestionnaire
}



export const Test = () => {

    let [questionnaire, setQuestionnaire] = useState<Questionnaire>({ ...defaultQuestionnaire, questions: [{}, {}] })


    return (
        <>
            <QuestionniareEditor
                key={"questionnaire" + questionnaire.id}
                subject={questionnaire}
                onChange={(questionnaire) => { setQuestionnaire(questionnaire); console.log("questionnaire", questionnaire); console.log(questionnaire) }}
                onSubmit={function (submission: Questionnaire): Promise<void> {
                    throw new Error("Function not implemented.");
                }}
                onCancel={function (): void {
                    throw new Error("Function not implemented.");
                }}
                onError={function (errors: FormikErrors<Questionnaire>): void {
                    throw new Error("Function not implemented.");
                }}
            />


        </>
    )
}

