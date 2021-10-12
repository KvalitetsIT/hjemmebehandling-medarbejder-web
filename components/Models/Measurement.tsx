export class Measurement {
    value! : number;
    unit! : UnitType
}



export enum  UnitType {
    KG = "KG",
    DEGREASE_CELSIUS = "Grader",
}