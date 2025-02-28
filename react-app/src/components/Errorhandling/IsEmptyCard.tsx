import { Component, PropsWithChildren } from "react";
import { Card, CardContent, Typography } from '@mui/material';
import React from "react";

interface Props {
    list?: any[];
    object?: any;
    useRawJsxWhenEmpty: boolean;
    jsxWhenEmpty: JSX.Element | string;
}

export default class IsEmptyCard extends Component<PropsWithChildren<Props>, {}>{
    public static defaultProps = {
        useRawJsxWhenEmpty: false
    };

    render(): JSX.Element {
        const listIsEmpty: boolean = this.props.list === undefined || this.props.list === null || this.props.list.length === 0
        const objectIsUndefined: boolean = this.props.object === undefined
        
        if (listIsEmpty && objectIsUndefined) {

            if (this.props.useRawJsxWhenEmpty) return <>{this.props.jsxWhenEmpty}</>

            return (
                <Card>
                    <CardContent>
                        <Typography>{this.props.jsxWhenEmpty}</Typography>
                    </CardContent>
                </Card>
            )
        }

        return this.props.children as JSX.Element;


    }
}