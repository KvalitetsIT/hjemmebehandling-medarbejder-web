import { StringToEnumMappers } from "../Helpers/ModelHelpers/StringToEnumMappers";
import { BaseModelStatus } from "./BaseModelStatus";
import { FhirRessource } from "./FhirRessource";
import { Frequency } from "./Frequency";
import { PlanDefinition, PlanDefinitionStatus } from "./PlanDefinition";
import { BaseQuestion, CallToActionQuestion, Question, QuestionTypeEnum } from "./Question";
import { ThresholdCollection } from "./ThresholdCollection";

export class Questionnaire extends FhirRessource {
    id!: string;
    name?: string;
    frequency?: Frequency;
    thresholds?: ThresholdCollection[];
    questions?: BaseQuestion[]
    status?: QuestionnaireStatus | BaseModelStatus;
    lastUpdated?: Date;
    staticReviewSummaryHtml? : string;

    getCallToActions(): CallToActionQuestion[] {
        return this.questions?.filter(q => q instanceof CallToActionQuestion && q.type == QuestionTypeEnum.CALLTOACTION) ?? []
    }

    getParentQuestions(): Question[] {
        return this.questions?.filter(q => q instanceof Question && q.enableWhen?.questionId == undefined) ?? []
    }

    getChildQuestions(questionId?: string): Question[] {
        let toReturn = this.questions?.filter(q => q instanceof Question && q.enableWhen?.questionId != undefined)
        if (questionId)
            toReturn = toReturn?.filter(q => q instanceof Question && q.enableWhen?.questionId == questionId)

        return toReturn ?? []
    }

    static stringToQuestionnaireStatus(stringStatus?: string): QuestionnaireStatus | BaseModelStatus {

        switch (stringStatus) {
            // If Questionnaire should have different status' than BaseModelStatus, they are added here like
            //case "InQuestion":
            //  return QuestionnaireStatus.InQuestion
        }
        return StringToEnumMappers.stringToBaseModelStatus(stringStatus);
    }
}

export enum QuestionnaireStatus {
    //Only status' specific to questionnaire should be listed here - Otherwise in BaseModelStatus
}