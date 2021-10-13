import { IComparable } from "./Interfaces/IComparable";

export class Question implements IComparable<Question>{
    isEqual(other: Question){
        return this.question == other.question;
    }
    
    question! : string
}