export class BaseApiError extends Error {
    response? : Response;
    errorMessage? : string;
    errorCode?: number;

    constructor(response? : Response, errorMessage?: string, errorCode?: number){
        super();
        this.response = response
        this.errorMessage = errorMessage
        this.errorCode = errorCode
        this.message = this.displayTitle() + ": " + errorMessage ;
    }

    displayUrl() : string{
        return this.response ? this.response.url.includes("?") ? this.response.url.split("?")[0] : this.response.url : "Ingen url tilgængelig"
    }
    displayMessage() : string{
        return this.errorMessage ?? "Ingen fejlbesked tilgængelig"
    }
    displayTitle() : string{
        if(!this.response){
            return "Manglende respons"
        }
        let responseStatus = this.response.status ?? "-1"
        let responseText = this.response.statusText ?? ""
        return "("+responseStatus + ") " + responseText ;
    }
}