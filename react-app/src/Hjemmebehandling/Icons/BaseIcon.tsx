import * as React from 'react';

export interface BaseIconProps {
    color?: string
    size?: string
    src?: string
}


export class BaseIcon extends React.Component<BaseIconProps, {}> {
    private color = this.props?.color ?? /* "#1976d2" */ "black" ; // Defaults to black
    private size = this.props?.size ?? "2rem"; // Defaults to black

    render(): JSX.Element {
        return (
            <div style={{
                backgroundColor: this.color,
                WebkitMask: `url(${this.props.src}) no-repeat center`,
                mask: `url(${this.props.src}) no-repeat center`,
                height: this.size,
                width: this.size,
            }}></div>
        )
    }
}


