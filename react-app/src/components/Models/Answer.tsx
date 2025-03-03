interface IAnswer{
    ToString : () => string
    AnswerAsString : () => string | undefined
}

export abstract class Answer<T> implements IAnswer {
    questionId: string
    answer?: T

    constructor(questionId: string){
        this.questionId = questionId;
    }

    setAnswer(answer: T) {
        this.answer = answer
    }

    abstract ToString() : string
    abstract AnswerAsString() : string | undefined 
}

export class StringAnswer extends Answer<string> {
    
    ToString() : string {
        return this.answer ? this.answer : "" 
    }
    AnswerAsString(): string | undefined {
        return this.answer;
    }
}

export class NumberAnswer extends Answer<number> {
    unit? : UnitType

    ToString() : string {
        let toReturn = "";
        toReturn += this.answer == undefined ? "" : this.answer;

        if(this.unit)
            toReturn += " " + this.unit.toString()
        
        return toReturn
    }
    AnswerAsString(): string | undefined {
        return this.answer ? this.answer as unknown as string : undefined;
    }
}


export class ChoiceAnswer extends Answer<string | number> {
    ToString() : string {
       return this.answer + ""
    }
    AnswerAsString(): string | undefined {
        return this.answer + "";
    }
}

export class BooleanAnswer extends Answer<boolean> {
    ToString() : string {
       return this.answer ? "Ja" : "Nej"
    }
    AnswerAsString(): string | undefined {
        return this.answer + "";
    }
}

export class GroupAnswer extends Answer<Array<any>> {

    ToString(): string {
        return this.answer?.map(answer => answer.ToString()).toString() ?? ""
    }
    AnswerAsString(): string | undefined {
        return this.answer?.map(answer => answer.AnswerAsString()).toString() ?? ""
    }
}

export enum  UnitType {
    KG = "KG",
    DEGREASE_CELSIUS = "Grader",
    NOUNIT = ""
}