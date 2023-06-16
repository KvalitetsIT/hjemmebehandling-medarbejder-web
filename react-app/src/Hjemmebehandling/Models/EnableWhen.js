"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnableWhen = void 0;
/**
 * EnableWhen-object represents a predicate
 * So when the predicate is true the question will be shown
 */
class EnableWhen {
    ShouldBeEnabled(actualAnswerValue) {
        //TODO: Use operator
        return actualAnswerValue == this.answer;
    }
}
exports.EnableWhen = EnableWhen;
