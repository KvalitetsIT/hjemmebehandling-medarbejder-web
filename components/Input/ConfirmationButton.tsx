import * as React from 'react';
import { Component } from 'react';
import ApiContext from '../../pages/_context';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import IQuestionnaireService from '../../services/interfaces/IQuestionnaireService';

export interface Props {
    action : () => void
    title : string
    buttonText : string
    class : string

    color : 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning'
    variant : "outlined" | "contained" | "text"
}
export interface State {
  openConfirmationBox : boolean
}

export class ConfirmationButton extends Component<Props,State> {
  
  static displayName = ConfirmationButton.name;
  static contextType = ApiContext
  questionnaireService! : IQuestionnaireService;
  
  public static defaultProps = {
    color : "inherit",
    variant : "outlined"
  };
  
  constructor(props : Props){
      super(props);
      this.state = {
        openConfirmationBox : false
      }
  }

  doAction() : void{
    try{
      if(this.props.action)
        this.props.action();
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

  render () : JSX.Element{
    return (
      <>
        <Button className={this.props.class} onClick={async () => this.OpenVerificationBox()} color={this.props.color} variant={this.props.variant}>{this.props.buttonText}</Button>
      <Dialog
        open={this.state.openConfirmationBox}
        onClose={()=>this.CloseVerificationBox()}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {this.props.title}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
          {this.props.children}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button className="decline__button" onClick={()=>this.CloseVerificationBox()} autoFocus>Nej</Button>
          <Button className="accept__button" color="error" variant="contained" onClick={()=>this.doAction()} >
            Ja
          </Button>
        </DialogActions>
      </Dialog>
        </>
    )
  }



}
