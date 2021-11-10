import * as React from 'react';
import { Component } from 'react';
import ApiContext from '../../pages/_context';
import { PatientCareplan } from '../Models/PatientCareplan';
import { Box, Button } from '@mui/material';
import ICareplanService from '../../services/interfaces/ICareplanService';

export interface Props {
    careplan : PatientCareplan
}



export class FinishCareplanButton extends Component<Props,{}> {
  static displayName = FinishCareplanButton.name;
  static contextType = ApiContext
  careplanService! : ICareplanService;

  constructor(props : Props){
      super(props);
  }
  InitializeServices(){
    this.careplanService = this.context.careplanService
  }

  async finishCareplan(){
    await this.careplanService.TerminateCareplan(this.props.careplan)
  }

  render () :JSX.Element{
      this.InitializeServices()
    return (
        <Button onClick={async () => await this.finishCareplan()} component={Box} margin={2} color="error" variant="outlined">Afslut patient</Button>
    )
  }



}
