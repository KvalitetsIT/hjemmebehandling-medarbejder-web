import { ErrorDto } from "../../generated/models";

export class BaseApiError extends Error {
    response : Response;
    errorMessage : string;
    errorCode: number;

    constructor(response : Response, errorMessage: string, errorCode: number){
        super();
        this.response = response
        this.errorMessage = errorMessage
        this.errorCode = errorCode
        let responseStatus = this.response.status ?? "-1"
        let responseText = this.response.statusText ?? "Ingen responsstatus"
        this.message = "("+responseStatus + ") " + responseText;
    }

    displayMessage() : string{
        return this.response.url.includes("?") ? this.response.url.split("?")[0] : this.response.url
    }
    displayTitle() : string{
        let responseStatus = this.response.status ?? "-1"
        let responseText = this.response.statusText ?? "Ingen responsstatus"
        return "("+responseStatus + ") " + responseText + '. Detailed message: ' + this.errorMessage
    }
}