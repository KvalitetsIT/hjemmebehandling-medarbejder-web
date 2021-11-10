import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Component } from 'react';
import { PatientCareplan } from '../Models/PatientCareplan';
import { Stack } from '@mui/material';

export interface Props {
    careplan : PatientCareplan;
}

export class ObservationCard extends Component<Props,{}> {
  static displayName = ObservationCard.name;


  render () : JSX.Element {
    

    return (
        <Stack>
            <Stack spacing={2}>
                <Card component={Box}>
                    <CardContent>
                        Chart
                    </CardContent>
                </Card>
                <Card component={Box}>
                    <CardContent>
                        Alarm-grænser
                    </CardContent>
                </Card>
            </Stack>
        </Stack>
        
    );
  }
}
//npm install --save react-chartjs-2 chart.js