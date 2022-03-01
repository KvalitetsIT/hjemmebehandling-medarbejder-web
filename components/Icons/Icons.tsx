import * as React from 'react';
import { BaseIcon, BaseIconProps } from './Base/BaseIcon';


/* 
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
 */



export function ActivePatientsIcon(props?: BaseIconProps): JSX.Element {
    return (
        <BaseIcon {...props} src={'/assets/icons/_active-patients.svg'}></BaseIcon>
    );
}


export function AnweredIcon(props?: BaseIconProps): JSX.Element {
    return (
        <BaseIcon {...props} src={'/assets/icons/_ansered.svg'}></BaseIcon>
    );
}


export function ArrowDownFilledIcon(props?: BaseIconProps): JSX.Element {
    return (
        <BaseIcon {...props} src={'/assets/icons/_arrow-down-filled.svg'}></BaseIcon>
    );
}


export function ArrowDownIcon(props?: BaseIconProps): JSX.Element {
    return (
        <BaseIcon {...props} src={'/assets/icons/_arrow-down.svg'}></BaseIcon>
    );
}


export function ArrowLeftIcon(props?: BaseIconProps): JSX.Element {
    return (
        <BaseIcon {...props} src={'/assets/icons/_arrow_left.svg'}></BaseIcon>
    );
}


export function CheckmarkIcon(props?: BaseIconProps): JSX.Element {
    return (
        <BaseIcon {...props} src={'/assets/icons/_checkmark.svg'}></BaseIcon>
    );
}


export function CloseIcon(props?: BaseIconProps): JSX.Element {
    return (
        <BaseIcon {...props} src={'/assets/icons/_close.svg'}></BaseIcon>
    );
}


export function ContactIcon(props?: BaseIconProps): JSX.Element {
    return (
        <BaseIcon {...props} src={'/assets/icons/_contact.svg'}></BaseIcon>
    );
}


export function GraphIcon(props?: BaseIconProps): JSX.Element {
    return (
        <BaseIcon {...props} src={'/assets/icons/arrow_left.svg'}></BaseIcon>
    );
}


export function GroupIcon(props?: BaseIconProps): JSX.Element {
    return (
        <BaseIcon {...props} src={'/assets/icons/_group.svg'}></BaseIcon>
    );
}


export function HomeIcon(props?: BaseIconProps): JSX.Element {
    return (
        <BaseIcon {...props} src={'/assets/icons/_home.svg'}></BaseIcon>
    );
}


export function InactivePatientsIcon(props?: BaseIconProps): JSX.Element {
    return (
        <BaseIcon {...props} src={'/assets/icons/_inactive-patients.svg'}></BaseIcon>
    );
}


export function LogoIcon(props?: BaseIconProps): JSX.Element {
    return (
        <BaseIcon {...props} src={'/assets/icons/_logo.svg'}></BaseIcon>
    );
}


export function MessagesIcon(props?: BaseIconProps): JSX.Element {
    return (
        <BaseIcon {...props} src={'/assets/icons/messages.svg'}></BaseIcon>
    );
}
export function PencilIcon(props?: BaseIconProps): JSX.Element {
    props = {
        color: props?.color ?? "#1976d2"
    }
    return (
        <BaseIcon {...props} src={'/assets/icons/_pencil.svg'}></BaseIcon>
    );
}


export function PlusIcon(props?: BaseIconProps): JSX.Element {
    return (
        <BaseIcon {...props} src={'/assets/icons/_plus.svg'}></BaseIcon>
    );
}


export function ProfileIcon(props?: BaseIconProps): JSX.Element {
    return (
        <BaseIcon {...props} src={'/assets/icons/_profile.svg'}></BaseIcon>
    );
}


export function SurveyIcon(props?: BaseIconProps): JSX.Element {
    return (
        <BaseIcon {...props} src={'/assets/icons/_survey.svg'}></BaseIcon>
    );
}


export function TasklistIcon(props?: BaseIconProps): JSX.Element {
    return (
        <BaseIcon {...props} src={'/assets/icons/_tasklist.svg'}></BaseIcon>
    );
}


