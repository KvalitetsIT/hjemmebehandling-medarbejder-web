import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Component } from 'react';
import { PatientCareplan } from '../Models/PatientCareplan';

export interface Props {
    careplan : PatientCareplan
}


export class CareplanAnswerNotice extends Component<Props,{}> {
  static displayName = CareplanAnswerNotice.name;

  render ()  : JSX.Element{
    return (
        <Card component={Box} minWidth={100}>
            <CardContent>
              Ingen besvarelser
            </CardContent>
        </Card>
    );
  }
}
