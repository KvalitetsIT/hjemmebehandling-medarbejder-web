import { QuestionTypeEnum } from "@kvalitetsit/hjemmebehandling/Models/Question";
import { Questionnaire } from "@kvalitetsit/hjemmebehandling/Models/Questionnaire";
import { TableCell } from "@kvalitetsit/hjemmebehandling/node_modules/@mui/material";
import { Button, Table, TableBody, TableHead, TableRow } from "@mui/material";
import { Component, ReactNode } from "react";

interface Props {
    questionnaires: Questionnaire[];
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
                    {this.props.questionnaires.map(questionnaire => {
                        const observationQuestions =
                            questionnaire.questions?.filter(question => question && question.type == QuestionTypeEnum.OBSERVATION).map(q => q.question);
                        return (
                            <TableRow>
                                <TableCell>{questionnaire.name}</TableCell>
                                <TableCell>Patienter</TableCell>
                                <TableCell>{questionnaire.status}</TableCell>
                                <TableCell>{questionnaire.version}</TableCell>
                                <TableCell>{questionnaire.planDefinition}</TableCell>
                                <TableCell>{observationQuestions?.join(", ")}</TableCell>
                                <TableCell>
                                    <Button variant="contained">Rediger</Button>
                                    <Button variant="contained">Se mere</Button>
                                </TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
        )
    }
}