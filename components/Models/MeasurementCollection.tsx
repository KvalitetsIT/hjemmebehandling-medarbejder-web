import { Measurement } from "./Measurement";

export class MeasurementCollection {
    measurements! : Measurement[] ;
    time! : Date;
    status! : MeasurementCollectionStatus

}

export enum  MeasurementCollectionStatus {
    Processed,
    NotProcessed,
    InProgress
}