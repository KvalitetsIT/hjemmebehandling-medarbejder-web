import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Component } from 'react';
import { CardHeader, Divider, Grid, Typography } from '@mui/material';
import IDateHelper from '@kvalitetsit/hjemmebehandling/Helpers/interfaces/IDateHelper';
import ApiContext from '../../pages/_context';
import { ConfirmationButton } from '../Input/ConfirmationButton';
import { PatientDetail } from '@kvalitetsit/hjemmebehandling/Models/PatientDetail';
import IUserService from '../../services/interfaces/IUserService';
import IsEmptyCard from '@kvalitetsit/hjemmebehandling/Errorhandling/IsEmptyCard';

export interface Props {
    patient: PatientDetail
}


export class LoginInfoCard extends Component<Props, {}> {
    static displayName = LoginInfoCard.name;
    static contextType = ApiContext;
    dateHelper!: IDateHelper
    userService!: IUserService;

    InitialiseServices(): void {
        this.dateHelper = this.context.dateHelper;
        this.userService = this.context.userService
    }

    async resetPassword(): Promise<void> {
        try {
            await this.userService.ResetPassword(this.props.patient)
        } catch (error: any) {
            this.setState(() => { throw error })
        }
    }

    render(): JSX.Element {
        this.InitialiseServices()
        const patient = this.props.patient;
        return (
            <Card>
                <CardHeader subheader={<Typography variant="h6" fontWeight="bold">Patientens login</Typography>} />
                <Divider />
                <CardContent>
                    <Grid container spacing={1}>
                        <Grid item xs={12}>
                            <Typography variant="caption">
                                Brugernavn
                            </Typography>
                            <Typography fontWeight="bold">
                                <IsEmptyCard jsxWhenEmpty="Intet brugernavn" object={patient.username} >
                                    {patient.username}
                                </IsEmptyCard>
                            </Typography>

                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="caption">
                                Adgangskode
                            </Typography>
                            <Typography fontWeight="bold">
                                <ConfirmationButton disabled={!patient.username} variant="text" color="primary" title="Nulstil adgangskode?" buttonText="Nulstil adgangskode" action={async () => await this.resetPassword()}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12}>
                                            <Typography variant="subtitle1">
                                                Er du sikker på at du ønsker at nulstille adgangskoden for {patient.firstname} {patient.lastname}?
                                            </Typography>
                                            <Typography variant="subtitle2">
                                                Dette vil sætte adgangskoden tilbage til de første 6 cifre i CPR-nummeret
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Typography variant="caption">
                                                Brugernavn
                                            </Typography>
                                            <Typography fontWeight="bold">
                                                <IsEmptyCard jsxWhenEmpty="Intet brugernavn" object={patient.username} >
                                                    {patient.username}
                                                </IsEmptyCard>
                                            </Typography>
                                            <Typography variant="caption">
                                                Ny adgangskode
                                            </Typography>
                                            <Typography fontWeight="bold">
                                                {patient.cpr?.slice(0, 6)}
                                            </Typography>
                                        </Grid>

                                    </Grid>

                                </ConfirmationButton>
                            </Typography>

                        </Grid>
                    </Grid>

                </CardContent>
            </Card>
        );
    }
}
