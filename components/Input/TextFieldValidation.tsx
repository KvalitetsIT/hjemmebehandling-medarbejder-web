import * as React from 'react';
import { Component } from 'react';
import ApiContext from '../../pages/_context';
import { Box, FormControl, OutlinedInputProps, TextField } from '@mui/material';
import { CriticalLevelEnum, InvalidInputModel } from '@kvalitetsit/hjemmebehandling/Errorhandling/ServiceErrors/InvalidInputError';

export interface Props {
    value?: string;
    id?: string;
    required: boolean;
    disabled?: boolean;
    uniqueId: number;
    inputProps?: Partial<OutlinedInputProps>

    label: string;
    variant: "outlined";
    size: "small" | "medium";
    type: string

    onWheel?: () => void;
    onChange: (input: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void
    validate?: (value: string) => Promise<InvalidInputModel[]>
    onValidation?: (uniqueId: number, error: InvalidInputModel[]) => void
}

export interface State {
    errors: InvalidInputModel[];
}

export class TextFieldValidation extends Component<Props, State> {
    static displayName = TextFieldValidation.name;
    static contextType = ApiContext
    static defaultProps = {
        variant: "outlined",
        size: "small",
        required: false,
        disabled: false,
        type: "string"
    }

    constructor(props: Props) {
        super(props);
        this.state = {
            errors: []
        }
    }

    async validate(input: string): Promise<void> {
        if (!this.props.validate)
            return;

        const errors = await this.props.validate(input);
        this.setState({ errors: errors })
        if (this.props.onValidation) {
            this.props.onValidation(this.props.uniqueId, errors.filter(x => x.criticalLevel == CriticalLevelEnum.ERROR));
        }
    }

    render(): JSX.Element {
        let firstError: InvalidInputModel | undefined = undefined
        let hasError = false


        let color: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' = "primary"
        if (this.state.errors && this.state.errors.length !== 0) {
            firstError = this.state.errors[0];

            if (firstError.criticalLevel == CriticalLevelEnum.ERROR) {
                hasError = true;
            }
            if (firstError.criticalLevel == CriticalLevelEnum.WARNING) {
                color = "warning"
            }
        }

        return (
            <FormControl>
                <Box sx={{ display: 'flex', alignItems: 'baseline' }}>
                {this.props.children}
                    <TextField
                            id={this.props.id}
                            onInput={(e: React.ChangeEvent<HTMLInputElement>) => this.validate(e.target.value)}
                            InputLabelProps={{ shrink: this.props.value ? true : false }}
                            InputProps={this.props.inputProps}
                            label={this.props.label}
                            variant={this.props.variant}
                            error={hasError}
                            color={color}
                            onWheel={() => this.props.onWheel ? this.props.onWheel() : {}}
                            helperText={firstError?.message}
                            disabled={this.props.disabled}
                            onChange={(input) => this.props.onChange(input)}
                            required={this.props.required}
                            size={this.props.size}
                            type={this.props.type}
                            value={this.props.value}>

                        </TextField>
                </Box>

            </FormControl>
        )
    }
}
