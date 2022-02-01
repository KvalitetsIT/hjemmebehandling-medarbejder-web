import { PlanDefinition } from "@kvalitetsit/hjemmebehandling/Models/PlanDefinition";
import { QuestionTypeEnum } from "@kvalitetsit/hjemmebehandling/Models/Question";
import { TableCell } from "@kvalitetsit/hjemmebehandling/node_modules/@mui/material";
import { Button, Stack, Table, TableBody, TableHead, TableRow } from "@mui/material";
import { Component, ReactNode } from "react";
import { Link } from "react-router-dom";

interface Props {
    planDefinitions: PlanDefinition[];
}

export class QuestionnaireTable extends Component<Props>{
    render(): ReactNode {
        return (
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Navn</TableCell>
                        <TableCell>Patienter</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Version</TableCell>
                        <TableCell>Patientgruppe</TableCell>
                        <TableCell>Målingstyper</TableCell>
                        <TableCell></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>

                    {this.props.planDefinitions.map(planDefinition => {
                        return (
                            <>
                                {planDefinition.questionnaires.map(questionnaire => {
                                    const observationQuestions =
                                        questionnaire.questions?.filter(question => question && question.type == QuestionTypeEnum.OBSERVATION).map(q => q.question);
                                    return (
                                        <TableRow>
                                            <TableCell>{questionnaire.name}</TableCell>
                                            <TableCell>Patienter</TableCell>
                                            <TableCell>{questionnaire.status}</TableCell>
                                            <TableCell>{questionnaire.version}</TableCell>
                                            <TableCell>{planDefinition.name}</TableCell>
                                            <TableCell>{observationQuestions?.join(", ")}</TableCell>
                                            <TableCell>
                                                <Stack direction="row" spacing={2}>
                                                    <Button component={Link} to={"/questionnaires/"+questionnaire.id+"/edit"} variant="outlined">Rediger</Button>
                                                    <Button component={Link} to={"/questionnaires/"+questionnaire.id} variant="contained">Se mere</Button>
                                                </Stack>
                                            </TableCell>
                                        </TableRow>
                                    )
                                })}
                            </>
                        )
                    })} 

                </TableBody>
            </Table>
        )
    }
}