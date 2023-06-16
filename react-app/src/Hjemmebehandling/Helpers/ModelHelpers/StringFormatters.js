"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StringFormatter = void 0;
class StringFormatter {
    static FormatPhonenumber(phonenumber) {
        var _a;
        if (!phonenumber)
            return "";
        let landcode = phonenumber.startsWith("+") ? phonenumber.slice(0, 3) + " " : "";
        let onlyphone = phonenumber.startsWith("+") ? phonenumber.slice(3) : phonenumber;
        return landcode + ((_a = onlyphone.match(/.{1,2}/g)) === null || _a === void 0 ? void 0 : _a.join(" "));
    }
    static FormatCpr(cpr) {
        if (!cpr)
            return "";
        return cpr.slice(0, 6) + "-" + cpr.slice(6);
    }
}
exports.StringFormatter = StringFormatter;
