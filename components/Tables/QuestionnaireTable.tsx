import { Question, QuestionTypeEnum } from "@kvalitetsit/hjemmebehandling/Models/Question";
import { Questionnaire } from "@kvalitetsit/hjemmebehandling/Models/Questionnaire";
import { TableCell } from "@kvalitetsit/hjemmebehandling/node_modules/@mui/material";
import { Button, Stack, Table, TableBody, TableContainer, TableHead, TableRow } from "@mui/material";
import { Component, ReactNode } from "react";
import { Link } from "react-router-dom";

interface Props {
    questionnaires: Questionnaire[]
}

export class QuestionnaireTable extends Component<Props>{
    render(): ReactNode {
        return (
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Navn</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Målingstyper</TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <>
                            {this.props.questionnaires!.map(questionnaire => {
                                const observationQuestions =
                                    questionnaire.questions?.filter(question => question && question.type == QuestionTypeEnum.OBSERVATION).map(q => (q as Question));
                                return (
                                    <TableRow>
                                        <TableCell>{questionnaire.name}</TableCell>
                                        <TableCell>{questionnaire.status}</TableCell>
                                        <TableCell>{observationQuestions?.map(x=>x.measurementType?.displayName?.toString())?.join(", ")}</TableCell>
                                        <TableCell>
                                            <Stack sx={{ float: "right" }} direction="row" spacing={2}>
                                                <Button component={Link} to={"/questionnaires/" + questionnaire.id + "/edit"} variant="outlined">Rediger</Button>
                                                <Button component={Link} to={"/questionnaires/" + questionnaire.id} variant="contained">Se mere</Button>
                                            </Stack>
                                        </TableCell>
                                    </TableRow>
                                )
                            })}
                        </>


                    </TableBody>
                </Table>
            </TableContainer>
        )
    }
}