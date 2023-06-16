"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestionTypeEnum = exports.CallToActionQuestion = exports.Question = exports.BaseQuestion = void 0;
class BaseQuestion {
    isEqual(other) {
        return this.Id === other.Id;
    }
}
exports.BaseQuestion = BaseQuestion;
class Question extends BaseQuestion {
}
exports.Question = Question;
class CallToActionQuestion extends BaseQuestion {
    constructor() {
        super();
        this.type = QuestionTypeEnum.CALLTOACTION;
    }
}
exports.CallToActionQuestion = CallToActionQuestion;
var QuestionTypeEnum;
(function (QuestionTypeEnum) {
    QuestionTypeEnum["CHOICE"] = "CHOICE";
    QuestionTypeEnum["BOOLEAN"] = "BOOLEAN";
    QuestionTypeEnum["INTEGER"] = "INTEGER";
    QuestionTypeEnum["OBSERVATION"] = "M\u00E5ling";
    QuestionTypeEnum["STRING"] = "STRING";
    QuestionTypeEnum["CALLTOACTION"] = "CALLTOACTION";
})(QuestionTypeEnum = exports.QuestionTypeEnum || (exports.QuestionTypeEnum = {}));
