import { Answer } from "./Answer";
import { CategoryEnum } from "./CategoryEnum";
import { PatientSimple } from "./PatientSimple";
import { Question } from "./Question";

export class QuestionnaireResponse {
    id! : string
    questionnaireId! : string
    //measurements! : Map<MeasurementType,Measurement>
    questions! : Map<Question,Answer>;
    answeredTime! : Date | undefined ;
    status! : QuestionnaireResponseStatus
    category! : CategoryEnum;
    patient! : PatientSimple

}

export enum  MeasurementType {
    CRP = "CRP",
    TEMPERATURE = "TEMPERATUR",
    WEIGHT = "VÆGT"
}

export enum  QuestionnaireResponseStatus {
    Processed = "Behandlet",
    InProgress = "Under behandling",
    NotProcessed = "Ikke behandlet",
    NotAnswered = "Ikke besvaret"
}