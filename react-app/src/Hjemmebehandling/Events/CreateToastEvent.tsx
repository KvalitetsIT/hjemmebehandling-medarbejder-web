import { AlertColor } from "@mui/material";
import React from "react";
import { BaseEvent } from "./BaseEvent";

export class CreateToastEvent extends BaseEvent<CreateToastEventData> {
    static eventName: string = "createToastEvent"
    constructor(data: CreateToastEventData) {
        super(CreateToastEvent.eventName)
        this.eventData = data;
    }
}

export class CreateToastEventData {
    title: string = "";
    subTitle: string = "";
    JsxPrefix: JSX.Element = (<></>);
    alertColor: AlertColor = "info";

    constructor(title: string, subTitle?: string, alertColor?: AlertColor, jsxPrefix?: JSX.Element) {
        this.title = title;
        this.subTitle = subTitle ?? this.subTitle;
        this.JsxPrefix = jsxPrefix ?? this.JsxPrefix;
        this.alertColor = alertColor ?? this.alertColor
    }
}