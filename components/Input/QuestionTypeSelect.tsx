import * as React from 'react';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { Component } from 'react';
import ApiContext from '../../pages/_context';
import { FormControl, FormHelperText, InputLabel } from '@mui/material';
import { Question, QuestionTypeEnum } from '@kvalitetsit/hjemmebehandling/Models/Question';

import { InvalidInputModel } from '@kvalitetsit/hjemmebehandling/Errorhandling/ServiceErrors/InvalidInputError';
import { ValidateInputEvent, ValidateInputEventData } from '@kvalitetsit/hjemmebehandling/Events/ValidateInputEvent';

export interface Props {
    sectionName?: string;
    question: Question
    forceUpdate?: () => void
    validate?: (value: string) => Promise<InvalidInputModel[]>
    onValidation?: (uniqueId: number, error: InvalidInputModel[]) => void
}

export interface State {
    question: Question
    errors: InvalidInputModel[]
}



export class QuestionTypeSelect extends Component<Props, State> {
    static displayName = QuestionTypeSelect.name;
    static contextType = ApiContext

    allTypes: Array<{ type: QuestionTypeEnum, displayName: string }> = [
        { type: QuestionTypeEnum.BOOLEAN, displayName: "Ja / Nej" },
        { type: QuestionTypeEnum.OBSERVATION, displayName: "Måling" }
        //{ type: QuestionTypeEnum.CHOICE, displayName: "Multiplechoice" },
        //{ type: QuestionTypeEnum.INTEGER, displayName: "Heltal" },
        //{ type: QuestionTypeEnum.STRING, displayName: "Fritekst" }
    ]
    constructor(props: Props) {
        super(props);
        this.state = {
            question: props.question,
            errors: [],
        }
        this.handleChange = this.handleChange.bind(this)
     
        window.addEventListener(ValidateInputEvent.eventName, async (event: Event) => {
            const data = (event as CustomEvent).detail as ValidateInputEventData
            
            if (props.sectionName == data.sectionName) {
                await this.validate();
            }
        });
    }

    async validate(): Promise<void> {
        const question = this.state.question
        const errors: InvalidInputModel[] = []
        if (question.type == undefined) errors.push( new InvalidInputModel("QuestionType", "Typen på spørgsmålet mangler"))
        
        this.setState({errors: errors}) 
    }

    forceTypeSelectUpdate() : void{
        if (this.props.forceUpdate)
            this.props.forceUpdate()
        this.forceUpdate();
    }
    

    render(): JSX.Element {
        const hasError = this.state.errors.length > 0
        return (
            <FormControl sx={{ minWidth: 200 }} required>
                <InputLabel id="demo-simple-select-label">Vælg spørgsmålstype</InputLabel>
                <Select 
                defaultValue="" label="Vælg spørgsmålstype"    
                value={this.state.question.type} 
                onChange={this.handleChange}
                error={hasError}
                
                >
                    {this.allTypes.map(type => {
                        return (
                            <MenuItem key={type.type} value={type.type}>{type.displayName}</MenuItem>
                        )
                    })}
                </Select>
                {hasError ? <FormHelperText error={true}>{this.state.errors[0]?.message}</FormHelperText> : <></>}
            </FormControl>
        )
    }

    handleChange(e: SelectChangeEvent<string>): void {
        const clicked = e.target.value as unknown as QuestionTypeEnum
        const newQuestion = this.state.question
        newQuestion.type = clicked;
        this.forceTypeSelectUpdate();
        this.setState({ question: newQuestion })
        this.validate()
    }


}
