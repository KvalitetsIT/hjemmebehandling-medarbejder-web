import { BaseServiceError } from "./BaseServiceError";

export class InvalidInputError extends BaseServiceError  {
    public propErrors : InvalidInputModel[]
    constructor(propErrors : InvalidInputModel[]){
        super()
        this.propErrors = propErrors;
        this.message = this.displayMessage();
    }
    displayTitle() : string{
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
    criticalLevel : CriticalLevelEnum

    constructor(propName : string, message : string, criticalLevel : CriticalLevelEnum = CriticalLevelEnum.ERROR){
        this.message = message;
        this.propName = propName;
        this.criticalLevel = criticalLevel;
    }

    ToString() : string {
        return this.propName + " ("+ this.message +")"
    }
}

export enum CriticalLevelEnum {
    ERROR,
    WARNING
}