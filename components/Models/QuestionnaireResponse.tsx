import { Answer } from "./Answer";
import { CategoryEnum } from "./CategoryEnum";
import { PatientSimple } from "./PatientSimple";
import { Question } from "./Question";
import { Questionnaire } from "./Questionnaire";

export class QuestionnaireResponse {
    id! : string
    //measurements! : Map<MeasurementType,Measurement>
    questions! : Map<Question,Answer>
    answeredTime! : Date | undefined ;
    status! : QuestionnaireResponseStatus | undefined
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
    NotProcessed = "Ikke behandlet",
    InProgress = "Under behandling"
}