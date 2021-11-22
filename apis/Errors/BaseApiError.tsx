export class BaseApiError extends Error {
    response : Response;

    constructor(response : Response){
        super();
        this.response = response;
        this.message = "("+this.response.status + ") " + this.response.statusText;
    }

    displayMessage() : string{
        return this.message
    }
    displayTitle() : string{
        return this.response.statusText;
    }
}