export class BaseEvent<T>{
    eventName: string;
    eventData?: T;

    constructor(eventName: string) {
        this.eventName = eventName;
    }

    dispatchEvent() {
        const event = new CustomEvent(this.eventName, { detail: this.eventData });
        dispatchEvent(event);
    }
}