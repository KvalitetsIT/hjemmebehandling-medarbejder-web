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
exports.DialogError = void 0;
const material_1 = require("@mui/material");
const react_1 = __importStar(require("react"));
const BaseServiceError_1 = require("./BaseServiceError");
class DialogError extends react_1.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: true
        };
        this.closeDialog = this.closeDialog.bind(this);
        this.logout = this.logout.bind(this);
        this.reloadPage = this.reloadPage.bind(this);
    }
    render() {
        const error = this.props.error;
        const shouldShowReloadButton = error.displaySettings().showRefreshButton;
        const shouldShowLogout = error.displaySettings().showLogoutButton;
        const showCloseButton = error.displaySettings().showCloseButton;
        return (react_1.default.createElement(material_1.Dialog, { fullWidth: true, open: this.state.open },
            react_1.default.createElement(material_1.DialogTitle, { id: "alert-dialog-title" },
                react_1.default.createElement(material_1.Stack, { direction: "row", alignItems: "center", spacing: 1 },
                    this.props.iconAtStart,
                    react_1.default.createElement(material_1.Stack, null,
                        react_1.default.createElement(material_1.Typography, { variant: "h6" }, error.displayTitle()),
                        react_1.default.createElement(material_1.Typography, { variant: "caption" }, error.displayUrl())))),
            react_1.default.createElement(material_1.Divider, null),
            react_1.default.createElement(material_1.DialogContent, null,
                react_1.default.createElement(material_1.DialogContentText, null,
                    react_1.default.createElement(material_1.Typography, { variant: "body1", style: { whiteSpace: 'pre-line' } }, error.displayMessage()),
                    this.props.children)),
            react_1.default.createElement(material_1.Divider, null),
            react_1.default.createElement(material_1.DialogActions, null,
                showCloseButton ? react_1.default.createElement(material_1.Button, { onClick: () => this.closeDialog() }, "Luk besked") : react_1.default.createElement(react_1.default.Fragment, null),
                shouldShowReloadButton ? react_1.default.createElement(material_1.Button, { onClick: this.reloadPage }, "Opdat\u00E9r siden") : react_1.default.createElement(react_1.default.Fragment, null),
                shouldShowLogout ? react_1.default.createElement(material_1.Button, { variant: "contained", onClick: this.logout }, "Log ud") : react_1.default.createElement(react_1.default.Fragment, null))));
    }
    logout() {
        window.location.href = "/oauth2/sign_out";
    }
    reloadPage() {
        window.location.replace("/");
    }
    closeDialog() {
        var _a;
        const error = this.props.error;
        if (error instanceof BaseServiceError_1.BaseServiceError && (error === null || error === void 0 ? void 0 : error.displaySettings().whenClosed))
            (_a = error === null || error === void 0 ? void 0 : error.displaySettings()) === null || _a === void 0 ? void 0 : _a.whenClosed();
        this.setState({ open: false });
    }
}
exports.DialogError = DialogError;
