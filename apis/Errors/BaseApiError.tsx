export class BaseApiError extends Error {
    response : Response;

    constructor(response : Response){
        super();
        this.response = response;
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
        return "("+responseStatus + ") " + responseText;
    }
}