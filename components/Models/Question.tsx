import { IComparable } from "./Interfaces/IComparable";
import { ThresholdNumber } from "./ThresholdNumber";
import { ThresholdOption } from "./ThresholdOption";

export class Question implements IComparable<Question>{
    isEqual(other: Question){
        return this.question === other.question;
    }
    
    question! : string
    
    options : ThresholdOption[] = []
    thresholdPoint : ThresholdNumber[] = []
}