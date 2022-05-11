import IDateHelper from "@kvalitetsit/hjemmebehandling/Helpers/interfaces/IDateHelper";
import { BaseModelStatus } from "@kvalitetsit/hjemmebehandling/Models/BaseModelStatus";
import { PlanDefinition, PlanDefinitionStatus } from "@kvalitetsit/hjemmebehandling/Models/PlanDefinition";
import { TableCell } from "@kvalitetsit/hjemmebehandling/node_modules/@mui/material";
import { Button, Stack, Table, TableBody, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { Component, ReactNode } from "react";
import { Link } from "react-router-dom";
import ApiContext from "../../pages/_context";

interface Props {
    planDefinitions: PlanDefinition[]
}

export class PlanDefinitionTable extends Component<Props>{
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
                            <TableCell>Senest ændret</TableCell>
                            {/* <TableCell>Oprettelsesdato</TableCell> */}
                            <TableCell>Spørgeskemaer</TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {this.props.planDefinitions.map(planDefinition => {
                            return (
                                <TableRow>
                                    <TableCell><Typography>{planDefinition.name}</Typography></TableCell>
                                    <TableCell><Typography>{this.statusToString(planDefinition.status)}</Typography></TableCell>
                                    <TableCell><Typography>{planDefinition.lastUpdated ? this.dateHelper.DateToString(planDefinition.lastUpdated) : ""}</Typography></TableCell>
                                    {/* <TableCell><Typography>{planDefinition.created ? this.dateHelper.DateToString(planDefinition.created) : ""}</Typography></TableCell>*/}
                                     <TableCell><Typography>{planDefinition?.questionnaires?.map(q => q.name).join(" / ")}</Typography></TableCell>
                                    <TableCell>
                                        <Stack sx={{ float: "right" }} direction="row" spacing={2}>
                                            <Button component={Link} to={"/plandefinitions/" + planDefinition.id + "/edit"} variant="outlined">Redigér</Button>
                                        </Stack>
                                    </TableCell>

                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        )
    }

    statusToString(stringStatus?: BaseModelStatus | PlanDefinitionStatus): string {
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