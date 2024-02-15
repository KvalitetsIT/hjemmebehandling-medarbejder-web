import { InvalidInputModel } from "@kvalitetsit/hjemmebehandling/Errorhandling/ServiceErrors/InvalidInputError"
import { CategoryEnum } from "@kvalitetsit/hjemmebehandling/Models/CategoryEnum"
import { FormControl, Stack, IconButton, Button, Tooltip } from "@mui/material"
import { Option } from "@kvalitetsit/hjemmebehandling/Models/Question"

import { useState } from "react"
import { CategorySelect } from "../../../components/Input/CategorySelect"
import { TextFieldValidation } from "../../../components/Input/TextFieldValidation"
import { EditorProps } from "./editor"

import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddCircleIcon from '@mui/icons-material/AddCircle';

export interface MultipleChoiceEditorProps extends EditorProps<Array<Option>> {
    variant?: "text" | "number",
}

export const MultipleChoiceEditor = (props: MultipleChoiceEditorProps) => {

    
    let [options, setOptions] = useState(props.value?.map(option => {
        if (option.triage != CategoryEnum.BLUE) {
            return ({
                ...option,
                // Determines if the option were originally read from the backend or if it is recently added
                original: true
            })
        } else return { ...option, original: false }
    }))

    const updateOption = (index: number, item: Option) => {
        setOptions(prevOptions => {
            if (prevOptions) prevOptions[index] = { ...prevOptions[index], ...item };
            triggerOnChange(prevOptions);
            return prevOptions;
        })
    }

    const addItem = () => {
        setOptions(prevOptions => {
            const emptyItem = { option: "", comment: "", triage: CategoryEnum.BLUE, original: false };
            const newOptions = [...prevOptions ?? [], emptyItem];
            triggerOnChange(newOptions);
            return newOptions;
        });
    }

    const deleteItem = (i: number) => {
        setOptions(prevOptions => {
            const newOptions = prevOptions?.slice(0, i).concat(prevOptions.slice(i + 1));
            triggerOnChange(newOptions);
            return newOptions;
        });
    }

    const triggerOnChange = (options: {
        original: boolean;
        option: string;
        comment: string;
        triage: CategoryEnum;
    }[] | undefined) => {
        let state = options?.map(option => option as Option) ?? [];

        props.onChange && props.onChange(state);
    }

    const validate = async (index: number, value: string, options: {
        original: boolean;
        option: string;
        comment: string;
        triage: CategoryEnum;
    }[] | undefined): Promise<InvalidInputModel[]> => {

        const optionInUse = !(options?.slice(0, index).every(option => option.option !== value))

        let errors: InvalidInputModel[] = []

        if (value.length <= 0) errors.push(new InvalidInputModel("question", "Svarmulighed er endnu ikke udfyldt"))
        if (optionInUse) errors.push(new InvalidInputModel("question", "Svarmuligheden er allerede i brug"))

        return errors
    }

    
    return (
        <>
            <FormControl >
                {options && options.map((item, i) => (
                    <>
                        <Stack minWidth={800} direction={"row"} spacing={2} marginTop={2} width={"100%"}>
                            <TextFieldValidation
                                label={"Svarmulighed"}
                                uniqueId={'svarmulighed_' + i}
                                variant="outlined"
                                size="medium"
                                onChange={(x) => {
                                    updateOption(i, { ...item, option: x.target.value })

                                }}
                                type={props.variant}
                                value={item.option}
                                onValidation={props.onValidation}
                                validate={(value: string) => validate(i, value, options)}
                                sectionName={'questionnaire'}

                            />

                            <TextFieldValidation
                                label={"Kommentar"}
                                uniqueId={"kommentar_" + i}
                                size="medium"
                                variant="outlined"
                                onChange={(x) => updateOption(i, { ...item, comment: x.target.value })}
                                value={item.comment}
                            />

                            <CategorySelect
                                // sectionName={this.props.sectionName}
                                // disabled={this.props.disabled}
                                label="Triagering"
                                disabled={item.original}
                                category={item.triage}
                                onChange={(newCategory) => { updateOption(i, { ...item, triage: newCategory }); }}
                                // onValidation={this.props.onValidation}
                                uniqueId={"category_" + i}
                            />

                            <Tooltip title='Slet' placement='right'>
                                <IconButton onClick={() => deleteItem(i)} sx={{ width: 50 }}>
                                    <DeleteOutlineIcon />
                                </IconButton>
                            </Tooltip>

                        </Stack>
                    </>
                ))}

                <Button sx={{ marginTop: 2, width: 150 }} disabled={props.variant == undefined } onClick={() => addItem()}>
                    <AddCircleIcon sx={{ paddingRight: 1 }} />
                    Tilføj svarmulighed
                </Button>
            </FormControl>
        </>
    )
}