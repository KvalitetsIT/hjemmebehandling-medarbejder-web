
import { Alert } from "@mui/material";
import React, { ErrorInfo } from "react";
import { ToastError } from "../Alerts/ToastError";

export interface Props {
    rerenderChildren : boolean
}
export interface State{
    error? : Error
}

export class ErrorBoundary extends React.Component<Props,State> {
    public static defaultProps = {
        rerenderChildren : false
    };

    constructor(props : Props) {
      super(props);
      this.state = { error: undefined };
    }
  
    static getDerivedStateFromError(error : Error) : State {
      // Update state so the next render will show the fallback UI.
      return { error: error };
    }
  
    componentDidCatch(error : Error, errorInfo : ErrorInfo) : void {
      // You can also log the error to an error reporting service
      console.log(error)
      console.log(errorInfo)
      
    }
   
      
    render() : JSX.Element{
      if (this.state.error) {
        // You can render any custom fallback UI
        return (<>
        <Alert severity="error" >Der er opstået en fejl</Alert>
        <ToastError error={this.state.error}></ToastError>
        </>)
      }
  
      return (
      <>
      {this.props.children}
      </>);

    }
  }

 