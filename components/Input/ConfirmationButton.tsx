import * as React from 'react';
import { Component } from 'react';
import ApiContext from '../../pages/_context';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Tooltip } from '@mui/material';
import IQuestionnaireService from '../../services/interfaces/IQuestionnaireService';
import { LoadingButton } from '@mui/lab';

export interface Props {
  action: () => Promise<void>
  title: string
  buttonText: JSX.Element | string
  className: string
  fullWidth : boolean

  color: 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning'
  variant: "outlined" | "contained" | "text"
}
export interface State {
  openConfirmationBox: boolean
  doingAction: boolean
}

export class ConfirmationButton extends Component<Props, State> {

  static displayName = ConfirmationButton.name;
  static contextType = ApiContext
  questionnaireService!: IQuestionnaireService;

  public static defaultProps = {
    color: "inherit",
    variant: "outlined",
    className: "",
    fullWidth : false
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      openConfirmationBox: false,
      doingAction: false
    }
  }

  async doAction(): Promise<void> {
    try {
      this.setState({ doingAction: true })

      if (this.props.action)
        await this.props.action();

      this.setState({ openConfirmationBox: false })
    } catch (error: any) {
      this.setState(() => { throw error })
    }
    this.setState({ doingAction: false })
  }

  OpenVerificationBox(): void {
    this.setState({ openConfirmationBox: true })
  }
  CloseVerificationBox(): void {
    this.setState({ openConfirmationBox: false })
  }

  render(): JSX.Element {
    return (
      <>
        <Tooltip title={this.props.title}>
          <Button fullWidth={this.props.fullWidth} className={this.props.className} onClick={async () => this.OpenVerificationBox()} color={this.props.color} variant={this.props.variant}>{this.props.buttonText}</Button>
        </Tooltip>
        <Dialog
          open={this.state.openConfirmationBox}
          onClose={() => this.CloseVerificationBox()}
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
            <Button className="decline__button" onClick={() => this.CloseVerificationBox()} autoFocus>Nej</Button>
            <LoadingButton loading={this.state.doingAction} className="accept__button" color="primary" variant="contained" onClick={async () => await this.doAction()} >
              Ja
            </LoadingButton>
          </DialogActions>
        </Dialog>
      </>
    )
  }



}
