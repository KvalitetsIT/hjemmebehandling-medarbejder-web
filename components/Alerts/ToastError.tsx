import { Component } from "react";
import { Alert, Snackbar } from '@mui/material';
import { BaseServiceError } from "../../services/Errors/BaseServiceError";
import Slide, { SlideProps } from '@mui/material/Slide';

export interface Props {
    error : any
    severity : "error" | "info"
}

export class ToastError extends Component<Props,{}>{
    static defaultProps = {
        severity : "error"
    }

    constructor(props : Props){
        super(props);
    }

    closeSnackbar = () : void => {
        this.setState({snackbarOpen : false})
      };

      TransitionUp(props : SlideProps) : JSX.Element{
        return <Slide {...props} direction="up" />;
      }

    render() : JSX.Element{
        return (<>
            {[this.props.error].map(e => {
                
                const error = e as BaseServiceError
                return (
                    <Snackbar TransitionComponent={this.TransitionUp} open={true} autoHideDuration={6000} onClose={this.closeSnackbar} anchorOrigin={{vertical: 'bottom',horizontal: 'right'}}>
                        <Alert severity={this.props.severity} sx={{ width: '100%' }}>
                            <h5>{error.displayTitle()}</h5>
                            {error.displayMessage()}
                        </Alert>
                    </Snackbar>
                )
            })}
            
            </>
        )
    }
}