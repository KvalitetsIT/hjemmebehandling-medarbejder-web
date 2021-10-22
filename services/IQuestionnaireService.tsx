import React from "react";
import { Question } from "../components/Models/Question";
import { QuestionnaireResponse } from "../components/Models/QuestionnaireResponse";


export default interface QuestionnaireService {
    findAllQuestions : (questionResponses : Array<QuestionnaireResponse>) => Question[]
    
}
  