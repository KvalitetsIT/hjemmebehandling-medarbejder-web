"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseIcon = void 0;
const React = __importStar(require("react"));
class BaseIcon extends React.Component {
    constructor() {
        var _a, _b, _c, _d;
        super(...arguments);
        this.color = (_b = (_a = this.props) === null || _a === void 0 ? void 0 : _a.color) !== null && _b !== void 0 ? _b : "black"; // Defaults to black
        this.size = (_d = (_c = this.props) === null || _c === void 0 ? void 0 : _c.size) !== null && _d !== void 0 ? _d : "2rem"; // Defaults to black
    }
    render() {
        return (React.createElement("div", { style: {
                backgroundColor: this.color,
                WebkitMask: `url(${this.props.src}) no-repeat center`,
                mask: `url(${this.props.src}) no-repeat center`,
                height: this.size,
                width: this.size,
            } }));
    }
}
exports.BaseIcon = BaseIcon;
