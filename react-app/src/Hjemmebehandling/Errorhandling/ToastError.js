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
exports.ToastError = void 0;
const react_1 = __importStar(require("react"));
const material_1 = require("@mui/material");
const BaseServiceError_1 = require("./BaseServiceError");
const Toast_1 = require("./Toast");
const UnknownServiceError_1 = require("./ServiceErrors/UnknownServiceError");
class ToastError extends react_1.Component {
    constructor(props) {
        super(props);
        this.closeSnackbar = () => {
            this.setState({ snackbarOpen: false });
        };
    }
    render() {
        return (react_1.default.createElement(react_1.default.Fragment, null, [this.props.error].map(e => {
            let error = new UnknownServiceError_1.UnknownServiceError(e);
            if (e instanceof BaseServiceError_1.BaseServiceError) {
                error = e;
            }
            return this.renderError(error.displayTitle(), error.displayUrl(), error.displayMessage());
        })));
    }
    renderError(title, url, message) {
        return (react_1.default.createElement(Toast_1.Toast, { snackbarColor: "error", snackbarTitle: "" },
            react_1.default.createElement(material_1.Stack, null,
                react_1.default.createElement(material_1.Typography, { variant: "subtitle1" }, title),
                react_1.default.createElement(material_1.Typography, { variant: "caption" }, url)),
            react_1.default.createElement(material_1.Typography, { whiteSpace: "pre-wrap" }, message)));
    }
}
exports.ToastError = ToastError;
ToastError.defaultProps = {
    severity: "error"
};
