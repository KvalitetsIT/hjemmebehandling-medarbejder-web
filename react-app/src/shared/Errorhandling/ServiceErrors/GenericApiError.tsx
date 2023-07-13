import { BaseApiError } from "../BaseApiError";
import { BaseServiceError } from "../BaseServiceError";

export class GenericApiError extends BaseServiceError {
    apiError: BaseApiError;

    constructor(apiError : BaseApiError) {
        super()
        this.apiError = apiError   
    }

    displayMessage() {
        return this.apiError.displayMessage();
    }
    displayTitle(){
        return this.apiError.displayTitle()
    }
}