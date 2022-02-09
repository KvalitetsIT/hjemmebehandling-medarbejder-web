import { PlanDefinition } from "@kvalitetsit/hjemmebehandling/Models/PlanDefinition";
import { Card, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import React from "react";
import { LoadingBackdropComponent } from "../../components/Layout/LoadingBackdropComponent";
import { IQuestionnaireService } from "../../services/interfaces/IQuestionnaireService";
import ApiContext from "../_context";

interface State {
    loading: boolean
    planDefinitions: PlanDefinition[]
}


export default class PlandefinitionOverview extends React.Component<{}, State> {
    static contextType = ApiContext
    questionnaireService!: IQuestionnaireService

    constructor(props: {}) {
        super(props)
        this.state = {
            loading: true,
            planDefinitions: []
        }
    }
    async componentDidMount() : Promise<void> {
        try {
            const planDefinitions = await this.questionnaireService.GetAllPlanDefinitions();
            this.setState({ planDefinitions: planDefinitions });
        } catch (error) {
            this.setState(() => { throw error })
        }
        this.setState({ loading: false })

    }
    initialiseServices() : void {
        this.questionnaireService = this.context.questionnaireService;
    }
    render(): JSX.Element {
        this.initialiseServices();
        const contents = this.state.loading ? <LoadingBackdropComponent /> : this.renderCareplanTab();
        return contents;
    }
    renderCareplanTab(): JSX.Element {
        return (
            <>
                <Typography variant="h6">Patientgrupper</Typography>
                <br />
                <Card>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Navn</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Oprettelsesdato</TableCell>
                                    <TableCell>Spørgeskemaer</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {this.state.planDefinitions.map(planDefinition => {
                                    return (
                                        <TableRow>
                                            <TableCell><Typography>{planDefinition.name}</Typography></TableCell>
                                            <TableCell><Typography></Typography></TableCell>
                                            <TableCell><Typography></Typography></TableCell>
                                            <TableCell><Typography>{planDefinition.questionnaires.map(q=>q.name).join(", ")}</Typography></TableCell>
                                        </TableRow>
                                    )
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Card>


            </>
        )
    }
}