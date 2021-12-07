export class BaseApiError extends Error {
    response : Response
    detailedMessage: string

    constructor(response : Response){
        super();
        this.response = response
        this.detailedMessage = ''
        let responseStatus = this.response.status ?? "-1"
        let responseText = this.response.statusText ?? "Ingen responsstatus"
        this.message = "("+responseStatus + ") " + responseText;
    }

    displayMessage() : string{
        return this.response.url.includes("?") ? this.response.url.split("?")[0] : this.response.url
    }

    async displayTitle() : Promise<string>  {
        let responseStatus = this.response.status ?? "-1"
        let responseText = this.response.statusText ?? "Ingen responsstatus"

        if(!this.detailedMessage) {
            await this.response.json().then(data => this.detailedMessage = data['message'] ?? '')
        }

        return "("+responseStatus + ") " + responseText + '. Detailed message: ' + this.detailedMessage;
    }
}