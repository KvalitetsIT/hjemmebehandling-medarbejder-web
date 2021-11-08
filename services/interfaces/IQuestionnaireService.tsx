import React from "react";
import { Answer } from "../../components/Models/Answer";
import { CategoryEnum } from "../../components/Models/CategoryEnum";
import { PatientCareplan } from "../../components/Models/PatientCareplan";
import { PlanDefinition } from "../../components/Models/PlanDefinition";
import { Question } from "../../components/Models/Question";
import { Questionnaire } from "../../components/Models/Questionnaire";
import { QuestionnaireResponse, QuestionnaireResponseStatus } from "../../components/Models/QuestionnaireResponse";

export default interface IQuestionnaireService {
    
    //FIND
    findAllQuestions : (questionResponses : Array<QuestionnaireResponse>) => Question[]
    findAnswer : (desiredQuestion : Question, questionResponses : QuestionnaireResponse) => Answer | undefined;
    
    //GET
    GetUnfinishedQuestionnaireResponses : (page : number, pagesize : number) => Promise<Array<Questionnaire>>
    GetUnansweredQuestionnaires : (page : number, pagesize : number) => Promise<Array<Questionnaire>>
    GetAllPlanDefinitions : () => Promise<Array<PlanDefinition>>

    //SET
    SetQuestionaireResponse : (id : string, questionnaireResponses : QuestionnaireResponse) => Promise<void>;
    AddQuestionnaireToCareplan : (careplan: PatientCareplan, questionnaireToAdd: Questionnaire) => Promise<PatientCareplan>
    UpdateQuestionnaireResponseStatus : (id : string, status : QuestionnaireResponseStatus) => Promise<void>;
}
  