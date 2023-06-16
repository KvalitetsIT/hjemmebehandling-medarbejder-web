"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const material_1 = require("@mui/material");
const react_2 = __importDefault(require("react"));
class IsEmptyCard extends react_1.Component {
    render() {
        const listIsEmpty = this.props.list === undefined || this.props.list === null || this.props.list.length === 0;
        const objectIsUndefined = this.props.object === undefined;
        if (listIsEmpty && objectIsUndefined) {
            if (this.props.useRawJsxWhenEmpty)
                return react_2.default.createElement(react_2.default.Fragment, null, this.props.jsxWhenEmpty);
            return (react_2.default.createElement(material_1.Card, null,
                react_2.default.createElement(material_1.CardContent, null,
                    react_2.default.createElement(material_1.Typography, null, this.props.jsxWhenEmpty))));
        }
        return this.props.children;
    }
}
exports.default = IsEmptyCard;
IsEmptyCard.defaultProps = {
    useRawJsxWhenEmpty: false
};
