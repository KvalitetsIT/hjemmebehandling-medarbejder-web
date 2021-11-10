import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Component } from 'react';
import { PatientCareplan } from '../Models/PatientCareplan';
import { CardHeader } from '@mui/material';

export interface Props {
    careplan : PatientCareplan
}


export class CareplanSummary extends Component<Props,{}> {
  static displayName = CareplanSummary.name;

  render ()  : JSX.Element{
    return (
        <Card component={Box} minWidth={100}>
            <CardHeader title="Monitoreringsplan"/>
            <CardContent>
              
            </CardContent>
        </Card>
    );
  }
}
