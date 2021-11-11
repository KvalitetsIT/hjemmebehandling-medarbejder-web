import React from "react";
import { Answer } from "../../components/Models/Answer";
import { CategoryEnum } from "../../components/Models/CategoryEnum";
import { PatientCareplan } from "../../components/Models/PatientCareplan";
import { PlanDefinition } from "../../components/Models/PlanDefinition";
import { Question } from "../../components/Models/Question";
import { Questionnaire } from "../../components/Models/Questionnaire";
import { QuestionnaireResponse, QuestionnaireResponseStatus } from "../../components/Models/QuestionnaireResponse";
import { Task } from "../../components/Models/Task";

export default interface IQuestionnaireService {
    
    //FIND
    findAllQuestions : (questionResponses : Array<QuestionnaireResponse>) => Question[]
    findAnswer : (desiredQuestion : Question, questionResponses : QuestionnaireResponse) => Answer | undefined;
    
    //GET
    GetUnfinishedQuestionnaireResponseTasks : (page : number, pagesize : number) => Promise<Array<Task>>
    GetUnansweredQuestionnaireTasks : (page : number, pagesize : number) => Promise<Array<Task>>
    GetAllPlanDefinitions : () => Promise<Array<PlanDefinition>>
    GetQuestionnaireResponses : (careplanId : string, questionnaireIds : string[], page : number, pagesize : number) => Promise<QuestionnaireResponse[]>

    //SET
    SetQuestionaireResponse : (id : string, questionnaireResponses : QuestionnaireResponse) => Promise<void>;
    AddQuestionnaireToCareplan : (careplan: PatientCareplan, questionnaireToAdd: Questionnaire) => Promise<PatientCareplan>
    UpdateQuestionnaireResponseStatus : (id : string, status : QuestionnaireResponseStatus) => Promise<void>;
    SetQuestionnaireFrequency : (questionnaire : Questionnaire) => Promise<void>;
}
  
