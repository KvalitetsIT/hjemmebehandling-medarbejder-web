import { ThresholdNumber } from "./ThresholdNumber"
import { ThresholdOption } from "./ThresholdOption"

export class ThresholdCollection {

    questionId! : string;

    thresholdNumbers? : ThresholdNumber[] = new Array();
    thresholdOptions? : ThresholdOption[] = new Array();
    
}