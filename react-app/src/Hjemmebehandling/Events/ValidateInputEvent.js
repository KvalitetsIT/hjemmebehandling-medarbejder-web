"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidateInputEventData = exports.ValidateInputEvent = void 0;
const BaseEvent_1 = require("./BaseEvent");
class ValidateInputEvent extends BaseEvent_1.BaseEvent {
    constructor(data) {
        super(ValidateInputEvent.eventName);
        this.eventData = data;
    }
}
exports.ValidateInputEvent = ValidateInputEvent;
ValidateInputEvent.eventName = "validateInputEvent";
class ValidateInputEventData {
    constructor(sectionName) {
        this.sectionName = sectionName;
    }
}
exports.ValidateInputEventData = ValidateInputEventData;
