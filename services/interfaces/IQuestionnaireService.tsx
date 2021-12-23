import React from "react";
import { Answer } from "@kvalitetsit/hjemmebehandling/Models/Answer";
import { CategoryEnum } from "@kvalitetsit/hjemmebehandling/Models/CategoryEnum";
import { PatientCareplan } from "@kvalitetsit/hjemmebehandling/Models/PatientCareplan";
import { PlanDefinition } from "@kvalitetsit/hjemmebehandling/Models/PlanDefinition";
import { Question } from "@kvalitetsit/hjemmebehandling/Models/Question";
import { Questionnaire } from "@kvalitetsit/hjemmebehandling/Models/Questionnaire";
import { QuestionnaireResponse, QuestionnaireResponseStatus } from "@kvalitetsit/hjemmebehandling/Models/QuestionnaireResponse";
import { Task } from "@kvalitetsit/hjemmebehandling/Models/Task";

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
    UpdateQuestionnaireResponseStatus : (id : string, status : QuestionnaireResponseStatus) => Promise<QuestionnaireResponseStatus>;
    SetQuestionnaireFrequency : (questionnaire : Questionnaire) => Promise<void>;
    RemoveAlarm : (task : Task) => Promise<void>;
}
  
