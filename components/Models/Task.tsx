import { CategoryEnum } from "./CategoryEnum";

export class Task {
    cpr! : string
    category! : CategoryEnum
    firstname? : string
    lastname? : string
    questionnaireResponseStatus? : string
    questionnaireName! : string
    carePlanId!: string
    questionnaireId! : string
    answeredTime? : Date
    responseLinkEnabled! : boolean
}