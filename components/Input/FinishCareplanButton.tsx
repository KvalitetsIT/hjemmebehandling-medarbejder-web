import * as React from 'react';
import { Component } from 'react';
import ApiContext from '../../pages/_context';
import { PatientCareplan } from '../Models/PatientCareplan';
import { Box, Button, Card, CardContent } from '@mui/material';

export interface Props {
    careplan : PatientCareplan
}



export class FinishCareplanButton extends Component<Props,{}> {
  static displayName = FinishCareplanButton.name;
  static contextType = ApiContext

  constructor(props : Props){
      super(props);
      
  }

  render () :JSX.Element{
    return (
        <Card>
        <CardContent>
        <Button component={Box} margin={2} color="error" variant="contained">Afslut patient</Button>
        </CardContent>
    </Card>
    )
  }



}
