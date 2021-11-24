import { ThresholdNumber } from "./ThresholdNumber"
import { ThresholdOption } from "./ThresholdOption"

export class ThresholdCollection {

    //careplanId! : string; This class exists on careplan, so no ID required
    quesitonnaireId! : string;
    questionId! : string;

    thresholdNumbers! : ThresholdNumber[]
    thresholdOptions! : ThresholdOption[]
    
}