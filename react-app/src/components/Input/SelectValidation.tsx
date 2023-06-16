export {}
/*
import * as React from 'react';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { Component } from 'react';
import ApiContext from '../../pages/_context';
import { FormControl, FormHelperText, InputLabel } from '@mui/material';
import { QuestionTypeEnum } from '@kvalitetsit/hjemmebehandling/Models/Question';
import { InvalidInputModel, CriticalLevelEnum } from '@kvalitetsit/hjemmebehandling/Errorhandling/ServiceErrors/InvalidInputError';
import { ValidateInputEvent, ValidateInputEventData } from '@kvalitetsit/hjemmebehandling/Events/ValidateInputEvent';

export interface Props {
    sectionName?: string;
    uniqueId: number
    onValidation?: (uniqueId: number, error: InvalidInputModel[]) => void
    validate: (value: string) => Promise<InvalidInputModel[]>
    options: string[]
    label: string
}

export interface State {
    value: string
    errors: InvalidInputModel[];
}

export class SelectValidation extends Component<Props, State> {
    static contextType = ApiContext

    supportedTypes: Array<QuestionTypeEnum> = [
        QuestionTypeEnum.BOOLEAN
    ]
    constructor(props: Props) {
        super(props);
        this.state = {
            value: "",
            errors: [],
        }

        this.handleChange = this.handleChange.bind(this)
        this.validate = this.validate.bind(this)

        window.addEventListener(ValidateInputEvent.eventName, async (event: Event) => {
            const data = (event as CustomEvent).detail as ValidateInputEventData
            if (props.sectionName === data.sectionName) {
                await this.validate(this.state.value);
            }
        });
    }
    async validate( value: string): Promise<void> {
        if (!this.props.validate)
            return;
        const errors = await this.props.validate(value);
        console.log(errors)
        this.setState({errors: errors})
        if (this.props.onValidation) {
            this.props.onValidation(this.props.uniqueId, errors.filter(x => x.criticalLevel === CriticalLevelEnum.ERROR));
        }
    }


    render(): JSX.Element {
        let firstError: InvalidInputModel | undefined = undefined
        let hasError = false


        let color: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' = "primary"
        if (this.state.errors && this.state.errors.length !== 0) {
            firstError = this.state.errors[0];

            if (firstError.criticalLevel === CriticalLevelEnum.ERROR) {
                hasError = true;
            }
            if (firstError.criticalLevel === CriticalLevelEnum.WARNING) {
                color = "warning"
            }
        }
        
        return (
            <FormControl sx={{ minWidth: 200 }} key={"enableWhen"} required>
                <InputLabel id="demo-simple-select-label">{this.props.label}</InputLabel>
                <Select 
                    defaultValue=""  
                    value={this.state.value} 
                    onChange={this.handleChange}
                    error={hasError}
                    {...this.props}
                 
                >
                    {this.props.options?.map((option, index) => {
                        return (
                            <MenuItem key={"option-" +index} value={option}>
                                {option.charAt(0).toUpperCase() + option.substr(1).toLowerCase()}
                            </MenuItem>
                        )
                    })}
                
                </Select>
                {hasError ? <FormHelperText error={true}>{firstError?.message}</FormHelperText> : <></>}
            </FormControl>
        )
    }

    handleChange(e: SelectChangeEvent<string>): void {
        const selected = e.target.value as unknown as string
        
        this.setState({ value: selected})
    }

}
*/