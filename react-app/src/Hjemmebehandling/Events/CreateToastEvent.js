"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateToastEventData = exports.CreateToastEvent = void 0;
const react_1 = __importDefault(require("react"));
const BaseEvent_1 = require("./BaseEvent");
class CreateToastEvent extends BaseEvent_1.BaseEvent {
    constructor(data) {
        super(CreateToastEvent.eventName);
        this.eventData = data;
    }
}
exports.CreateToastEvent = CreateToastEvent;
CreateToastEvent.eventName = "createToastEvent";
class CreateToastEventData {
    constructor(title, subTitle, alertColor, jsxPrefix) {
        this.title = "";
        this.subTitle = "";
        this.JsxPrefix = (react_1.default.createElement(react_1.default.Fragment, null));
        this.alertColor = "info";
        this.title = title;
        this.subTitle = subTitle !== null && subTitle !== void 0 ? subTitle : this.subTitle;
        this.JsxPrefix = jsxPrefix !== null && jsxPrefix !== void 0 ? jsxPrefix : this.JsxPrefix;
        this.alertColor = alertColor !== null && alertColor !== void 0 ? alertColor : this.alertColor;
    }
}
exports.CreateToastEventData = CreateToastEventData;
