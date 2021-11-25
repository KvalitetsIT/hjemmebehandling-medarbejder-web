import { PatientDetail } from "./PatientDetail";
import { PlanDefinition } from "./PlanDefinition";
import { Questionnaire } from "./Questionnaire";
import { ThresholdCollection } from "./ThresholdCollection";


export class PatientCareplan {
    id! : string;
    planDefinitions : Array<PlanDefinition> = [];
    questionnaires : Questionnaire[] = []
    patient! : PatientDetail
    creationDate! : Date;
    terminationDate! : Date;
    thresholdCollections! : ThresholdCollection[]
    department!: string;

    clone() : PatientCareplan{
        const clone = new PatientCareplan();
        clone.id = this.id;
        clone.planDefinitions = this.planDefinitions;
        clone.questionnaires = this.questionnaires;
        clone.patient = this.patient;
        clone.creationDate = this.creationDate;
        clone.terminationDate = this.terminationDate;
        clone.department = this.department;
        return clone;
    }
}
