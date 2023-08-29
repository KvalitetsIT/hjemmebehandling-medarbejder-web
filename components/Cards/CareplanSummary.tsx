import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Component } from 'react';
import { PatientCareplan } from '@kvalitetsit/hjemmebehandling/Models/PatientCareplan';
import Button from '@mui/material/Button';
import { CardHeader, Divider, Grid, Typography, Tooltip } from '@mui/material';
import IDateHelper from '@kvalitetsit/hjemmebehandling/Helpers/interfaces/IDateHelper';
import ApiContext from '../../pages/_context';
import { Link } from 'react-router-dom';
import { ICareplanService } from '../../services/interfaces/ICareplanService';
import { PencilIcon } from '../Icons/Icons';

import { FinishMonitoringButton } from '../Input/FinishMonitoringButton';
import { ErrorBoundary } from '@kvalitetsit/hjemmebehandling/Errorhandling/ErrorBoundary';

export interface Props {
    careplan: PatientCareplan
}
export interface State {

    finishedCareplan: boolean
}

export class CareplanSummary extends Component<Props, State> {
    static displayName = CareplanSummary.name;
    static contextType = ApiContext;
    declare context: React.ContextType<typeof ApiContext>
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
                                    <Tooltip title='Rediger patientens monitoreringsplan' placement='right'>
                                        <Button component={Link} to={"/patients/" + careplan.patient?.cpr + "/edit/plandefinition"}>
                                            <PencilIcon />
                                        </Button>
                                    </Tooltip>
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
                                <ErrorBoundary>
                                    <FinishMonitoringButton careplan={this.props.careplan}></FinishMonitoringButton>
                                </ErrorBoundary>
                            </Grid>

                        </Grid>

                    </CardContent>
                </Card>

            </>
        );
    }
}

