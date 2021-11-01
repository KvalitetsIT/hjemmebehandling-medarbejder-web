import { CardHeader, CircularProgress, Divider, Grid, Tooltip, Typography } from '@material-ui/core';
import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import { Link, useParams } from 'react-router-dom';
import { IBackendApi } from '../../apis/IBackendApi';
import { PatientDetail } from '../../components/Models/PatientDetail';
import { Contact } from '../Models/Contact';
import { Component } from 'react';
import StarIcon from '@mui/icons-material/Star';
import ContactPageIcon from '@mui/icons-material/ContactPage';
import { PatientCareplan } from '../Models/PatientCareplan';
import { PlanDefinition } from '../Models/PlanDefinition';
import { Stack } from '@mui/material';

export interface Props {
    careplans : PatientCareplan[]
    activeCareplan : PatientCareplan
}

export interface State {
    activeCareplan : PatientCareplan
}

export class CareplanSelectorCard extends Component<Props,State> {
  static displayName = CareplanSelectorCard.name;

  render () {
    return (
        <Card component={Box} minWidth={100}>
            <CardHeader subheader="Behandlingsplaner"/>
            <CardContent>
                <Stack>
            {this.props.careplans.map(careplan => {
                return (
                    <Button variant="text" component={Link} to={careplan.id} disabled={this.props.activeCareplan.id == careplan.id}>
                        <Stack alignItems="center">
                        {careplan.planDefinitions.map(planDefinition => {
                            return (
                                <>
                                {careplan.terminationDate ? 
                                <Typography variant="caption" >{careplan.creationDate.toLocaleDateString()} - {careplan.terminationDate?.toLocaleDateString()}</Typography>
                                :
                                <Typography variant="caption" >Igangværende</Typography>
                                }
                                <Typography variant="subtitle1" >{planDefinition.name}</Typography>
                                </>
                            )
                        })}
                        </Stack>
                    </Button>
                )
            })}
            </Stack>
            </CardContent>
        </Card>
    );
  }
}
