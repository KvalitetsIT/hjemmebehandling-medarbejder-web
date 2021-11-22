import { BaseServiceError } from "./BaseServiceError";

export class NoPatientFround extends BaseServiceError {
    displayMessage() {
        return "Ingen patienter med de givne informationer blev fundet";
    }
    displayTitle(){
        return "Patient ikke fundet"
    }
}