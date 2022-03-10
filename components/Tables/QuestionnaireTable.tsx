import DateProperties from "@kvalitetsit/hjemmebehandling/Helpers/danishImpl/DateProperties";
import IDateHelper from "@kvalitetsit/hjemmebehandling/Helpers/interfaces/IDateHelper";
import { BaseModelStatus } from "@kvalitetsit/hjemmebehandling/Models/BaseModelStatus";
import { Question, QuestionTypeEnum } from "@kvalitetsit/hjemmebehandling/Models/Question";
import { Questionnaire, QuestionnaireStatus } from "@kvalitetsit/hjemmebehandling/Models/Questionnaire";
import { TableCell } from "@kvalitetsit/hjemmebehandling/node_modules/@mui/material";
import { Button, Stack, Table, TableBody, TableContainer, TableHead, TableRow } from "@mui/material";
import { Component, ReactNode } from "react";
import { Link } from "react-router-dom";
import ApiContext from "../../pages/_context";

interface Props {
    questionnaires: Questionnaire[]
}

export class QuestionnaireTable extends Component<Props>{
    static contextType = ApiContext
    dateHelper!: IDateHelper

    initialiseServices(): void {
        this.dateHelper = this.context.dateHelper;
    }

    render(): ReactNode {
        this.initialiseServices();

        return (
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Navn</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Målingstyper</TableCell>
                            <TableCell>Senest ændret</TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <>
                            {this.props.questionnaires!.map(questionnaire => {
                                const lastUpdated = questionnaire.lastUpdated ? this.dateHelper.DateToString(questionnaire.lastUpdated, new DateProperties(true, true, true, true)) : ""
                                const observationQuestions =
                                    questionnaire.questions?.filter(question => question && question.type == QuestionTypeEnum.OBSERVATION).map(q => (q as Question));
                                return (
                                    <TableRow>
                                        <TableCell>{questionnaire.name}</TableCell>
                                        <TableCell>{this.statusToString(questionnaire.status)}</TableCell>
                                        <TableCell>{observationQuestions?.map(x => x.measurementType?.displayName?.toString())?.join(", ")}</TableCell>
                                        <TableCell>{lastUpdated}</TableCell>
                                        <TableCell>
                                            <Stack sx={{ float: "right" }} direction="row" spacing={2}>
                                                <Button component={Link} to={"/questionnaires/" + questionnaire.id + "/edit"} variant="outlined">Rediger</Button>

                                                {/*<Button component={Link} to={"/questionnaires/" + questionnaire.id} variant="contained">Se mere</Button>*/}
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

    statusToString(stringStatus?: BaseModelStatus | QuestionnaireStatus): string {
        switch (stringStatus) {
            case BaseModelStatus.ACTIVE:
                return "Aktiv"
            case BaseModelStatus.DRAFT:
                return "Kladde"
            case BaseModelStatus.UKENDT:
                return "Ukendt"
            default:
                return "N/A"
        }
    }
}