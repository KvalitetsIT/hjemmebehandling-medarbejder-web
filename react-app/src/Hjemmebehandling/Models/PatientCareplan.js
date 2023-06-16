"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PatientCareplan = void 0;
const FhirRessource_1 = require("./FhirRessource");
const SimpleOrganization_1 = __importDefault(require("./SimpleOrganization"));
class PatientCareplan extends FhirRessource_1.FhirRessource {
    constructor() {
        super(...arguments);
        this.planDefinitions = [];
        this.questionnaires = [];
    }
    clone() {
        var _a, _b;
        const clone = new PatientCareplan();
        clone.id = this.id;
        clone.planDefinitions = this.planDefinitions;
        clone.questionnaires = this.questionnaires;
        clone.patient = this.patient;
        clone.creationDate = this.creationDate;
        clone.terminationDate = this.terminationDate;
        clone.organization = new SimpleOrganization_1.default();
        clone.organization.id = (_a = this.organization) === null || _a === void 0 ? void 0 : _a.id;
        clone.organization.name = (_b = this.organization) === null || _b === void 0 ? void 0 : _b.name;
        return clone;
    }
}
exports.PatientCareplan = PatientCareplan;
