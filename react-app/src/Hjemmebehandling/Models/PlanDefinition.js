"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlanDefinitionStatus = exports.PlanDefinition = void 0;
const StringToEnumMappers_1 = require("../Helpers/ModelHelpers/StringToEnumMappers");
const FhirRessource_1 = require("./FhirRessource");
class PlanDefinition extends FhirRessource_1.FhirRessource {
    static stringToPlanDefinitionStatus(stringStatus) {
        switch (stringStatus) {
            // If PlanDefinition should have different status' than BaseModelStatus, they are added here like
            //case "InProgress":
            //  return PlanDefinitionStatus.InProgress
        }
        return StringToEnumMappers_1.StringToEnumMappers.stringToBaseModelStatus(stringStatus);
    }
}
exports.PlanDefinition = PlanDefinition;
var PlanDefinitionStatus;
(function (PlanDefinitionStatus) {
    //Only status' specific to questionnaire should be listed here - Otherwise in BaseModelStatus
})(PlanDefinitionStatus = exports.PlanDefinitionStatus || (exports.PlanDefinitionStatus = {}));
