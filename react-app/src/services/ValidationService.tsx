

import BaseService from "../components/BaseLayer/BaseService";
import { CriticalLevelEnum, InvalidInputModel } from "../components/Errorhandling/ServiceErrors/InvalidInputError";
import { PlanDefinition } from "../components/Models/PlanDefinition";
import { Questionnaire } from "../components/Models/Questionnaire";
import { IValidationService } from "./interfaces/IValidationService";

export default class ValidationService extends BaseService implements IValidationService {
    async ValidateZipCode(zipCode: string): Promise<InvalidInputModel[]> {
        const erorrs: InvalidInputModel[] = []
        const propName = "Postnummer"
        if (zipCode.length !== 4) {
            const error = new InvalidInputModel(propName, "Skal være 4 tegn")
            erorrs.push(error)
        }
        return erorrs;
    }

    async ValidateCPR(cpr: string): Promise<InvalidInputModel[]> {
        const erorrs: InvalidInputModel[] = []
        const propName = "CPR"

        if (cpr === "") {
            const error = new InvalidInputModel(propName, "CPR ikke udfyldt")
            erorrs.push(error)
        }
        if (cpr && cpr.includes("-")) {
            const error = new InvalidInputModel(propName, "CPR må ikke indeholde bindestreg")
            erorrs.push(error)
        }
        if (cpr && cpr?.length !== 10) {
            const error = new InvalidInputModel(propName, "CPR skal være 10 tegn")
            erorrs.push(error)
        }
        if (cpr?.length === 10 && !this.CalculateCPR(cpr)) {
            const error = new InvalidInputModel(propName, "Muligvis ikke korrekt CPR", CriticalLevelEnum.WARNING)
            erorrs.push(error)
        }

        return erorrs;
    }

    async ValidatePhonenumber(phoneNumber: string): Promise<InvalidInputModel[]> {
        const errors: InvalidInputModel[] = []
        const propName = "Telefonnummer"
        if (!phoneNumber || phoneNumber === "" || phoneNumber.length === 3)
            return [];

        if (!phoneNumber.includes("+")) {
            const error = new InvalidInputModel(propName, "Telefonnummer skal indeholde landekode")
            errors.push(error)
        }

        const phoneNumberWithNoPlus = phoneNumber.replace("+", "") as unknown as number
        if (isNaN(phoneNumberWithNoPlus)) {
            const error = new InvalidInputModel(propName, "Telefonnummer må kun indeholde tal")
            errors.push(error)
        }

        if (phoneNumber.length !== 11) {
            const error = new InvalidInputModel(propName, "Telefonnummer skal være 8 karakter")
            errors.push(error)
        }

        return errors;
    }



    async ValidatePlanDefinitions(planDefinitions: PlanDefinition[]): Promise<InvalidInputModel[]> {

        const errors: InvalidInputModel[] = []
        const propName = "Patientgruppe"

        if (!planDefinitions || planDefinitions.length === 0) {
            const error = new InvalidInputModel(propName, "Patient skal knyttes til minimum én patientgruppe ")
            errors.push(error)
        }

        const questionnaires = planDefinitions.flatMap(plandefinition => plandefinition.questionnaires);

        const duplicates = questionnaires.filter((item, index) => questionnaires.findIndex(q => q?.id === item?.id) !== index);
        if (duplicates.length > 0) {
            const error = new InvalidInputModel(propName, "Spørgeskema '" + duplicates[0]?.name + "' er indeholdt i flere af de valgte patientgrupper")
            errors.push(error)
        }


        return errors
    }




    async ValidateQuestionnaires(questionnaires: Questionnaire[]): Promise<InvalidInputModel[]> {
    
        const errors: InvalidInputModel[] = []
        const propName = "Patientgruppe"

        const daysWasSet = questionnaires.every(questionnaire => questionnaire?.frequency?.days && questionnaire?.frequency?.days.length > 0)
        if(!daysWasSet) {
            const error = new InvalidInputModel(propName, "Dagene for de angivede spørgeskemaer mangler")
            errors.push(error)
        }

        const frequencesWasSet =  questionnaires.every(questionnaire => questionnaire?.frequency?.repeated)
        if(!frequencesWasSet) {
            const error = new InvalidInputModel(propName, "Frekvensen for de angivede spørgeskemaer mangler")
            errors.push(error)
        }

        return errors
    }







    private CalculateCPR(cpr: string): boolean {
        //http://kode.tingeling.dk/cpr_fix/
        if (cpr.length !== 10)
            return false;

        const cprNumbers = cpr.split("").map(x => x as unknown as number);
        const controlNumber = [4, 3, 2, 7, 6, 5, 4, 3, 2]
        const constant = 11;

        let sum = 0;
        for (let i = 0; i < 9; i++) {
            const cprDigit = cprNumbers[i];
            const controlDigit = controlNumber[i];
            sum += cprDigit * controlDigit;
        }

        const b1 = constant - (sum % constant)
        const isCorrectCpr = b1 === cprNumbers[9]
        return isCorrectCpr
    }


}
