import { FormControl } from "@mui/material"
import { FormikErrors, FormikTouched, FormikValues, Formik, Form } from "formik"
import { BaseSchema } from "yup"
import { LoadingSmallComponent } from "../../../components/Layout/LoadingSmallComponent"
import { LoadingBackdropComponent } from "../../../components/Layout/LoadingBackdropComponent"
import { Loading } from "../../../components/Layout/Loading"


export type FormValues<T> = Partial<T> & Record<string, any>


export interface FormProps<T> extends SharedFormProps<T> {
    /** The object of interrest */
    subject: T

    /** The fallback properties of the subject */
    default: T

    /** The callback which is envoked if the subject is changed */
    onChange: (item: T) => void

    /** The callback which is envoked if the submit button is clicked */
    onSubmit: (submission: T) => Promise<void>
}


interface BaseFormProps<T> extends SharedFormProps<T> {
    /** This field is representing both the subject and the rest of the fields relevant to the form */
    subject?: FormValues<T>

    /** The default value for both the subject and the rest of the fields relevant to the form */
    default: FormValues<T>

    /** The callback which is envoked if any field was changed */
    onChange?: (subject: FormValues<T>) => void

    /** A callback which is used to render the "actual" form */
    children?: (
        errors: FormikErrors<FormValues<T>>,
        touched: FormikTouched<FormValues<T>>,
        values: FormValues<T>,
        setFieldValue: (field: string, value: any, shouldValidate?: boolean | undefined) => Promise<void | FormikErrors<{ subject: T }>>
    ) => React.ReactNode | React.ReactNode

    /** The callback which is envoked if the submit button is clicked */
    onSubmit: (submission: FormValues<T>) => Promise<void>
}


interface SharedFormProps<T> {
    isLoading?: boolean
    /** The scheme used to validate the data */
    scheme?: BaseSchema<FormValues<T>>

    /** Callback if the form was "canceled" */
    onCancel: () => void,

    /** Callback if any error were experienced */
    onError: (errors: FormikErrors<FormValues<T>>) => void,
}

// This component is not supposed to be used directly but instead agregated by another component which handles the domain specifics
export function ValidatedForm<T extends FormikValues>(props: BaseFormProps<T>) {

    return (
        <FormControl fullWidth>
            <Formik
                initialValues={props.subject ?? props.default}
                onSubmit={(values, formik) => values.subject && props.onSubmit(values).then(() => formik.resetForm())}
                validationSchema={props.scheme}
                validateOnChange
            // enableReinitialize
            >
                {({ errors, touched, values, handleChange, setFieldValue, isValidating }) => {

                    return (
                        <Form>

                            {
                                // Forwards the formik fields to the underlying form/children
                                props.children && props.children(errors, touched, values, setFieldValue)
                            }


                            {/*
                            <Stack spacing={2} direction={"row"}>
                                <Button
                                    type={"submit"}
                                    variant="contained"
                                    disabled={props.isLoading}
                                    fullWidth={true}
                                >
                                    {props.isLoading ? <CircularProgress color={"inherit"} size={"1.5em"}></CircularProgress> : <>Gem</>}
                                </Button>
                                <Button fullWidth={true} onClick={props.onCancel} variant="outlined">{t("Cancel") + ""}</Button>
                            </Stack>
                            */}

                        </Form>
                    )
                }}
            </Formik>
        </FormControl >
    )
}





