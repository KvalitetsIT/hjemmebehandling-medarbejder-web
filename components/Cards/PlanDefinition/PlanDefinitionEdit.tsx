import React, { Component } from 'react';
import { Grid, Skeleton, Typography } from '@mui/material';
import ApiContext from '../../../pages/_context';
import { IPersonService } from '../../../services/interfaces/IPersonService';
import { TextFieldValidation } from '../../Input/TextFieldValidation';
import { InvalidInputModel } from '@kvalitetsit/hjemmebehandling/Errorhandling/ServiceErrors/InvalidInputError';
import { IValidationService } from '../../../services/interfaces/IValidationService';
import { ICollectionHelper } from '@kvalitetsit/hjemmebehandling/Helpers/interfaces/ICollectionHelper';
import { PlanDefinition } from '@kvalitetsit/hjemmebehandling/Models/PlanDefinition';
import { BaseModelStatus } from '@kvalitetsit/hjemmebehandling/Models/BaseModelStatus';

export interface Props {
    planDefinition: PlanDefinition
}

export interface State {
    planDefinition: PlanDefinition
    loading: boolean
}

export class PlanDefinitionEdit extends Component<Props, State> {
    static contextType = ApiContext;
    static displayName = PlanDefinitionEdit.name;
    personService!: IPersonService;
    validationService!: IValidationService;
    collectionHelper!: ICollectionHelper;

    constructor(props: Props) {
        super(props);
        this.state = {
            loading: false,
            planDefinition: props.planDefinition
        }

        this.modifyPlandefinition = this.modifyPlandefinition.bind(this);
    }

    render(): JSX.Element {
        const contents = this.state.loading ? <Skeleton variant="rectangular" height={200} /> : this.renderCard();
        return contents;
    }

    componentDidMount(): void {
        this.setState({ loading: false })
    }

    InitializeServices(): void {
        this.personService = this.context.personService;
        this.validationService = this.context.validationService;
        this.collectionHelper = this.context.collectionHelper
    }

    modifyPlandefinition(plandefinitionModifier: (planDefinition: PlanDefinition, newValue: string) => PlanDefinition, input: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>): void {
        const valueFromInput = input.currentTarget.value;
        const modifiedPlanDefinition = plandefinitionModifier(this.state.planDefinition, valueFromInput);
        this.setState({ planDefinition: modifiedPlanDefinition })
    }

    errorArray: Map<number, InvalidInputModel[]> = new Map<number, InvalidInputModel[]>();

    renderCard(): JSX.Element {
        this.InitializeServices();
        let inputId = 0;
        return (

            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <TextFieldValidation
                        uniqueId={inputId++}
                        label="Navn"
                        value={this.state.planDefinition.name}
                        onChange={input => this.modifyPlandefinition(this.setPlanDefinitionName, input)}
                        variant="outlined" 
                        disabled={this.state.planDefinition.status == BaseModelStatus.ACTIVE}
                        />
                        
                </Grid>
                <Grid item xs={12}>
                    <Typography>Patientgruppen oprettes i den afdeling du er tilknyttet, derfor tilknyttes denne patientgruppe Infektionssygdomme</Typography>
                </Grid>
            </Grid>
        )
    }

    setPlanDefinitionName(planDefinition: PlanDefinition, newValue: string): PlanDefinition {
        const modifiedPlanDefinition = planDefinition;
        modifiedPlanDefinition.name = newValue;
        return modifiedPlanDefinition;
    }



}
