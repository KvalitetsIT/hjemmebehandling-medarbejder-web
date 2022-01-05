import { SvgIcon } from '@mui/material';
import * as React from 'react';
import { BaseIconProps } from './BaseIconProps';


export class BaseIcon extends React.Component<BaseIconProps,{}>{
    render() : JSX.Element{   
        const color = this.props.color ?? "black"

        return (
            <SvgIcon sx={{ fill: "none", stroke: color }} >
                {this.props.children}
            </SvgIcon>
        );
    }

}