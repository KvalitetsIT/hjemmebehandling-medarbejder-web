import React, { Component } from 'react';
import { Grid, Skeleton, Typography } from '@mui/material';
import ApiContext, { IApiContext } from '../../../pages/_context';
import { IPersonService } from '../../../services/interfaces/IPersonService';
import { IValidationService } from '../../../services/interfaces/IValidationService';
import { FormikErrors, FormikTouched } from 'formik';
import { ValidatedInput } from '../../Input/ValidatedInput';
import { ErrorMessage } from '../../Errors/MessageWithWarning';
import { InvalidInputModel } from '../../Errorhandling/ServiceErrors/InvalidInputError';
import { ICollectionHelper } from '../../Helpers/interfaces/ICollectionHelper';
import { PlanDefinition } from '../../Models/PlanDefinition';


export interface Props {
    planDefinition: PlanDefinition
    errors: FormikErrors<{ name: string | undefined }>
    touched: FormikTouched<PlanDefinition>
}

export interface State {
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
            loading: false
        }
    }

    render(): JSX.Element {
        const contents = this.state.loading ? <Skeleton variant="rectangular" height={200} /> : this.renderCard();
        return contents;
    }

    componentDidMount(): void {
        this.setState({ loading: false })
    }

    InitializeServices(): void {
const api = this.context as IApiContext
        this.personService =  api.personService;
        this.validationService =  api.validationService;
        this.collectionHelper =  api.collectionHelper
    }



    errorArray: Map<number, InvalidInputModel[]> = new Map<number, InvalidInputModel[]>();

    renderCard(): JSX.Element {
        this.InitializeServices();
        return (
            <Grid container spacing={2}>
                <Grid item xs={12}>

                    <ValidatedInput
                        label={'Navn'}
                        name={'name'}
                        error={(this.props.errors?.name && this.props.touched.name) ? <ErrorMessage message={this.props.errors?.name} /> : undefined}
                        size="medium"
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


