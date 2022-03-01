import * as React from 'react';
import { BaseIcon } from './Base/BaseIcon';
import { BaseIconProps } from './Base/BaseIconProps';


export function PencilIcon(props?: BaseIconProps): JSX.Element {
    const color = props?.color ?? "#1976d2";
    return (

        <BaseIcon {...props} color={color}>
            <line x1="18.17" y1="6.83" x2="7.54" y2="17.46" />
            <path d="M5.51,15.44,15.66,5.3a.69.69,0,0,1,1,0L19.7,8.35a.69.69,0,0,1,0,1L9.56,19.49" />
            <line x1="5.51" y1="15.44" x2="9.56" y2="19.49" />
            <path d="M9.56,19.49l-3.69.41a.68.68,0,0,1-.77-.77l.41-3.69" />
        </BaseIcon>
    );
}


