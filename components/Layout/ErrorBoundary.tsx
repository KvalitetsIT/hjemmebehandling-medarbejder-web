
import React, { ErrorInfo } from "react";
import { ToastError } from "../Alerts/ToastError";

export interface State{
    error? : Error
}

export class ErrorBoundary extends React.Component<{},State> {
    constructor(props : {}) {
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
        return (<ToastError error={this.state.error}></ToastError>)
      }
  
      return (<>{this.props.children}</>);

    }
  }

 