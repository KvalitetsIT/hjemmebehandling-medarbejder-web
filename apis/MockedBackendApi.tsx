import { CategoryEnum } from "../components/Models/CategoryEnum";
import { Patient } from "../components/Models/Patient";
import { Questionnaire } from "../components/Models/Questionnaire";
import { QuestionnaireResponse } from "../components/Models/QuestionnaireResponse";
import { IBackendApi } from "./IBackendApi";


export class MockedBackendApi implements IBackendApi {
    results: QuestionnaireResponse[] = [];
    GetQuestionnaireResponses(categories : Array<CategoryEnum>, page : number, pagesize : number) : Array<QuestionnaireResponse>{
        
        let array: QuestionnaireResponse[] = [];
        if(this.results.length == 0){
            let numberOfPatients = pagesize;
            for(let i = 0; i < numberOfPatients; i++ ){
                let category = categories[this.getRandomInt(0,categories.length-1)]
                array.push(this.createRandomPatient(category));
            }
            this.results = array;        
        }
        return this.results.sort( (a,b)=>b.category - a.category);
    }
    createRandomPatient(category : CategoryEnum) : QuestionnaireResponse{

        let names = ["Jens","Peter","Morten","Mads", "Thomas", "Eva", "Lene", "Frederik","Oscar"]
        let questionnaireNames = ["IVF til immundefekt"]

        let firstName = names[this.getRandomInt(0,names.length-1)]
        let lastName = names[this.getRandomInt(0,names.length-1)] + "sen"
        let questionnaireName = questionnaireNames[this.getRandomInt(0,questionnaireNames.length-1)]
        

        let questionnaireResponse = new QuestionnaireResponse();
        questionnaireResponse.patient = new Patient(firstName + " " + lastName,this.generateCPR());
        questionnaireResponse.category = category;
        questionnaireResponse.answeredTime = new Date();
        questionnaireResponse.questionnaire = new Questionnaire(questionnaireName);

        return questionnaireResponse;

    }

    getRandomInt(min : number, max : number) : number {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    generateCPR() : string {
        let cpr = "";
        for(let i = 0; i<10;i++){
            cpr += this.getRandomInt(0,10);
        }
        return cpr;

    }


}
