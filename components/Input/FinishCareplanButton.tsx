import * as React from 'react';
import { Component } from 'react';
import ApiContext from '../../pages/_context';
import { PatientCareplan } from '../Models/PatientCareplan';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import ICareplanService from '../../services/interfaces/ICareplanService';

export interface Props {
    careplan : PatientCareplan
}
export interface State {
    openConfirmationBox : boolean
}



export class FinishCareplanButton extends Component<Props,State> {
  static displayName = FinishCareplanButton.name;
  static contextType = ApiContext
  careplanService! : ICareplanService;

  constructor(props : Props){
      super(props);
      this.state = {
        openConfirmationBox : false
      }
  }
  InitializeServices() : void{
    this.careplanService = this.context.careplanService
  }

  async finishCareplan() :  Promise<void>{
    try{
      await this.careplanService.TerminateCareplan(this.props.careplan)
    }  catch(error : any){
      this.setState(()=>{throw error})
    }  
  }

  OpenVerificationBox() : void {
    this.setState({openConfirmationBox : true})
  }
  CloseVerificationBox() : void {
    this.setState({openConfirmationBox : false})
  }

  render () :JSX.Element{
      this.InitializeServices()
    return (
      <>
        <Button onClick={async () => this.OpenVerificationBox()} component={Box} margin={2} color="error" variant="outlined">Afslut patient</Button>
      <Dialog
        open={this.state.openConfirmationBox}
        onClose={()=>this.CloseVerificationBox()}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Afslut monitoreringsplanen?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Er du sikker på at du ønsker at afslutte patientens monitoreringsplan?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={()=>this.CloseVerificationBox()} autoFocus>Nej</Button>
          <Button color="error" variant="contained" onClick={async ()=>await this.finishCareplan()} >
            Ja
          </Button>
        </DialogActions>
      </Dialog>
        </>
    )
  }



}
