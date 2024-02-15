import { InvalidInputModel } from "@kvalitetsit/hjemmebehandling/Errorhandling/ServiceErrors/InvalidInputError"
import { CategoryEnum } from "@kvalitetsit/hjemmebehandling/Models/CategoryEnum"
import { MeasurementType } from "@kvalitetsit/hjemmebehandling/Models/MeasurementType"
import { Question, QuestionTypeEnum, Option } from "@kvalitetsit/hjemmebehandling/Models/Question"
import { ThresholdCollection } from "@kvalitetsit/hjemmebehandling/Models/ThresholdCollection"
import { BooleanThresholdEditor } from "./booleanEditor"
import { MultipleChoiceEditor } from "./multipleChoiceEditor"
import { ObservationEditor } from "./observationEditor"
import { useState } from "react"
import { Button, Typography } from "@mui/material"

export interface EditorProps<T> {
    disabled: boolean
    sectionName?: string
    thresholds?: ThresholdCollection
    allMeasurementTypes: MeasurementType[]
    value?: T

    onChange?: (value: T) => void
    onValidation: (uniqueId: string, error: InvalidInputModel[]) => void
}


export interface QuestionEditorProps extends EditorProps<Question> { variant: "text" | "number" | undefined }

export const QuestionEditor = (props: QuestionEditorProps) => {

    const [x, set_x] = useState(0)

    const question = props.value

    function updateThresholds(thresholds: ThresholdCollection) {



    }

    function updateOptions(options: Option[]) {
        props.onChange && props.onChange({
            ...question,
            options: options
        });
    }

    return <>
        <Typography variant="h1">{x}</Typography>
        <Button onClick={() => set_x(x + 1)}>Increment</Button>
    </>
    switch (question?.type) {

        case QuestionTypeEnum.CHOICE:

            return (
                <MultipleChoiceEditor
                    {...props}
                    onChange={updateOptions}
                    value={
                        question!.options?.map((option, i) => {
                            const thresholdOptions = props.thresholds?.thresholdOptions;
                            return {
                                ...option,
                                triage: thresholdOptions && thresholdOptions[i] !== undefined ? thresholdOptions[i].category : CategoryEnum.BLUE
                            };
                        })
                    }
                />
            )

        case QuestionTypeEnum.BOOLEAN:
            return (
                <BooleanThresholdEditor
                    {...props}
                    value={props.thresholds}
                    onChange={updateThresholds}
                />
            )
        case QuestionTypeEnum.GROUP:
            return (
                <ObservationEditor {...props} />
            )
        case QuestionTypeEnum.OBSERVATION:
            return (
                <ObservationEditor {...props} />
            )

        default:
            return (<></>)
    }

}
