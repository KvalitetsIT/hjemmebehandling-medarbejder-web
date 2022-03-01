import IDateHelper from "@kvalitetsit/hjemmebehandling/Helpers/interfaces/IDateHelper";
import { PlanDefinition } from "@kvalitetsit/hjemmebehandling/Models/PlanDefinition";
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
                            <TableCell>Oprettelsesdato</TableCell>
                            <TableCell>Spørgeskemaer</TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {this.props.planDefinitions.map(planDefinition => {
                            return (
                                <TableRow>
                                    <TableCell><Typography>{planDefinition.name}</Typography></TableCell>
                                    <TableCell><Typography>{planDefinition.status}</Typography></TableCell>
                                    <TableCell><Typography>{planDefinition.created ? this.dateHelper.DateToString(planDefinition.created) : ""}</Typography></TableCell>
                                    <TableCell><Typography>{planDefinition?.questionnaires?.map(q => q.name).join(" / ")}</Typography></TableCell>
                                    <TableCell>
                                        <Stack sx={{ float: "right" }} direction="row" spacing={2}>
                                            <Button component={Link} to={"/plandefinitions/" + planDefinition.id + "/edit"} variant="outlined">Redigér</Button>
                                            <Button variant="contained">Se mere</Button>
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
}