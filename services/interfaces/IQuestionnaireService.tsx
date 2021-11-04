import React from "react";
import { Answer } from "../../components/Models/Answer";
import { CategoryEnum } from "../../components/Models/CategoryEnum";
import { PatientCareplan } from "../../components/Models/PatientCareplan";
import { Question } from "../../components/Models/Question";
import { Questionnaire } from "../../components/Models/Questionnaire";
import { QuestionnaireResponse } from "../../components/Models/QuestionnaireResponse";


export default interface IQuestionnaireService {
    
    //FIND
    findAllQuestions : (questionResponses : Array<QuestionnaireResponse>) => Question[]
    findAnswer : (desiredQuestion : Question, questionResponses : QuestionnaireResponse) => Answer | undefined;
    
    //GET
    GetTasklist : (categories : Array<CategoryEnum>, page : number, pagesize : number) => Promise<Array<Questionnaire>>
    GetQuestionnairesList : () => Promise<Array<Questionnaire>>

    //SET
    SetQuestionaireResponse : (id : string, questionnaireResponses : QuestionnaireResponse) => Promise<void>;
    AddQuestionnaireToCareplan : (careplan: PatientCareplan, questionnaireToAdd: Questionnaire) => Promise<PatientCareplan>
}
  