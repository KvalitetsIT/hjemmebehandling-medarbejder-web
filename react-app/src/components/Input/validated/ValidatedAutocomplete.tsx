import { AutocompleteProps, Autocomplete, TextFieldProps, TextField } from "@mui/material"
import { Field } from "formik"


interface ValidatedAutocompleProps<
    T,
    Multiple extends boolean | undefined,
    DisableClearable extends boolean | undefined,
    FreeSolo extends boolean | undefined
> extends Omit<AutocompleteProps<T, Multiple, DisableClearable, FreeSolo>, "getOptionLabel"> {
    T: any,
    name: string,
    label: string,
    error: any
    variant: "standard" | "filled" | "outlined" | undefined
    getOptionLabel?: (option: T) => string | undefined,
}

export function ValidatedAutoComplete<
    T,
    Multiple extends boolean | undefined,
    DisableClearable extends boolean | undefined,
    FreeSolo extends boolean | undefined
>(props: Partial<ValidatedAutocompleProps<T, Multiple, DisableClearable, FreeSolo>>) {
    return (
        <Field
            as={Autocomplete}
            renderInput={(params: JSX.IntrinsicAttributes & TextFieldProps) => (
                <TextField
                    {...params}
                    variant={props.variant}
                    label={props.label}
                    error={props.error}
                    helperText={props.error}
                    name={props.name}
                />
            )}

            getOptionLabel={props.getOptionLabel}

            {...props}
        />
    )
}
ValidatedAutoComplete.defaultProps = {
    variant: "outlined"
}