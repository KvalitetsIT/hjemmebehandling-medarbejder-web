import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Component } from 'react';
import { PatientCareplan } from '@kvalitetsit/hjemmebehandling/Models/PatientCareplan';
import Button from '@mui/material/Button';
import { CardHeader, Divider, Grid, Typography } from '@mui/material';
import IDateHelper from '@kvalitetsit/hjemmebehandling/Helpers/interfaces/IDateHelper';
import ApiContext from '../../pages/_context';
import { Link } from 'react-router-dom';
import ICareplanService from '../../services/interfaces/ICareplanService';
import { ConfirmationButton } from '../Input/ConfirmationButton';
import { PencilIcon } from '../Icons/PencilIcon';

export interface Props {
    careplan: PatientCareplan
}


export class CareplanSummary extends Component<Props, {}> {
    static displayName = CareplanSummary.name;
    static contextType = ApiContext;
    dateHelper!: IDateHelper
    careplanService!: ICareplanService;

    InitialiseServices(): void {
        this.dateHelper = this.context.dateHelper;
        this.careplanService = this.context.careplanService
    }

    async finishCareplan(careplan: PatientCareplan): Promise<void> {
        try {
            await this.careplanService.TerminateCareplan(careplan)
        } catch (error: any) {
            this.setState(() => { throw error })
        }
    }

    render(): JSX.Element {
        this.InitialiseServices()
        const careplan = this.props.careplan;
        return (
            <Card>
                <CardHeader subheader={
                    <>
                        Monitoreringsplan
                        <Button component={Link} to={"/patients/" + careplan.patient?.cpr + "/edit/plandefinition"}>
                            <PencilIcon />
                        </Button>
                    </>
                } />
                <Divider />
                <CardContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Typography fontWeight="bold" variant="caption">
                                Patientgrupper
                            </Typography>
                            <Typography>
                                {careplan.planDefinitions.map(x => x.name).join(", ")}
                            </Typography>
                            <br />
                            <Typography fontWeight="bold" variant="caption">
                                Opstart
                            </Typography>
                            <Typography>
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
        );
    }
}
