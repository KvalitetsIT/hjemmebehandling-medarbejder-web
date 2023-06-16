"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PatientDetail = void 0;
const StringFormatters_1 = require("../Helpers/ModelHelpers/StringFormatters");
const PatientSimple_1 = require("./PatientSimple");
//When we want to display all info about a patient
//Used in 
//-patient-details
class PatientDetail extends PatientSimple_1.PatientSimple {
    primaryPhonenumberToString() {
        return StringFormatters_1.StringFormatter.FormatPhonenumber(this.primaryPhone);
    }
    secondaryPhonenumberToString() {
        return StringFormatters_1.StringFormatter.FormatPhonenumber(this.secondaryPhone);
    }
}
exports.PatientDetail = PatientDetail;
