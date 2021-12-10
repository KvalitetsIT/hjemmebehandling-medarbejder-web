import { Component } from "react";
import { Card, CardContent, Typography } from '@mui/material';

interface Props{
    list? : any[];
    object? : any;
    jsxWhenEmpty : JSX.Element | string;
}

export default class IsEmptyCard extends Component<Props,{}>{
    render() : JSX.Element{
        const listIsEmpty : boolean = this.props.list === undefined || this.props.list.length === 0
        const objectIsUndefined : boolean = this.props.object === undefined

        console.log(listIsEmpty + "-"+objectIsUndefined)
        console.log(this.props.list)
        console.log(this.props.object)

        if(listIsEmpty && objectIsUndefined){
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