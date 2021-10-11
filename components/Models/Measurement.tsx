export class Measurement {
    type! : MeasurementType;
    value! : number
    unit! : UnitType
}

export enum  MeasurementType {
    CRP,
    TEMPERATURE,
    WEIGHT
}

export enum  UnitType {
    KG,
    DEGREASE_CELSIUS,
}