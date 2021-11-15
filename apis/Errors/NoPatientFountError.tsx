import { BaseApiError } from "./BaseApiError";

export class NoPatientFround extends Error implements BaseApiError {
    displayMessage() {
        return "Ingen patienter med de givne informationer blev fundet";
    }
}