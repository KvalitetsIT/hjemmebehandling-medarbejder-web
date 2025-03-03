import * as React from 'react';
import { Component } from 'react';
import Alert, { AlertColor } from '@mui/material/Alert';
import { Slide, SlideProps, Snackbar, Stack, Typography } from '@mui/material';

export interface ToastData {
    snackbarColor: AlertColor
    snackbarTitle: string
    onClose: () => void;

    icon?: JSX.Element
    positionVertical: "bottom" | "top"
    positionhorizontal: "right" | "left" | "center"
    children?: JSX.Element | JSX.Element[] 
}

export interface State {
    snackbarOpen: boolean
}

export class Toast extends Component<ToastData, State> {
    static displayName = Toast.name;
    public static defaultProps = {
        positionVertical: "bottom",
        positionhorizontal: "right",
        onClose: () => { }
    };

    constructor(props: ToastData) {
        super(props);
        this.state = {
            snackbarOpen: true
        }
    }
    TransitionUp(props: SlideProps): JSX.Element {
        return <Slide {...props} direction="up" />;
    }
    closeSnackbar = (): void => {
        if (this.props.onClose)
            this.props.onClose();
        this.setState({ snackbarOpen: false })
    };

    render(): JSX.Element {
        let props = this.props
        return (
            <>
                <Snackbar
                    TransitionComponent={this.TransitionUp}
                    open={this.state.snackbarOpen}
                    autoHideDuration={6000}
                    onClose={this.closeSnackbar}
                    anchorOrigin={{ vertical: this.props.positionVertical, horizontal: this.props.positionhorizontal }}
                >
                    <Alert icon={this.props.icon} severity={props.snackbarColor} sx={{ width: '100%' }}>
                        <Stack direction="row" alignItems="center" spacing={2}>
                            <Stack>
                                <Typography>{props.snackbarTitle}</Typography>
                                {props.children}
                            </Stack>
                        </Stack>
                    </Alert>
                </Snackbar>
            </>
        );
    }

}
