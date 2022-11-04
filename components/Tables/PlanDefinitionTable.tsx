import IDateHelper from "@kvalitetsit/hjemmebehandling/Helpers/interfaces/IDateHelper";
import { BaseModelStatus } from "@kvalitetsit/hjemmebehandling/Models/BaseModelStatus";
import { PlanDefinition, PlanDefinitionStatus } from "@kvalitetsit/hjemmebehandling/Models/PlanDefinition";
import { TableCell } from "@kvalitetsit/hjemmebehandling/node_modules/@mui/material";
import { Button, Stack, Table, TableBody, TableContainer, TableHead, TableRow, Typography, TableFooter } from "@mui/material";
import { Component, ReactNode } from "react";
import { Link } from "react-router-dom";
import ApiContext from "../../pages/_context";

interface Props {
    planDefinitions: PlanDefinition[]
}

interface State {
    showRetired: boolean
}

export class PlanDefinitionTable extends Component<Props, State>{
    static contextType = ApiContext
    dateHelper!: IDateHelper

    constructor(props: Props) {
        super(props)
        this.state = {
            showRetired: false
        }
    }

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
                            <TableCell>Spørgeskemaer</TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <>
                            {this.renderTableRows(this.props.planDefinitions!.filter(q => q.status != BaseModelStatus.RETIRED))}
                            {this.renderTableRows(this.props.planDefinitions!.filter(q => q.status == BaseModelStatus.RETIRED))}
                        </>
                    </TableBody>
                    <TableFooter>
                        <TableRow >
                            <TableCell colSpan={5}>
                                <Button sx={{marginTop: 2, textTransform: "none", textAlign:"left"}} onClick={()=>{
                                    const showRetired = !this.state.showRetired; 
                                    this.setState( {
                                        showRetired: showRetired
                                    })
                                }}>{this.state.showRetired ? "Skjul" : "Vis"} inaktive patientgrupper</Button>
                            </TableCell>
                        </TableRow>
                    </TableFooter>
                </Table>
            </TableContainer>
        )
    }

    renderTableRows(planDefinitions: PlanDefinition[]): JSX.Element {
        return (
            <>
                {planDefinitions.map(planDefinition => {
                    const show = planDefinition.status != BaseModelStatus.RETIRED || this.state.showRetired
                    const retired = planDefinition.status == BaseModelStatus.RETIRED

                    return (
                        <TableRow sx={!show ? {display: 'none'} : {}}>
                            <TableCell>
                                <Typography sx={retired ? {fontStyle: 'italic'}:{}} color={retired ? "grey": "black"}>
                                    {planDefinition.name}
                                </Typography>
                            </TableCell>
                            <TableCell>
                                <Typography sx={retired ? {fontStyle: 'italic'}:{}} color={retired ? "grey": "black"}>
                                    {this.statusToString(planDefinition.status)}
                                </Typography>
                            </TableCell>
                            <TableCell>
                                <Typography sx={retired ? {fontStyle: 'italic'}:{}} color={retired ? "grey": "black"}>
                                    {planDefinition.lastUpdated ? this.dateHelper.DateToString(planDefinition.lastUpdated) : ""}
                                </Typography>
                            </TableCell>
                            <TableCell>
                                <Typography sx={retired ? {fontStyle: 'italic'}:{}} color={retired ? "grey": "black"}>
                                    {planDefinition?.questionnaires?.map(q => q.name).join(" / ")}
                                </Typography>
                            </TableCell>
                            <TableCell>
                                {retired ? 
                                <></>
                                :
                                <Stack sx={{ float: "right" }} direction="row" spacing={2}>
                                    <Button component={Link} to={"/plandefinitions/" + planDefinition.id + "/edit"} variant="outlined">Redigér</Button>
                                </Stack>
                                }
                            </TableCell>
                        </TableRow>
                    )
                })}
            </>
        )
    }

    statusToString(stringStatus?: BaseModelStatus | PlanDefinitionStatus): string {
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