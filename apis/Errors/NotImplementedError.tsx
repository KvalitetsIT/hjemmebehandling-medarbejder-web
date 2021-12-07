import { BaseApiError } from "./BaseApiError";

export class NotImplementedError extends BaseApiError {
    constructor(){
        super(new Response())
    }
    displayMessage() {
        return "Denne feature er endnu ikke klar";
    }
    async displayTitle(){
        return "Ikke implementeret"
    }
}