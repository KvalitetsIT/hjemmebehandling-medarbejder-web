import React from "react";
import { Answer } from "../../components/Models/Answer";
import { CategoryEnum } from "../../components/Models/CategoryEnum";
import { Question } from "../../components/Models/Question";
import { Questionnaire } from "../../components/Models/Questionnaire";
import { QuestionnaireResponse } from "../../components/Models/QuestionnaireResponse";


export default interface QuestionnaireService {
    findAllQuestions : (questionResponses : Array<QuestionnaireResponse>) => Question[]
    findAnswer : (desiredQuestion : Question, questionResponses : QuestionnaireResponse) => Answer | undefined;
    SetQuestionaireResponse : (id : string, questionnaireResponses : QuestionnaireResponse) => Promise<void>;
    GetTasklist : (categories : Array<CategoryEnum>, page : number, pagesize : number) => Promise<Array<Questionnaire>>
}
  