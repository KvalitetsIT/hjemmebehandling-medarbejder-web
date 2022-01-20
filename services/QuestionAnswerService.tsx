

import { IBackendApi } from "../apis/IBackendApi";
import { Answer, BooleanAnswer, NumberAnswer, StringAnswer } from "@kvalitetsit/hjemmebehandling/Models/Answer";
import { CategoryEnum } from "@kvalitetsit/hjemmebehandling/Models/CategoryEnum";
import { ThresholdCollection } from "@kvalitetsit/hjemmebehandling/Models/ThresholdCollection";
import { ThresholdNumber } from "@kvalitetsit/hjemmebehandling/Models/ThresholdNumber";
import { ThresholdOption } from "@kvalitetsit/hjemmebehandling/Models/ThresholdOption";
import BaseService from "@kvalitetsit/hjemmebehandling/BaseLayer/BaseService";
import IQuestionAnswerService from "./interfaces/IQuestionAnswerService";
import { UnsupportedError } from "@kvalitetsit/hjemmebehandling/Errorhandling/ServiceErrors/UnsupportedError";

export default class QuestionAnswerService extends BaseService implements IQuestionAnswerService {
    backendApi: IBackendApi

    constructor(backendApi: IBackendApi) {
        super()
        this.backendApi = backendApi;
    }
    SetThresholdNumber(thresholdId: string, threshold: ThresholdNumber): Promise<void> {
        try {
            return this.backendApi.SetThresholdNumber(thresholdId, threshold);
        } catch (error: any) {
            return this.HandleError(error);
        }
    };
    SetThresholdOption(thresholdId: string, threshold: ThresholdOption): Promise<void> {
        try {
            return this.backendApi.SetThresholdOption(thresholdId, threshold);
        } catch (error: any) {
            return this.HandleError(error);
        }
    };

    FindCategory(thresholdCollection: ThresholdCollection, answer: Answer): CategoryEnum {
        try {
            if (answer instanceof NumberAnswer) {
                let answerAsNumber = answer as NumberAnswer;
                let thresholdPoint: ThresholdNumber | undefined = undefined;

                if (thresholdCollection.thresholdNumbers) {
                    if (thresholdCollection.thresholdNumbers.length <= 0)
                        return CategoryEnum.GREEN;

                    thresholdPoint = thresholdCollection.thresholdNumbers
                        .sort((a, b) => b.category - a.category) //Red wil be first, then yellow, then green and then blue
                        .find(x => (x.from === undefined || x.from <= answerAsNumber.answer!) && (x.to === undefined || answerAsNumber.answer! <= x.to)); //Get the first and most critical threshold which matches our answer

                    return thresholdPoint ? thresholdPoint.category : CategoryEnum.RED;
                }
            }

            if (answer instanceof StringAnswer) {
                let answerAsString = answer as StringAnswer;
                let thresholdPoint: ThresholdNumber | undefined = undefined;
                if (thresholdCollection.thresholdOptions) {
                    if (thresholdCollection.thresholdOptions.length <= 0)
                        return CategoryEnum.GREEN;

                    thresholdPoint = thresholdCollection.thresholdOptions.find(x => x.option == answerAsString.answer);
                }
                return thresholdPoint ? thresholdPoint.category : CategoryEnum.RED;
            }

            if (answer instanceof BooleanAnswer) {
                let answerAsBoolean = answer as BooleanAnswer;
                let thresholdPoint: ThresholdNumber | undefined = undefined;
                if (thresholdCollection.thresholdOptions) {
                    if (thresholdCollection.thresholdOptions.length <= 0)
                        return CategoryEnum.GREEN;

                    thresholdPoint = thresholdCollection.thresholdOptions.find(x => x.option == answerAsBoolean.answer.toString());
                }
                return thresholdPoint ? thresholdPoint.category : CategoryEnum.RED;
            }

            throw new UnsupportedError(answer, "En besvarelse indeholder en ukendt svartype - Kontakt en adminstrator")

        } catch (error: any) {
            return this.HandleError(error);
        }

    }
}



