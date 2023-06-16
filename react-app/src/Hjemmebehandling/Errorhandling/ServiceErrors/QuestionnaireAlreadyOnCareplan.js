"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestionnaireAlreadyOnCareplan = void 0;
const BaseServiceError_1 = require("../BaseServiceError");
class QuestionnaireAlreadyOnCareplan extends BaseServiceError_1.BaseServiceError {
    displayMessage() {
        return "Spørgeskema allerede på monitoreringsplan";
    }
}
exports.QuestionnaireAlreadyOnCareplan = QuestionnaireAlreadyOnCareplan;
