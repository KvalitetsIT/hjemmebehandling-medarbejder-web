import React, { Component } from "react";
import { Stack, Typography } from '@mui/material';
import { BaseServiceError } from "./BaseServiceError";
import { Toast } from "./Toast";
import { UnknownServiceError } from "./ServiceErrors/UnknownServiceError";

export interface Props {
    error: any
    severity: "error" | "info"
}

export class ToastError extends Component<Props, {}>{
    static defaultProps = {
        severity: "error"
    }

    constructor(props: Props) {
        super(props);
    }

    closeSnackbar = (): void => {
        this.setState({ snackbarOpen: false })
    };

    render(): JSX.Element {
        return (<>
            {[this.props.error].map(e => {

                let error: BaseServiceError = new UnknownServiceError(e);
                if (e instanceof BaseServiceError) {
                    error = e as BaseServiceError
                }
                return this.renderError(error.displayTitle(), error.displayUrl(), error.displayMessage());
            })}

        </>
        )
    }

    renderError(title: string, url: string, message: string) {
        return (
            <Toast snackbarColor="error" snackbarTitle="">
                <Stack>
                    <Typography variant="subtitle1">{title}</Typography>
                    <Typography variant="caption">{url}</Typography>
                </Stack>
                <Typography whiteSpace="pre-wrap">
                    {message}
                </Typography>
            </Toast>
        )
    }
}