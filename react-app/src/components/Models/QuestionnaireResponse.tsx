import { Answer } from "./Answer";
import { CategoryEnum } from "./CategoryEnum";
import { FhirRessource } from "./FhirRessource";
import { PatientSimple } from "./PatientSimple";
import { Question } from "./Question";

export class QuestionnaireResponse extends FhirRessource{
    id! : string
    questionnaireId! : string
    carePlanId!: string
    questions? : Map<Question,Answer<any>>;
    answeredTime! : Date | undefined ;
    examinedTime? : Date | undefined ;
    status! : QuestionnaireResponseStatus
    category! : CategoryEnum;
    patient! : PatientSimple

}

export enum  QuestionnaireResponseStatus {
    Processed = "Behandlet",
    InProgress = "Under behandling",
    NotProcessed = "Ikke behandlet",
    NotAnswered = "Ikke besvaret"
}
