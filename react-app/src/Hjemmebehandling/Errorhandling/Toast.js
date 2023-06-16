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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Toast = void 0;
const React = __importStar(require("react"));
const react_1 = require("react");
const Alert_1 = __importDefault(require("@mui/material/Alert"));
const material_1 = require("@mui/material");
class Toast extends react_1.Component {
    constructor(props) {
        super(props);
        this.closeSnackbar = () => {
            if (this.props.onClose)
                this.props.onClose();
            this.setState({ snackbarOpen: false });
        };
        this.state = {
            snackbarOpen: true
        };
    }
    TransitionUp(props) {
        return React.createElement(material_1.Slide, Object.assign({}, props, { direction: "up" }));
    }
    render() {
        let props = this.props;
        return (React.createElement(React.Fragment, null,
            React.createElement(material_1.Snackbar, { TransitionComponent: this.TransitionUp, open: this.state.snackbarOpen, autoHideDuration: 6000, onClose: this.closeSnackbar, anchorOrigin: { vertical: this.props.positionVertical, horizontal: this.props.positionhorizontal } },
                React.createElement(Alert_1.default, { icon: this.props.icon, severity: props.snackbarColor, sx: { width: '100%' } },
                    React.createElement(material_1.Stack, { direction: "row", alignItems: "center", spacing: 2 },
                        React.createElement(material_1.Stack, null,
                            React.createElement(material_1.Typography, null, props.snackbarTitle),
                            props.children))))));
    }
}
exports.Toast = Toast;
Toast.displayName = Toast.name;
Toast.defaultProps = {
    positionVertical: "bottom",
    positionhorizontal: "right",
    onClose: () => { }
};
