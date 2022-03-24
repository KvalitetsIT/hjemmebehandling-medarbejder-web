import { CardHeader, Typography } from '@material-ui/core';
import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import { Component } from 'react';
import { PatientCareplan } from '@kvalitetsit/hjemmebehandling/Models/PatientCareplan';
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

  render () :JSX.Element {
    return (
        <Card component={Box} minWidth={100}>
            <CardHeader subheader="Monitoreringsplaner"/>
            <CardContent>
                <Stack>
            {this.props.careplans.map(careplan => {
                return (
                    <Button variant="text" component={Link} to={"" + careplan?.id} disabled={this.props.activeCareplan?.id === careplan?.id}>
                        
                        <Stack alignItems="center">
                        {careplan.planDefinitions.map(planDefinition => {
                            return (
                                <>
                                {careplan.terminationDate ? 
                                <Typography variant="caption" >{careplan.creationDate?.toLocaleDateString()} - {careplan.terminationDate?.toLocaleDateString()}</Typography>
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
