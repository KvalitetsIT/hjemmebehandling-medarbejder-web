
import { FormControl, Stack, Button, CircularProgress, Container } from "@mui/material";
import { Formik, Form, FormikTouched, FormikErrors } from "formik";
import { t } from "i18next";

import * as yup from 'yup';

import 'dayjs/locale/fr';
import 'dayjs/locale/ru';
import 'dayjs/locale/de';
import 'dayjs/locale/ar-sa';
import 'dayjs/locale/da';
import { ReactNode } from "react";
import { ValidatedTextField } from "../../../components/Input/ValidatedTextField";
import { TypedSchema } from "yup/lib/util/types";
import { AnySchema, SchemaOf } from "yup";

export interface FormProps<T> {

    subject?: T
    isLoading?: boolean
    default?: T
    scheme?: yup.BaseSchema<{ subject: T }>

    onSubmit: (submission: T) => Promise<void>
    onCancel: () => void,
    onError: (errors: FormikErrors<{ subject: T }>) => void,

    children?: (
        errors: FormikErrors<{ subject: T }>,
        touched: FormikTouched<{ subject: T }>,
        values: { subject: T | undefined },
        setFieldValue: (field: string, value: any, shouldValidate?: boolean | undefined) => Promise<void | FormikErrors<{ subject: T }>>
    ) => React.ReactNode | React.ReactNode

}

// This component is not supposed to be used directly but instead agregated by another component which handles the domain specifics
function ValidatedForm<T>(props: FormProps<T>) {
    return (
        <FormControl fullWidth>
            <Formik
                initialValues={{ subject: props.subject ?? props.default }}
                onSubmit={(values, formik) => values.subject && props.onSubmit(values.subject).then(() => formik.resetForm())}
                validationSchema={props.scheme}
                enableReinitialize
            >
                {({ errors, touched, values, handleChange, setFieldValue }) => {
                    return (
                        <Form>
                            {props.children && props.children(errors, touched, values, setFieldValue)}
                            <Stack spacing={2} direction={"row"}>
                                <Button
                                    type={"submit"}
                                    variant="contained"
                                    disabled={props.isLoading}
                                    fullWidth={true}
                                >
                                    {props.isLoading ? <CircularProgress color={"inherit"} size={"1.5em"}></CircularProgress> : <>{t("Submit")}</>}
                                </Button>
                                <Button fullWidth={true} onClick={props.onCancel} variant="outlined">{t("Cancel") + ""}</Button>
                            </Stack>

                        </Form>
                    )
                }}
            </Formik>
        </FormControl >
    )
}





interface Question {
    text?: string
}

interface QuestionEditor extends FormProps<Question> {
    loading?: boolean
    question: Question
}

export const QuestionEditor = (props: QuestionEditor) => {
    const validationSchema: yup.BaseSchema<{ subject: Question }> = yup.object().shape({
        subject: yup.object().shape({
            text: yup.string().required(t("Text") + " " + t("is required")),
        }),
    })

    const defaultValues: Question = {
        text: ""
    }

    if (props.isLoading) return (<></>)
    return (
        <ValidatedForm
            {...props}
            subject={props.question}
            default={defaultValues}
            scheme={validationSchema}
            onError={function (errors: FormikErrors<{ subject: any; }>): void {
                throw new Error("Function not implemented.");
            }}
        >
            {(errors, touched, values, setFieldValue) => (
                <ValidatedTextField
                    label={"Question"}
                    name={"text"}
                    error={errors.subject?.text && touched.subject?.text ? errors.subject.text : undefined}
                />
            )}
        </ValidatedForm>
    )
}



export const Test = () => (
    <QuestionEditor
        question={{ text: "test" }}
        onSubmit={function (submission: Question): Promise<void> {
            throw new Error("Function not implemented.");
        }}
        onCancel={function (): void {
            throw new Error("Function not implemented.");
        }}
        onError={function (errors: FormikErrors<{ subject: Question; }>): void {
            throw new Error("Function not implemented.");
        }} />
)






/*
interface Questionnaire {
    name: string
    questions: Question[]
}



interface QuestionnaireEditorProps extends FormProps<Questionnaire> {
    loading?: boolean
}

export const QuestionniareEditor = (props: QuestionnaireEditorProps) => {

    const validationSchema: SchemaOf<{ subject: Questionnaire }> = yup.object().shape({
        subject: yup.object().shape({
            name: yup.string().required(t("Name") + " " + t("is required")),
            questions: yup.array().required()
        }),
    })

    const defaultValues: Questionnaire = {
        name: "",
        questions: []
    }

    if (props.isLoading) return (<></>)
    return (
        <ValidatedForm
            {...props}
            default={defaultValues}
            scheme={validationSchema}
            onError={function (errors: FormikErrors<{ subject: any; }>): void {
                throw new Error("Function not implemented.");
            }}
        >
            {(errors, touched, values, setFieldValue) => (<>

                <ValidatedTextField
                    label={"Name"}
                    name={"name"}
                    error={errors.subject?.name && touched.subject?.name ? errors.subject.name : undefined}
                />

                {props.subject.questions.map(question => (
                    <QuestionEditor
                        subject={question}
                        onSubmit={
                            function (submission: Question): Promise<void> {
                                throw new Error("Function not implemented.");
                            }}
                        onCancel={function (): void {
                            throw new Error("Function not implemented.");
                        }}
                        children={function (errors: FormikErrors<{ subject: Question; }>, touched: FormikTouched<{ subject: Question; }>, values: { subject: Question; }, setFieldValue: (field: string, value: any, shouldValidate?: boolean | undefined) => Promise<void | FormikErrors<{ subject: Question; }>>): ReactNode {
                            throw new Error("Function not implemented.");
                        }}

                        scheme={scheme}
                        onError={function (errors: FormikErrors<{ subject: Question; }>): void {
                            throw new Error("Function not implemented.");
                        }}
                    />
                ))}

            </>)}

        </ValidatedForm>
    )
}



export const TestPage = () => {
    return
    <Container>
        <QuestionniareEditor
            questionnaire={undefined}
            subject={undefined}
            onSubmit={function (submission: Questionnaire): Promise<void> {
                throw new Error("Function not implemented.");
            }} onCancel={function (): void {
                throw new Error("Function not implemented.");
            }} children={function (errors: FormikErrors<{ subject: Questionnaire; }>, touched: FormikTouched<{ subject: Questionnaire; }>, values: { subject: Questionnaire; }, setFieldValue: (field: string, value: any, shouldValidate?: boolean | undefined) => Promise<void | FormikErrors<{ subject: Questionnaire; }>>): ReactNode {
                throw new Error("Function not implemented.");
            }} default={undefined} scheme={undefined} onError={function (errors: FormikErrors<{ subject: Questionnaire; }>): void {
                throw new Error("Function not implemented.");
            }} />
    </Container>

}


*/