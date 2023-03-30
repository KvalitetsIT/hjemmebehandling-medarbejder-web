import * as React from 'react';
import { Component } from 'react';
import ApiContext from '../../pages/_context';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Tooltip } from '@mui/material';
import { IQuestionnaireService } from '../../services/interfaces/IQuestionnaireService';
import { LoadingButton } from '@mui/lab';

export interface Props {
  action: () => Promise<void>
  skipDialog?: boolean
  title?: string
  tooltip?: string
  buttonText: JSX.Element | string
  className: string
  fullWidth: boolean
  disabled?: boolean
  contentOfDoActionBtn?: string
  contentOfCancelBtn?: string
  cancelBtnIsPrimary?: boolean
  cancelBtnIsLast?: boolean
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
    fullWidth: false
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
    } catch (error: unknown) {
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

  renderDeclientButton = (): JSX.Element => (
    <Button className="decline__button"
      variant={this.props.cancelBtnIsPrimary ? "contained" : "text"}
      autoFocus={this.props.cancelBtnIsPrimary ? true : false}
      onClick={() => this.CloseVerificationBox()}
    >
      {this.props.contentOfCancelBtn ? this.props.contentOfCancelBtn : "Nej"}
    </Button>
  )

  renderApproceButton = (): JSX.Element => (
    <LoadingButton className="accept__button"
      color="primary"
      variant={this.props.cancelBtnIsPrimary ? "text" : "contained"}
      autoFocus={this.props.cancelBtnIsPrimary ? false : true}
      loading={this.state.doingAction}
      onClick={async () => await this.doAction()}
    >
      {this.props.contentOfDoActionBtn ? this.props.contentOfDoActionBtn : "Ja"}
    </LoadingButton>
  )

  render(): JSX.Element {
    return (
      <>
        <Tooltip title={this.props.tooltip} >
          <Button
            disabled={this.props.disabled}
            fullWidth={this.props.fullWidth}
            className={this.props.className}
            onClick={() => { this.props.skipDialog ? this.doAction() : this.OpenVerificationBox() }}
            color={this.props.color}
            variant={this.props.variant}>{this.props.buttonText}</Button>
        </Tooltip>
        <Dialog
          open={this.state.openConfirmationBox}
          onClose={() => this.CloseVerificationBox()}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          maxWidth="lg"
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
            {this.props.cancelBtnIsLast ? (
              <>
                {this.renderApproceButton()}
                {this.renderDeclientButton()}
              </>
            ) : (
              <>
                {this.renderDeclientButton()}
                {this.renderApproceButton()}
              </>
            )}
          </DialogActions>
        </Dialog>
      </>
    )
  }



}
