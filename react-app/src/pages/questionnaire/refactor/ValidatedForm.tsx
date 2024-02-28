import { FormControl } from "@mui/material"
import { FormikErrors, FormikTouched, FormikValues, Formik, Form } from "formik"

export interface FormProps<T> {

    subject?: T
    isLoading?: boolean
    default: T
    scheme?: yup.BaseSchema<T>
    onSubmit: (submission: T) => Promise<void>
    onCancel: () => void,
    onError: (errors: FormikErrors<{ subject: T }>) => void,
    onChange?: (subject: T) => void
    children?: (
        errors: FormikErrors<T>,
        touched: FormikTouched<T>,
        values: T,
        setFieldValue: (field: string, value: any, shouldValidate?: boolean | undefined) => Promise<void | FormikErrors<{ subject: T }>>
    ) => React.ReactNode | React.ReactNode

}

// This component is not supposed to be used directly but instead agregated by another component which handles the domain specifics
export function ValidatedForm<T extends FormikValues>(props: FormProps<T>) {

    return (
        <FormControl fullWidth>
            <Formik

                initialValues={props.subject ?? props.default}
                onSubmit={(values, formik) => values.subject && props.onSubmit(values.subject).then(() => formik.resetForm())}
                validationSchema={props.scheme}
                enableReinitialize
            >
                {({ errors, touched, values, handleChange, setFieldValue }) => {

                    return (
                        <Form>
                            {props.children && props.children(errors, touched, values, setFieldValue)}
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





