import * as React from 'react';
import { Component } from 'react';
import ApiContext from '../../pages/_context';
import { PatientCareplan } from '../Models/PatientCareplan';
import { Box, Button } from '@mui/material';

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
        <Button component={Box} margin={2} color="error" variant="outlined">Afslut patient</Button>
    )
  }



}
