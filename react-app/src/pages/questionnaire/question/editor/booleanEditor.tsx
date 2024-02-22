import { CategoryEnum } from "@kvalitetsit/hjemmebehandling/Models/CategoryEnum"
import { ThresholdCollection } from "@kvalitetsit/hjemmebehandling/Models/ThresholdCollection"
import { ThresholdOption } from "@kvalitetsit/hjemmebehandling/Models/ThresholdOption"
import { TableContainer, Table, TableRow, TableCell } from "@mui/material"

import { EditorProps } from "./editor"
import { CategorySelect } from "../../../../components/Input/CategorySelect"

export interface BooleanThresholdEditorProps extends EditorProps<ThresholdCollection> { }


export const BooleanThresholdEditor = (props: BooleanThresholdEditorProps) => {

    const thresholdCollection = props.thresholds

    function updateCategory(category: CategoryEnum, option: ThresholdOption, index: number) {
        let updatedOptions = thresholdCollection?.thresholdOptions
        updatedOptions![index] = { ...option, category: category }
        const collection: ThresholdCollection = { ...thresholdCollection, questionId: thresholdCollection?.questionId!, thresholdOptions: updatedOptions }
        props.onChange && props.onChange(collection)
    }


    return (
        <TableContainer>
            <Table>
                {thresholdCollection && thresholdCollection.thresholdOptions?.map((option, index) => {
                    return (
                        <TableRow>
                            <TableCell>
                                {option.option === "true" ? "Ja" : "Nej"}
                            </TableCell>
                            <TableCell>
                                <CategorySelect
                                    {...props}
                                    category={option.category}
                                    onChange={(category) => updateCategory(category, option, index)}
                                    uniqueId={thresholdCollection?.questionId! + option.option}
                                />
                            </TableCell>
                        </TableRow>
                    )
                })}
            </Table>
        </TableContainer>
    )
}
