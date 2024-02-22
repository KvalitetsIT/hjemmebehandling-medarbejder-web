import { OutlinedTextFieldProps, TextField } from "@mui/material"
import { Field } from "formik"

export interface ValidatedTextFieldProps extends Omit<OutlinedTextFieldProps, "error"> {
    name: string,
    label: string,
    error?: string
    resize?: "none" | "both" | "horizontal" | "vertical" | "block" | "inline"
}

export function ValidatedTextField(props: ValidatedTextFieldProps) {

    return (
        <Field
            id={props.name}
            error={props.error}
            helperText={props.error}
            as={TextField}
            fullWidth
            sx={{
                textarea: {
                    resize: props.resize
                }
            }}
            {...props}
        />

    )
}

ValidatedTextField.defaultProps = {
    variant: "outlined",
    type: "text",

}


