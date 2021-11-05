
export class NoPatientFround extends Error {
    displayMessage() {
        return "Ingen patienter med de givne informationer blev fundet";
    }
}