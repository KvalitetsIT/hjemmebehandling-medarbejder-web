import { TextField } from "@mui/material";
import { Field } from "formik";
import { Component } from "react";


interface Props {
  fieldType: React.Component
  name: string
  type: "text" | "number"
  variant: "outlined" | "filled" | "standard"
  label: string
  error?: string
  size: "small" | "medium";
  maxWidth?: string | number
  minWidth?: string | number
  className?: string
  disabled?: boolean
  onWheel?: () => void;
}


export class ValidatedInput extends Component<Props, {}> {
  static defaultProps = {
    fieldType: TextField,
    type: "text",
    variant: "outlined",
    size: "medium",
    maxWidth: 1000,
    minWidth: 300
  }

  constructor(props: Props) {
    super(props)

    this.state = {

    }
  }

  render(): JSX.Element {
    return (<Field
      id={this.props.name}
      as={this.props.fieldType}
      error={Boolean(this.props.error)}
      onWheel={() => this.props.onWheel ? this.props.onWheel() : {}}
      helperText={this.props.error}
      disabled={this.props.disabled}
  
      sx={{
          minWidth: this.props.minWidth,
          maxWidth: this.props.maxWidth,
      }}
      {...this.props}
    />)
  }
}