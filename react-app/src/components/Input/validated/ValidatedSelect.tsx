import { SelectProps, FormControl, InputLabel, Select, FormHelperText } from "@mui/material"
import { Field } from "formik"

interface ValidatedSelect extends Omit<SelectProps, "error"> {
    name: string,
    label: string,
    error?: any
}

export function ValidatedSelect(props: ValidatedSelect) {

    return (

        <FormControl fullWidth>
            <InputLabel error={props.error} id={props.name + "-label"}>{props.label}</InputLabel>
            <Field
                labelId={props.name + "-label"}
                id={props.name}
                error={props.error}
                helperText={props.error}
                as={Select}

                fullWidth
                {...props}
            />
            <FormHelperText error={props.error} sx={{ color: 'text.warning' }}>{props.error}</FormHelperText>
        </FormControl>

    )
}

ValidatedSelect.defaultProps = {
    variant: "outlined",
}