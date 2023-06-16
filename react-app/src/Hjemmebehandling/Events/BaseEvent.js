"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseEvent = void 0;
class BaseEvent {
    constructor(eventName) {
        this.eventName = eventName;
    }
    dispatchEvent() {
        const event = new CustomEvent(this.eventName, { detail: this.eventData });
        dispatchEvent(event);
    }
}
exports.BaseEvent = BaseEvent;
