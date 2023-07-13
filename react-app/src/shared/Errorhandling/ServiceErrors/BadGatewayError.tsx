import { BaseServiceError } from "../BaseServiceError";

export class BadGatewayError extends BaseServiceError {
    errorMessage: string;
    url: string;

    constructor(errorMessage: string, url : string) {
        super()
        this.errorMessage = errorMessage
        this.url = url;
    }
    displayUrl(): string {
        return this.url;
    }
    displayMessage() {
        return this.errorMessage;
    }
    displayTitle(){
        return "502) Fejl i tredjepart"
    }
}