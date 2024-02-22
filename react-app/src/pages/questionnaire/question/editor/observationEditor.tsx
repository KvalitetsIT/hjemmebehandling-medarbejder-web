import { Question, QuestionTypeEnum } from "@kvalitetsit/hjemmebehandling/Models/Question";
import { SelectChangeEvent, TableContainer, Table, TableRow, TableCell, Stack, ButtonGroup, IconButton, Button, Tooltip } from "@mui/material";

import { useState, useEffect } from "react";
import { EditorProps } from "./editor";

import { ValidationError, bool } from "yup";
import { v4 as uuid } from 'uuid';
import { CategoryEnum } from "@kvalitetsit/hjemmebehandling/Models/CategoryEnum";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { QuestionMeasurementTypeSelect } from "../../../../components/Input/QuestionMeasurementTypeSelect";


export interface ObservationEditorProps extends EditorProps<Question> { }



export const ObservationEditor = (props: ObservationEditorProps) => {

    let question = props.value!

    let [questions, setQuestions] = useState<Question[]>([]);

    useEffect(() => {
        let questions = []
        if (question.type === QuestionTypeEnum.OBSERVATION) {
            questions.push(question);
        }
        else if (question.type === QuestionTypeEnum.GROUP) {
            if (!question.subQuestions) {
                question.subQuestions = [createNewSubQuestion(), createNewSubQuestion()]
            }
            questions.push(...question.subQuestions!);
        }
        setQuestions(questions)
    }, [props.value?.type])


    const isGroupQuestion = question.type === QuestionTypeEnum.GROUP;


    function createNewSubQuestion(): Question {
        const newSubQuestion = new Question();
        newSubQuestion.Id = uuid();
        newSubQuestion.type = QuestionTypeEnum.OBSERVATION;
        return newSubQuestion;
    }

    function addObservation(): void {
        if (question?.subQuestions) {
            question?.subQuestions.push(createNewSubQuestion());
            props.onChange && props.onChange(question);
        }
    }

    function removeObservation(removeQuestion: Question): void {
        if (question?.subQuestions && question.subQuestions.length > 2) {
            question.subQuestions = question?.subQuestions?.filter(sq => sq.Id !== removeQuestion.Id/*!sq.isEqual(removeQuestion)*/);
            props.onChange && props.onChange(question)
        }
    }

    function onChange(input: SelectChangeEvent<string>) {
        const clickedMeasurementCode = input.target.value
        const clicked = props.allMeasurementTypes.find(mt => mt.code === clickedMeasurementCode);

        if (question?.type === QuestionTypeEnum.GROUP) {
            //find correct subQuestion to update
            const subQuestion = question?.subQuestions?.find(sq => sq.Id === question?.Id);
            subQuestion!.measurementType = clicked
            props.onChange && props.onChange({ ...question })
        }
        else {
            props.onChange && props.onChange({ ...question, measurementType: clicked })
        }
    }


    return (
        <TableContainer>
            <Table>
                {questions.map((question, index) => {
                    const isLast = questions.length - 1 == index
                    return (
                        <TableRow>
                            <TableCell>
                                <Stack direction="row" spacing={2} >
                                    <QuestionMeasurementTypeSelect
                                        {...props}

                                        question={question}
                                        uniqueId={question.Id!}
                                        onChange={onChange}
                                        allMeasurementTypes={props.allMeasurementTypes}
                                    />

                                    {(isGroupQuestion && !props.disabled) && (
                                        <ButtonGroup variant="text" >
                                            <Tooltip title='Slet' placement='right'>
                                                <IconButton
                                                    sx={{ color: '#5D74AC', padding: 2, width: 50 }}
                                                    className="delete-question"
                                                    disabled={questions.length == 2}
                                                    onClick={() => removeObservation(question)}>
                                                    <DeleteOutlineIcon />
                                                </IconButton>
                                            </Tooltip>
                                            {isLast ?
                                                <Button className="add-child-question" sx={{ padding: 2 }} onClick={() => addObservation()}>
                                                    <AddCircleOutlineIcon sx={{ paddingRight: 1, width: 'auto' }} />
                                                    Tilføj yderligere måling
                                                </Button>
                                                :
                                                <></>
                                            }
                                        </ButtonGroup>
                                    )}
                                </Stack>
                            </TableCell>
                        </TableRow>
                    )
                })
                }
            </Table>
        </TableContainer>
    )
}



