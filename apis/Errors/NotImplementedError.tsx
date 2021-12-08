import { BaseApiError } from "./BaseApiError";
import { ErrorDtoFromJSON } from "../../generated/models";

export class NotImplementedError extends BaseApiError {
    constructor(){
        super(new Response(), "error", -1)
    }
    displayMessage() {
        return "Denne feature er endnu ikke klar";
    }
    displayTitle(){
        return "Ikke implementeret"
    }
}