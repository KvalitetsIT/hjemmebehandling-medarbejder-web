export class BaseApiError extends Error {
    response : Response;
    errorMessage : string;
    errorCode: number;

    constructor(response : Response, errorMessage: string, errorCode: number){
        super();
        this.response = response
        this.errorMessage = errorMessage
        this.errorCode = errorCode
        this.message = this.displayTitle() + ": " + errorMessage ;
    }

    displayUrl() : string{
        return this.response.url.includes("?") ? this.response.url.split("?")[0] : this.response.url
    }
    displayMessage() : string{
        return this.errorMessage
    }
    displayTitle() : string{
        let responseStatus = this.response.status ?? "-1"
        let responseText = this.response.statusText ?? ""
        return "("+responseStatus + ") " + responseText ;
    }
}