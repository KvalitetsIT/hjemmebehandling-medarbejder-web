export class BaseApiError extends Error {
    response : Response;

    constructor(response : Response){
        super();
        this.response = response;
        this.message = "("+this.response.status + ") " + this.response.statusText;
    }

    displayMessage() : string{
        return this.response.url.includes("?") ? this.response.url.split("?")[0] : this.response.url
    }
    displayTitle() : string{
        return "("+this.response.status + ") " + this.response.statusText;
    }
}