import { StringToEnumMappers } from "../Helpers/ModelHelpers/StringToEnumMappers";
import { BaseModelStatus } from "./BaseModelStatus";
import { FhirRessource } from "./FhirRessource";
import { Questionnaire } from "./Questionnaire";


export class PlanDefinition extends FhirRessource {
    id?: string;
    name?: string;
    questionnaires?: Questionnaire[]
    status?: PlanDefinitionStatus | BaseModelStatus
    created?: Date
    lastUpdated?: Date
    
    static stringToPlanDefinitionStatus(stringStatus?: string): PlanDefinitionStatus | BaseModelStatus {

        switch (stringStatus) {
            // If PlanDefinition should have different status' than BaseModelStatus, they are added here like
            //case "InProgress":
            //  return PlanDefinitionStatus.InProgress
        }
        return StringToEnumMappers.stringToBaseModelStatus(stringStatus);
    }
}

export enum PlanDefinitionStatus {
    //Only status' specific to questionnaire should be listed here - Otherwise in BaseModelStatus
}
