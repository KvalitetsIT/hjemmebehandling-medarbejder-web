import { BaseServiceError } from "./BaseServiceError";

export class UnknownServiceError extends BaseServiceError  {
    error : any;
    constructor(error : any){
        super()
        this.error = error;
        this.message = this.displayMessage();
    }
    displayTitle() : string{
        return "Ukendt fejl"
    }

    displayMessage() : string {
        let message = "";
        message += "Der skete en ukendt fejl"
        return message;
    }
}