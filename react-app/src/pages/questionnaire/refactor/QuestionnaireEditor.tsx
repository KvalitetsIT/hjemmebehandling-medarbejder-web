
import { FormControl, Stack, Button, CircularProgress, Container } from "@mui/material";
import { Formik, Form, FormikTouched, FormikErrors, FormikValues } from "formik";
import { t } from "i18next";

import * as yup from 'yup';

import 'dayjs/locale/fr';
import 'dayjs/locale/ru';
import 'dayjs/locale/de';
import 'dayjs/locale/ar-sa';
import 'dayjs/locale/da';
import { ReactNode, useEffect, useState } from "react";
import { ValidatedTextField } from "../../../components/Input/validated/ValidatedTextField";
import { TypedSchema } from "yup/lib/util/types";
import { AnySchema, SchemaOf } from "yup";
import { CategoryEnum } from "@kvalitetsit/hjemmebehandling/Models/CategoryEnum";
import { ValidatedSelect } from "../../../components/Input/validated/ValidatedSelect";
import { ValidatedAutoComplete } from "../../../components/Input/validated/ValidatedAutocomplete";
import { QuestionTypeEnum } from "@kvalitetsit/hjemmebehandling/Models/Question";



export const QuestionEditor = (props: QuestionEditor) => {


    const validationSchema: yup.BaseSchema<Question> = yup.object().shape({
        question: yup.string().required("Text is required"),
        helperText: yup.string().required("Text is required"),
        abbreviation: yup.string().required("Text is required"),
        measurementType: yup.mixed<MeasurementType>().required("required")
    })

    if (props.isLoading) return (<></>)
    return (
        <ValidatedForm
            {...props}
            subject={props.question}
            default={props.default}
            scheme={validationSchema}
            onError={function (errors: FormikErrors<{ subject: any; }>): void {
                throw new Error("Function not implemented.");
            }}
        >
            {(errors, touched, values, setFieldValue) => {

                let e = errors as FormikErrors<Question>
                let t = touched as FormikTouched<Question>

                return (
                    <>
                        <ValidatedTextField
                            label={"Question"}
                            name={"question"}
                            error={e.question && t.question ? e.question : undefined}
                        />
                        <ValidatedTextField
                            label={"HelperText"}
                            name={"helperText"}
                            error={e.helperText && t.helperText ? e.helperText : undefined}
                        />
                        <ValidatedTextField
                            label={"abbreviation"}
                            name={"abbreviation"}
                            error={e.abbreviation && t.abbreviation ? e.abbreviation : undefined}
                        />
                        <ValidatedSelect
                            label={"Measurement Type"}
                            name={"measurementType"}

                        />
                    </>

                )
            }}
        </ValidatedForm>
    )
}
const defaultQuestion: Question = {}

QuestionEditor.defaultProps = {
    default: defaultQuestion
}

export const Test = () => {

    let [questionnaire, setQuestionnaire] = useState<Questionnaire>({ name: "", questions: [{ helperText: "", abbreviation: "", question: "" }] })

    return (
        <>
            <QuestionniareEditor
                subject={questionnaire}
                onChange={setQuestionnaire}
                onSubmit={function (submission: Questionnaire): Promise<void> {
                    throw new Error("Function not implemented.");
                }}
                onCancel={function (): void {
                    throw new Error("Function not implemented.");
                }}
                onError={function (errors: FormikErrors<{ subject: Questionnaire; }>): void {
                    throw new Error("Function not implemented.");
                }}
            />


        </>
    )
}


interface Questionnaire {
    name?: string
    questions?: Question[]
}



interface QuestionnaireEditorProps extends FormProps<Questionnaire> {
    loading?: boolean
}

export const QuestionniareEditor = (props: QuestionnaireEditorProps) => {


    const validationSchema: yup.BaseSchema<Questionnaire> = yup.object().shape({
        name: yup.string().required("Name is required"),
        questions: yup.array().required()
    })



    const updateQuestionnaire = (questionnaire: Questionnaire) => {
        props.onChange && props.onChange(questionnaire)
    }

    const updateQuestion = (question: Question, index: number) => {

        let questionnaire = props.subject

        if (questionnaire?.questions) questionnaire.questions[index] = question

        updateQuestionnaire(questionnaire!) // fix the "!"
    }

    if (props.isLoading) return (<></>)
    return (
        <ValidatedForm
            {...props}
            scheme={validationSchema}
            default={props.default}
            onError={function (errors: FormikErrors<{ subject: any; }>): void {
                throw new Error("Function not implemented.");
            }}
        >
            {(errors, touched, values, setFieldValue) => {

                const e = errors as FormikErrors<Questionnaire>
                const t = touched as FormikTouched<Questionnaire>

                return (<>

                    <ValidatedTextField
                        label={"Name"}
                        name={"name"}
                        error={e.name && t.name ? e.name : undefined}
                    />

                    {props.subject?.questions?.map((question, index) => (
                        <QuestionEditor
                            onChange={(question) => updateQuestion(question, index)}
                            onSubmit={function (submission: Question): Promise<void> {
                                throw new Error("Function not implemented.");
                            }}
                            onError={function (errors: FormikErrors<{ subject: Question; }>): void {
                                throw new Error("Function not implemented.");
                            }}
                            onCancel={function (): void {
                                throw new Error("Function not implemented.");
                            }}
                            question={question!}
                        />
                    ))}

                </>)
            }}
        </ValidatedForm>
    )


}

const defaultQuestionnaire: Questionnaire = {
    name: "",
    questions: []
}

QuestionniareEditor.defaultProps = {
    default: defaultQuestionnaire
}

