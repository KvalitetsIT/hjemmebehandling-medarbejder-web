import DateProperties from "@kvalitetsit/hjemmebehandling/Helpers/danishImpl/DateProperties";
import IDateHelper from "@kvalitetsit/hjemmebehandling/Helpers/interfaces/IDateHelper";
import { BaseModelStatus } from "@kvalitetsit/hjemmebehandling/Models/BaseModelStatus";
import { Question, QuestionTypeEnum } from "@kvalitetsit/hjemmebehandling/Models/Question";
import { Questionnaire, QuestionnaireStatus } from "@kvalitetsit/hjemmebehandling/Models/Questionnaire";
import { Button, Stack, Table, TableBody, TableContainer, TableHead, TableRow, Typography, TableFooter, Tooltip, TableCell } from "@mui/material";
import { Component, ReactNode } from "react";
import { Link } from "react-router-dom";
import ApiContext, { IApiContext } from "../../pages/_context";
import { PencilIcon } from '../Icons/Icons';

interface Props {
    questionnaires: Questionnaire[]
}

interface State {
    showRetired: boolean
}

export class QuestionnaireTable extends Component<Props, State>{
    static contextType = ApiContext
    private readonly api: IApiContext;

    dateHelper!: IDateHelper

    constructor(props: Props) {
        super(props)
        this.api = this.context as IApiContext
        this.state = {
            showRetired: false
        }
    }

    initialiseServices(): void {
        this.dateHelper = this.api.dateHelper;
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
                            {this.renderTableRows(this.props.questionnaires!.filter(q => q.status !== BaseModelStatus.RETIRED))}
                            {this.renderTableRows(this.props.questionnaires!.filter(q => q.status === BaseModelStatus.RETIRED))}
                        </>
                    </TableBody>
                    <TableFooter>
                        <TableRow >
                            <TableCell colSpan={5}>
                                <Button className="border" sx={{ marginTop: 2, textTransform: "none", textAlign: "left" }} onClick={() => {
                                    const showRetired = !this.state.showRetired;
                                    this.setState({
                                        showRetired: showRetired
                                    })
                                }}>{this.state.showRetired ? "Skjul" : "Vis"} inaktive spørgeskemaer</Button>
                            </TableCell>
                        </TableRow>
                    </TableFooter>
                </Table>
            </TableContainer>
        )
    }

    renderTableRows(questionnaires: Questionnaire[]): JSX.Element {
        return (
            <>
                {questionnaires.map(questionnaire => {
                    const show = questionnaire.status !== BaseModelStatus.RETIRED || this.state.showRetired
                    const retired = questionnaire.status === BaseModelStatus.RETIRED

                    const lastUpdated = questionnaire.lastUpdated ? this.dateHelper.DateToString(questionnaire.lastUpdated, new DateProperties(true, true, true, true)) : ""
                    const observationQuestions = questionnaire.questions?.filter(question => question && question.type === QuestionTypeEnum.OBSERVATION).map(q => (q as Question));

                    return (
                        <TableRow sx={!show ? { display: 'none' } : {}}>
                            <TableCell>
                                <Typography sx={retired ? { fontStyle: 'italic' } : { fontWeight: 'bold' }} color={retired ? "grey" : "black"}>
                                    {questionnaire.name}
                                </Typography>
                            </TableCell>
                            <TableCell>
                                <Typography sx={retired ? { fontStyle: 'italic' } : {}} color={retired ? "grey" : "black"}>
                                    {this.statusToString(questionnaire.status)}
                                </Typography>
                            </TableCell>
                            <TableCell>
                                <Typography sx={retired ? { fontStyle: 'italic' } : {}} color={retired ? "grey" : "black"}>
                                    {observationQuestions?.map(x => x.measurementType?.displayName?.toString())?.join(", ")}
                                </Typography>
                            </TableCell>
                            <TableCell>
                                <Typography sx={retired ? { fontStyle: 'italic' } : {}} color={retired ? "grey" : "black"}>
                                    {lastUpdated}
                                </Typography>
                            </TableCell>
                            <TableCell>
                                {retired ?
                                    <></>
                                    :
                                    <Stack sx={{ float: "right" }} direction="row" spacing={2}>
                                        <Tooltip title="Rediger spørgeskema">
                                            <Button component={Link} to={"/questionnaires/" + questionnaire.id + "/edit"} variant="text"><PencilIcon /></Button>
                                        </Tooltip>
                                    </Stack>
                                }
                            </TableCell>
                        </TableRow>
                    )
                })}
            </>
        )
    }

    statusToString(stringStatus?: BaseModelStatus | QuestionnaireStatus): string {
        switch (stringStatus) {
            case BaseModelStatus.ACTIVE:
                return "Aktiv"
            case BaseModelStatus.DRAFT:
                return "Kladde"
            case BaseModelStatus.RETIRED:
                return "Inaktiv"
            case BaseModelStatus.UKENDT:
                return "Ukendt"
            default:
                return "N/A"
        }
    }
}