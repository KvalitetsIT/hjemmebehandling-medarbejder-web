import { CategoryEnum } from "./CategoryEnum";

export class Task {
    cpr! : string
    category! : CategoryEnum
    firstname? : string
    lastname? : string
    questionnaireResponseStatus? : string
    questionnaireName! : string
    questionnaireId! : string
    answeredTime? : Date
    responseLinkEnabled! : boolean
}