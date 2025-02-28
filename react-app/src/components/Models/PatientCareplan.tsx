import { FhirRessource } from "./FhirRessource";
import { PatientDetail } from "./PatientDetail";
import { PlanDefinition } from "./PlanDefinition";
import { Questionnaire } from "./Questionnaire";
import SimpleOrganization from "./SimpleOrganization";

export class PatientCareplan extends FhirRessource {
    id? : string;
    planDefinitions : Array<PlanDefinition> = [];
    questionnaires : Questionnaire[] = []
    patient? : PatientDetail
    creationDate? : Date;
    terminationDate? : Date;
    organization? : SimpleOrganization;

    clone() : PatientCareplan{
        const clone = new PatientCareplan();
        clone.id = this.id;
        clone.planDefinitions = this.planDefinitions;
        clone.questionnaires = this.questionnaires;
        clone.patient = this.patient;
        clone.creationDate = this.creationDate;
        clone.terminationDate = this.terminationDate;
        clone.organization = new SimpleOrganization();
        clone.organization.id = this.organization?.id
        clone.organization.name = this.organization?.name

        return clone;
    }
}
