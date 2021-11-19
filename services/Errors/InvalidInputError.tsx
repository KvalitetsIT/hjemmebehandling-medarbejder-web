import { BaseServiceError } from "./BaseServiceError";

export class InvalidInputError extends Error implements BaseServiceError  {
    public propErrors : InvalidInputModel[]
    constructor(propErrors : InvalidInputModel[]){
        super()
        this.propErrors = propErrors;
        this.message = this.displayMessage();
    }
    displayTitle () : string{
        let message = "";
        message += "Indtastningsfejl"
        return message; 
    }

    displayMessage() : string {
        let message = "";
        message += "Fejl i flg parametre; "
        message += this.propErrors.map(x=> x.ToString()).join(", ");
        return message;
    }
}

export class InvalidInputModel{
    propName : string
    message : string

    constructor(propName : string, message : string){
        this.message = message;
        this.propName = propName;
    }

    ToString() : string {
        return this.propName + " ("+ this.message +")"
    }
}