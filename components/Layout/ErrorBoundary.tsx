
import { Alert, Typography } from "@mui/material";
import React, { ErrorInfo } from "react";
import { ToastError } from "../Alerts/ToastError";

export interface Props {
  rerenderChildren: boolean
  ekstraText: string;
}
export interface State {
  error?: Error
}

export class ErrorBoundary extends React.Component<Props, State> {
  public static defaultProps = {
    rerenderChildren: false,
    ekstraText: ""
  };

  constructor(props: Props) {
    super(props);
    this.state = { error: undefined };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { error: error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // You can also log the error to an error reporting service
    console.error(error)
    console.debug(errorInfo)

  }


  render(): JSX.Element {
    if (this.state.error) {
      // You can render any custom fallback UI
      return (<>
        <Alert severity="error" title={this.props.ekstraText}>
          <Typography variant={this.props.ekstraText ? "caption" : "inherit"}>Der er opstået en fejl</Typography>
          <Typography>{this.props.ekstraText}</Typography>
        </Alert>
        <ToastError error={this.state.error}></ToastError>
      </>)
    }

    return (
      <>
        {this.props.children}
      </>);

  }
}

