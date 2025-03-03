

import { IBackendApi } from "../apis/interfaces/IBackendApi";
import BaseService from "../components/BaseLayer/BaseService";
import { UnsupportedError } from "../components/Errorhandling/ServiceErrors/UnsupportedError";
import { Answer, BooleanAnswer, NumberAnswer, StringAnswer } from "../components/Models/Answer";
import { CategoryEnum } from "../components/Models/CategoryEnum";
import { MeasurementType } from "../components/Models/MeasurementType";
import { ThresholdCollection } from "../components/Models/ThresholdCollection";
import { ThresholdNumber } from "../components/Models/ThresholdNumber";
import { IQuestionAnswerService } from "./interfaces/IQuestionAnswerService";

export default class QuestionAnswerService extends BaseService implements IQuestionAnswerService {
    backendApi: IBackendApi

    constructor(backendApi: IBackendApi) {
        super()
        this.backendApi = backendApi;
    }

    async GetAllMeasurementTypes(): Promise<MeasurementType[]> {
        try {
            return await this.backendApi.GetAllMeasurementTypes();
        } catch (error) {
            return this.HandleError(error)
        }
    }

    FindCategory(thresholdCollection: ThresholdCollection, answer: Answer<any>): CategoryEnum {
        try {
            if (answer instanceof NumberAnswer) {
                const answerAsNumber = answer as NumberAnswer;
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
                const answerAsString = answer as StringAnswer;
                let thresholdPoint: ThresholdNumber | undefined = undefined;
                if (thresholdCollection.thresholdOptions) {
                    if (thresholdCollection.thresholdOptions.length <= 0)
                        return CategoryEnum.GREEN;

                    thresholdPoint = thresholdCollection.thresholdOptions.find(x => x.option === answerAsString.answer);
                }
                return thresholdPoint ? thresholdPoint.category : CategoryEnum.RED;
            }

            if (answer instanceof BooleanAnswer) {
                const answerAsBoolean = answer as BooleanAnswer;
                let thresholdPoint: ThresholdNumber | undefined = undefined;
                if (thresholdCollection.thresholdOptions) {
                    if (thresholdCollection.thresholdOptions.length <= 0)
                        return CategoryEnum.GREEN;

                    thresholdPoint = thresholdCollection.thresholdOptions.find(x => x.option === answerAsBoolean.AnswerAsString());
                }
                return thresholdPoint ? thresholdPoint.category : CategoryEnum.RED;
            }

            throw new UnsupportedError(answer, "En besvarelse indeholder en ukendt svartype - Kontakt en administrator")

        } catch (error: unknown) {
            return this.HandleError(error);
        }

    }
}



