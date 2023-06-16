"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorBoundary = void 0;
const material_1 = require("@mui/material");
const react_1 = __importDefault(require("react"));
const BaseServiceError_1 = require("./BaseServiceError");
const DialogError_1 = require("./DialogError");
const ToastError_1 = require("./ToastError");
class ErrorBoundary extends react_1.default.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: undefined,
            open: true
        };
    }
    static getDerivedStateFromError(error, open) {
        // Update state so the next render will show the fallback UI.
        return { error: error, open: true };
    }
    componentDidCatch(error, errorInfo) {
        // You can also log the error to an error reporting service
        console.error(error);
        console.debug(errorInfo);
    }
    render() {
        if (this.state.error) {
            // You can render any custom fallback UI
            if (this.shouldBeLargeError()) {
                return (react_1.default.createElement(DialogError_1.DialogError, { error: this.state.error }));
            }
            return (react_1.default.createElement(react_1.default.Fragment, null,
                this.props.ignoreAlert ? (react_1.default.createElement(material_1.Alert, { severity: "error", title: this.props.ekstraText },
                    react_1.default.createElement(material_1.Typography, { variant: this.props.ekstraText ? "caption" : "inherit" }, "Der er opst\u00E5et en fejl"),
                    react_1.default.createElement(material_1.Typography, null, this.props.ekstraText),
                    this.props.showReloadButton ? react_1.default.createElement(material_1.Button, { onClick: () => { this.reloadPage(); } }, "Genindl\u00E6s") : react_1.default.createElement(react_1.default.Fragment, null))) : this.props.children,
                react_1.default.createElement(ToastError_1.ToastError, { error: this.state.error })));
        }
        return (react_1.default.createElement(react_1.default.Fragment, null, this.props.children));
    }
    shouldBeLargeError() {
        if (this.state.error instanceof BaseServiceError_1.BaseServiceError)
            return this.state.error.displaySettings().displayInLargeDialog;
        return false;
    }
    reloadPage() {
        window.location.replace("/");
    }
}
exports.ErrorBoundary = ErrorBoundary;
ErrorBoundary.defaultProps = {
    rerenderChildren: false,
    ekstraText: "",
    showReloadButton: false
};
