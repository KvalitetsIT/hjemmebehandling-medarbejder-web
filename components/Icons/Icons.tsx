import * as React from 'react';
import {BaseIcon, BaseIconProps} from "@kvalitetsit/hjemmebehandling/Icons/BaseIcon"


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
        <BaseIcon {...props} src={'/assets/icons/logo.svg'}></BaseIcon>
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


