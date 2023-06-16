"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestionnaireResponseStatus = exports.QuestionnaireResponse = void 0;
const FhirRessource_1 = require("./FhirRessource");
class QuestionnaireResponse extends FhirRessource_1.FhirRessource {
}
exports.QuestionnaireResponse = QuestionnaireResponse;
var QuestionnaireResponseStatus;
(function (QuestionnaireResponseStatus) {
    QuestionnaireResponseStatus["Processed"] = "Behandlet";
    QuestionnaireResponseStatus["InProgress"] = "Under behandling";
    QuestionnaireResponseStatus["NotProcessed"] = "Ikke behandlet";
    QuestionnaireResponseStatus["NotAnswered"] = "Ikke besvaret";
})(QuestionnaireResponseStatus = exports.QuestionnaireResponseStatus || (exports.QuestionnaireResponseStatus = {}));
