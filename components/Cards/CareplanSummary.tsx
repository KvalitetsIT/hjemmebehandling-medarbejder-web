import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Component } from 'react';
import { PatientCareplan } from '@kvalitetsit/hjemmebehandling/Models/PatientCareplan';
import Button from '@mui/material/Button';
import { CardHeader, Chip, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, Grid, Typography } from '@mui/material';
import IDateHelper from '@kvalitetsit/hjemmebehandling/Helpers/interfaces/IDateHelper';
import ApiContext from '../../pages/_context';
import { Link } from 'react-router-dom';
import { ICareplanService } from '../../services/interfaces/ICareplanService';
import { ConfirmationButton } from '../Input/ConfirmationButton';
import { PencilIcon } from '../Icons/PencilIcon';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';

export interface Props {
    careplan: PatientCareplan
}
export interface State {
    toast?: JSX.Element
    finishedCareplan: boolean
}

export class CareplanSummary extends Component<Props, State> {
    static displayName = CareplanSummary.name;
    static contextType = ApiContext;
    dateHelper!: IDateHelper
    careplanService!: ICareplanService;

    constructor(props: Props) {
        super(props);
        this.state = {
            finishedCareplan: false
        }
    }

    InitialiseServices(): void {
        this.dateHelper = this.context.dateHelper;
        this.careplanService = this.context.careplanService
    }

    async finishCareplan(careplan: PatientCareplan): Promise<void> {
        try {
            await this.careplanService.TerminateCareplan(careplan)
            const patientName = this.props.careplan.patient?.firstname + " " + this.props.careplan.patient?.lastname
            const patientCpr = this.props.careplan.patient?.cprToString()
            const afterResetPasswordToast = this.createNonCloseableDialog(
                <><CheckCircleOutlinedIcon color='success' /> Monitoreringsplanen er afsluttet</>,
                "",
                <>
                    <Typography>Følgende behandlingsplan blev afsluttet</Typography>
                    <Chip icon={<PersonOutlineOutlinedIcon />} label={<Typography padding={2}>{patientName} ({patientCpr})</Typography>} />
                </>
            )
            this.setState({ toast: afterResetPasswordToast })
        } catch (error: unknown) {
            this.setState(() => { throw error })
        }
    }

    createNonCloseableDialog(title: string | JSX.Element, subtitle: string | JSX.Element, message: string | JSX.Element): JSX.Element {
        return (
            <Dialog fullWidth open={true}>
                <DialogTitle id="alert-dialog-title">
                    <Typography variant="subtitle1">{title}</Typography>
                    <Typography variant="caption">{subtitle}</Typography>

                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        <Typography variant="caption">{message}</Typography>
                    </DialogContentText>


                </DialogContent>

                <DialogActions>
                    <Button autoFocus onClick={this.reloadPage}><AssignmentIcon />Patientoverblik</Button>
                </DialogActions>
            </Dialog>
        )
    }

    reloadPage(): void {
        window.location.replace("/");
    }

    render(): JSX.Element {
        this.InitialiseServices()
        const careplan = this.props.careplan;
        return (
            <>
                <Card>
                    <CardHeader subheader={
                        <>
                            <Grid container alignItems="center">
                                <Grid item xs={10}>
                                    <Typography variant="h6" fontWeight="bold">Monitoreringsplan</Typography>
                                </Grid>
                                <Grid item xs={2}>
                                    <Button component={Link} to={"/patients/" + careplan.patient?.cpr + "/edit/plandefinition"}>
                                        <PencilIcon />
                                    </Button>
                                </Grid>
                            </Grid>


                        </>
                    } />
                    <Divider />
                    <CardContent>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Typography variant="caption">
                                    Patientgrupper
                                </Typography>
                                <Typography fontWeight="bold">
                                    {careplan.planDefinitions.map(x => x.name).join(", ")}
                                </Typography>
                                <br />
                                <Typography variant="caption">
                                    Opstart
                                </Typography>
                                <Typography fontWeight="bold">
                                    {careplan.creationDate ? this.dateHelper.DateToString(careplan.creationDate) : ""}
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <ConfirmationButton fullWidth color="error" className='darkColor border' title="Afslut monitoreringsplan?" buttonText="Afslut monitoreringsplan" action={async () => await this.finishCareplan(careplan)}>
                                    Er du sikker på at du ønsker at afslutte patientens monitoreringsplan?
                                </ConfirmationButton>
                            </Grid>

                        </Grid>

                    </CardContent>
                </Card>
                {this.state.toast ?? <></>}
            </>
        );
    }
}
