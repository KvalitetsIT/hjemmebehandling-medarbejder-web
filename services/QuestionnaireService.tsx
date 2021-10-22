import React from "react";
import { Question } from "../components/Models/Question";
import { QuestionnaireResponse } from "../components/Models/QuestionnaireResponse";
import IQuestionnaireService from "./IQuestionnaireService";

export default class QuestionnaireService implements IQuestionnaireService {
    findAllQuestions(questionResponses : Array<QuestionnaireResponse>) : Question[]{
        let questions : Question[] = [];
        questionResponses.forEach(singleResponse => {
            let iterator = singleResponse.questions.entries();
            let element = iterator.next();
            while(!element.done){
                
                let candidate = element.value[0];
                let questionAlreadyExists = questions.some(q => q.isEqual(candidate))
    
                if(!questionAlreadyExists){
                    questions.push(candidate)
                }
                element = iterator.next()
            }
    
        });
        return questions;
    }
    
}
  