import React from "react";
import { BaseEvent } from "./BaseEvent";

export class ValidateInputEvent extends BaseEvent<ValidateInputEventData> {
    static eventName: string = "validateInputEvent"
    constructor(data: ValidateInputEventData) {
        super(ValidateInputEvent.eventName)
        this.eventData = data;
    }
}

export class ValidateInputEventData {
    sectionName?: string
    constructor(sectionName?: string) {
        this.sectionName = sectionName;
    }
}