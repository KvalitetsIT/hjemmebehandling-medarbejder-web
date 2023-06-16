"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CriticalLevelEnum = exports.InvalidInputModel = exports.InvalidInputError = void 0;
const BaseServiceError_1 = require("../BaseServiceError");
class InvalidInputError extends BaseServiceError_1.BaseServiceError {
    constructor(propErrors) {
        super();
        this.propErrors = propErrors;
        this.message = this.displayMessage();
    }
    displayTitle() {
        let message = "";
        message += "Indtastningsfejl";
        return message;
    }
    displayMessage() {
        let message = "";
        message += "Fejl i flg parametre; ";
        message += this.propErrors.map(x => x.ToString()).join(", ");
        return message;
    }
}
exports.InvalidInputError = InvalidInputError;
class InvalidInputModel {
    constructor(propName, message, criticalLevel = CriticalLevelEnum.ERROR) {
        this.message = message;
        this.propName = propName;
        this.criticalLevel = criticalLevel;
    }
    ToString() {
        return this.propName + " (" + this.message + ")";
    }
}
exports.InvalidInputModel = InvalidInputModel;
var CriticalLevelEnum;
(function (CriticalLevelEnum) {
    CriticalLevelEnum[CriticalLevelEnum["ERROR"] = 0] = "ERROR";
    CriticalLevelEnum[CriticalLevelEnum["WARNING"] = 1] = "WARNING";
})(CriticalLevelEnum = exports.CriticalLevelEnum || (exports.CriticalLevelEnum = {}));
