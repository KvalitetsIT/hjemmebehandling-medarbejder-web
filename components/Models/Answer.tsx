//TODO: Find out how to answer with a number, or checkboxes or multiplechoice etc
export interface Answer{
    ToString : () => string
}

export class StringAnswer implements Answer{
    
    answer! : string
    ToString() : string {
        return this.answer ? this.answer : "" 
    }
}

export class NumberAnswer implements Answer {
    answer! : number
    unit! : UnitType
    
    ToString() : string {
        if(this.unit)
            return this.answer ? this.answer + " " + this.unit.toString() : "" 
        
        return this.answer ? this.answer + "" : "" 
    }
}
export enum  UnitType {
    KG = "KG",
    DEGREASE_CELSIUS = "Grader",
    NOUNIT = ""
}