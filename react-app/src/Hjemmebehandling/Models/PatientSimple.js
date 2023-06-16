"use strict";
//Very little info about the patient. Used when all we want to show is small data about patient.
//Used in: 
//- Tasklist
Object.defineProperty(exports, "__esModule", { value: true });
exports.PatientSimple = void 0;
const StringFormatters_1 = require("../Helpers/ModelHelpers/StringFormatters");
const FhirRessource_1 = require("./FhirRessource");
class PatientSimple extends FhirRessource_1.FhirRessource {
    cprToString() {
        return StringFormatters_1.StringFormatter.FormatCpr(this.cpr);
    }
}
exports.PatientSimple = PatientSimple;
