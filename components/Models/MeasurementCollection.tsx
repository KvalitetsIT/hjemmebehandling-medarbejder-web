import { Measurement } from "./Measurement";

export class MeasurementCollection {
    id! : string
    measurements! : Map<MeasurementType,Measurement>
    time! : Date;
    status! : MeasurementCollectionStatus

}
export enum  MeasurementType {
    CRP = "CRP",
    TEMPERATURE = "TEMPERATUR",
    WEIGHT = "VÆGT"
}

export enum  MeasurementCollectionStatus {
    Processed = "Behandlet",
    NotProcessed = "Ikke behandlet",
    InProgress = "Under behandling"
}