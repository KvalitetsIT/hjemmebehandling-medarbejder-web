import * as React from 'react';
import { Component } from 'react';
import ApiContext from '../../pages/_context';
import { MenuItem, Select } from '@mui/material';
import { InvalidInputModel } from '@kvalitetsit/hjemmebehandling/Errorhandling/ServiceErrors/InvalidInputError';
import { TextFieldValidation } from './TextFieldValidation';
import { IValidationService } from '../../services/interfaces/IValidationService';

export interface Props {

    id?: string;
    sectionName? : string
    uniqueId: string;
    value?: string;
    label: string;
    variant: "outlined";
    size: "small" | "medium";

    onWheel?: () => void;
    onChange: (input: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void
    onValidation?: (uniqueId: string, error: InvalidInputModel[]) => void
}

export interface State {
    areaCode: string
}

export class PhonenumberInput extends Component<Props, State> {
    static displayName = PhonenumberInput.name;
    static contextType = ApiContext
    declare context: React.ContextType<typeof ApiContext>
    static defaultProps = {
        variant: "outlined",
        size: "small",
        required: false,
        disabled: false,
    }

    validationService!: IValidationService;
    areaCodes = [
        new AreaCode("Danmark", "+45")
    ]

    constructor(props: Props) {
        super(props);
        this.state = {
            areaCode: "+45"
        }
    }

    initializeServer(): void {
        this.validationService = this.context.validationService;
    }

    formatPhoneNumber(input: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>): React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement> {
        
        input.target.value = this.addAreaCodeToPhonenumber(input.target.value)
        return input;
    }

    addAreaCodeToPhonenumber(phone: string): string {
        if (phone == "")
            return phone
        return this.state.areaCode + phone;
    }

    executeOnSubmit(beforeValue: string): string {
        return this.state.areaCode + beforeValue;
    }

    render(): JSX.Element {
        this.initializeServer();

        return (
            <TextFieldValidation
                id={this.props.id}
                onValidation={(uid, errors) => this.props.onValidation ? this.props.onValidation(uid, errors) : {}}
                uniqueId={this.props.uniqueId}
                validate={(phone) => this.validationService.ValidatePhonenumber(this.addAreaCodeToPhonenumber(phone??""))}
                type="tel"
                sectionName={this.props.sectionName}
                label={this.props.label}
                value={this.props.value?.replaceAll("+45", "") ?? ""}
                onChange={input => this.props.onChange(this.formatPhoneNumber(input??""))}
                variant="outlined"
                >
                <Select

                    size={this.props.size}
                    value={this.state.areaCode}
                    label="Landekode"
                    variant='standard'
                    onChange={(a) => this.setState({ areaCode: a.target.value })}
                >
                    {this.areaCodes.map(areaCode => {
                        return (
                            <MenuItem value={areaCode.code}>{areaCode.code}</MenuItem>
                        )
                    })}
                </Select>
            </TextFieldValidation>
        )
    }
}

class AreaCode {
    country?: string;
    code?: string;

    constructor(country: string, code: string) {
        this.code = code;
        this.country = country;
    }
}
