import * as React from 'react';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { Component } from 'react';
import ApiContext from '../../pages/_context';
import { FormControl, FormHelperText, InputLabel } from '@mui/material';
import { Question, QuestionTypeEnum } from '@kvalitetsit/hjemmebehandling/Models/Question';

import { CriticalLevelEnum, InvalidInputModel } from '@kvalitetsit/hjemmebehandling/Errorhandling/ServiceErrors/InvalidInputError';
import { ValidateInputEvent, ValidateInputEventData } from '@kvalitetsit/hjemmebehandling/Events/ValidateInputEvent';
import { ErrorMessage } from '../Errors/MessageWithWarning';

export interface Props {
    sectionName?: string;
    question: Question;
    validate?: (value: string) => Promise<InvalidInputModel[]>;
    onValidation?: (uniqueId: string, error: InvalidInputModel[]) => void;
    disabled: boolean;
    uniqueId: string;
    onChange: (input: SelectChangeEvent<string>) => void;
}

export interface State {
    errors: InvalidInputModel[]
}



export class QuestionTypeSelect extends Component<Props, State> {
    static displayName = QuestionTypeSelect.name;
    static contextType = ApiContext

    allTypes: Array<{ type: QuestionTypeEnum, displayName: string }> = [
        { type: QuestionTypeEnum.BOOLEAN, displayName: "Ja / Nej" },
        { type: QuestionTypeEnum.OBSERVATION, displayName: "Måling" },
        { type: QuestionTypeEnum.GROUP, displayName: "Målingsgruppe" },
        { type: QuestionTypeEnum.CHOICE, displayName: "Multiple-choice" },
        //{ type: QuestionTypeEnum.INTEGER, displayName: "Heltal" },
        //{ type: QuestionTypeEnum.STRING, displayName: "Fritekst" }
    ]
    constructor(props: Props) {
        super(props);
        this.state = {
            errors: [],
        }

        this.onValidateEvent = this.onValidateEvent.bind(this)
    }

    componentDidMount(): void {
        window.addEventListener(ValidateInputEvent.eventName, this.onValidateEvent);
    }

    componentWillUnmount(): void {
        window.removeEventListener(ValidateInputEvent.eventName, this.onValidateEvent);

        if (this.props.onValidation && this.state.errors.length > 0) {
            this.props.onValidation(this.props.uniqueId, []);
        }
    }

    onValidateEvent(event: Event): void {
        const data = (event as CustomEvent).detail as ValidateInputEventData

        if (this.props.sectionName === data.sectionName) {
            this.validate();
        }
    }

    validate(): void {
        const question = this.props.question
        const errors: InvalidInputModel[] = []
        if (question.type === undefined) {
            errors.push(new InvalidInputModel("QuestionType", "Typen på spørgsmålet mangler", CriticalLevelEnum.ERROR))
        }
        if (this.props.onValidation) {
            this.props.onValidation(this.props.uniqueId, errors.filter(x => x.criticalLevel === CriticalLevelEnum.ERROR));
        }

        this.setState({ errors: errors })
    }

    render(): JSX.Element {
        const hasError = this.state.errors.length > 0
        return (
            <FormControl sx={{ minWidth: 200 }} required>
                <InputLabel id="demo-simple-select-label">Vælg spørgsmålstype</InputLabel>
                <Select
                    //defaultValue={undefined} 
                    label="Vælg spørgsmålstype"
                    value={this.props.question.type}
                    onChange={(input) => {
                        this.props.onChange(input);
                        this.validate()
                    }
                    }
                    error={hasError}
                    disabled={this.props.disabled}
                >
                    {this.allTypes.map(type => {
                        return (
                            <MenuItem key={type.type} value={type.type}>{type.displayName}</MenuItem>
                        )
                    })}
                </Select>
                {hasError ? <FormHelperText error={true}><ErrorMessage message={this.state.errors[0]?.message} /></FormHelperText> : <></>}
            </FormControl>
        )
    }
}



export interface ValidatedQuestionTypeSelect extends ValidatedSelectionProps<QuestionTypeEnum> {

}






interface ValidatedSelectionProps<T> {
    value: T,
    options: T[]
    renderOption: (option: T) => { key: string, value: string, label: string }
    label: React.ReactNode
    disabled?: boolean
    onChange: (value: T) => void
    error?: string
}

const ValidatedSelection = (props: ValidatedSelectionProps<any>) => {
    const { label, options, error, disabled, renderOption } = props
    return (
        <FormControl sx={{ minWidth: 200 }} required>
            <InputLabel id="demo-simple-select-label">{label}</InputLabel>
            <Select
                {...props}
                disabled={disabled}
                error={error !== undefined}
            >
                {options.map(option => { let { key, value, label } = renderOption(option); return (<MenuItem key={key} value={value}>{label}</MenuItem>) })}
            </Select>
            {error ? <FormHelperText error={true}><ErrorMessage message={error} /></FormHelperText> : <></>}
        </FormControl>
    )

}
