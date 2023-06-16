import { Alert, Button, Typography } from "@mui/material";
import React, { ErrorInfo, PropsWithChildren } from "react";
import { BaseServiceError } from "./BaseServiceError";
import { DialogError } from "./DialogError";
import { ToastError } from "./ToastError";

export interface Props {
  rerenderChildren: boolean
  ekstraText: string;
  showReloadButton: boolean;
  ignoreAlert?: boolean;
}
export interface State {
  error?: Error
  open: boolean
}

export class ErrorBoundary extends React.Component<PropsWithChildren<Props>, State> {
  public static defaultProps = {
    rerenderChildren: false,
    ekstraText: "",
    showReloadButton: false
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      error: undefined,
      open: true
    };
  }

  static getDerivedStateFromError(error: Error, open: boolean): State {
    // Update state so the next render will show the fallback UI.
    return { error: error, open: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // You can also log the error to an error reporting service
    console.error(error)
    console.debug(errorInfo)

  }

  render(): JSX.Element {
    if (this.state.error) {
      // You can render any custom fallback UI
      if (this.shouldBeLargeError()) {
        return (
          <DialogError error={this.state.error as BaseServiceError} />
        )
      }

      return (<>

        {this.props.ignoreAlert ? (
          <Alert severity="error" title={this.props.ekstraText}>
            <Typography variant={this.props.ekstraText ? "caption" : "inherit"}>Der er opstået en fejl</Typography>
            <Typography>{this.props.ekstraText}</Typography>
            {this.props.showReloadButton ? <Button onClick={() => { this.reloadPage() }}>Genindlæs</Button> : <></>}
          </Alert>
        ): this.props.children}

        <ToastError error={this.state.error}></ToastError>
      </>)
    }

    return (
      <>
        {this.props.children}
      </>);
  }

  shouldBeLargeError(): boolean {
    if (this.state.error instanceof BaseServiceError)
      return this.state.error.displaySettings().displayInLargeDialog
    return false;
  }

  reloadPage(): void {
    window.location.replace("/");
  }

}
