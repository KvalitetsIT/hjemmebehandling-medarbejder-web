import * as React from 'react';
import { Component } from 'react';
import ApiContext from '../../pages/_context';
import { Box, FormControl, OutlinedInputProps, TextField, Typography } from '@mui/material';
import { CriticalLevelEnum, InvalidInputModel } from '@kvalitetsit/hjemmebehandling/Errorhandling/ServiceErrors/InvalidInputError';
import { ValidateInputEvent, ValidateInputEventData } from '@kvalitetsit/hjemmebehandling/Events/ValidateInputEvent';

export interface Props {
    value?: string;
    id?: string;
    className?: string;
    sectionName?: string;
    required: boolean;
    disabled?: boolean;
    uniqueId: string;
    inputProps?: Partial<OutlinedInputProps>
    rows?: number;
    label: string;
    variant: "outlined" | "standard" | "filled"
    size: "small" | "medium";
    type: string
    autoFocus?: boolean
    maxWidth: string | number
    minWidth: string | number
    multiline?: boolean;
    onWheel?: () => void;
    onChange: (input: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void
    validate?: (value: string) => Promise<InvalidInputModel[]>
    onValidation?: (uniqueId: string, error: InvalidInputModel[]) => void
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
        type: "string",
        maxWidth: 1000,
        minWidth: 300,
        autoFocus: false
    }

    constructor(props: Props) {
        super(props);
        this.state = {
            errors: []
        }
        this.onValidateEvent = this.onValidateEvent.bind(this)
    }

    componentDidMount(): void {
        window.addEventListener(ValidateInputEvent.eventName, this.onValidateEvent);
    }

    componentWillUnmount(): void {
        window.removeEventListener(ValidateInputEvent.eventName, this.onValidateEvent);

        if (this.props.onValidation && this.state.errors.length > 0) {
            this.props.onValidation(this.props.uniqueId, []); // reset errors, if any was registeret preveously
        }
    }

    onValidateEvent(event: Event): void {
        const data = (event as CustomEvent).detail as ValidateInputEventData
            
        if (this.props.sectionName == data.sectionName) {
            this.validate(this.props.value ?? "");
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
                        label={<Typography sx={{textTransform : "capitalize"}} color={this.props.disabled ? "#999" : undefined}>{this.props.label}</Typography>}
                        variant={this.props.variant}
                        error={hasError}
                        rows={this.props.rows}
                        color={color}
                        onWheel={() => this.props.onWheel ? this.props.onWheel() : {}}
                        helperText={firstError?.message}
                        disabled={this.props.disabled}
                        onChange={(input) => this.props.onChange(input)}
                        //required={this.props.required}
                        size={this.props.size}
                        type={this.props.type}
                        value={this.props.value}
                        autoFocus={this.props.autoFocus}
                        
                        sx={{
                            minWidth: this.props.minWidth,
                            maxWidth: this.props.maxWidth,
                        }}
                        className={this.props.className}
                        multiline={this.props.multiline}
                    >

                    </TextField>
                </Box>

            </FormControl>
        )
    }
}
