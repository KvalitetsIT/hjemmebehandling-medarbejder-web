import { CardHeader, Table } from '@material-ui/core';
import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Component } from 'react';
import { PatientCareplan } from '@kvalitetsit/hjemmebehandling/Models/PatientCareplan';
import { Questionnaire } from '@kvalitetsit/hjemmebehandling/Models/Questionnaire';
import { FrequencyTableRow } from '../Input/FrequencyTableRow';
import { ErrorBoundary } from '@kvalitetsit/hjemmebehandling/Errorhandling/ErrorBoundary'
import ApiContext from '../../pages/_context';
import { LoadingSmallComponent } from '../Layout/LoadingSmallComponent';
import { IQuestionnaireService } from '../../services/interfaces/IQuestionnaireService';
import { Alert, Typography } from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

export interface Props {
    careplan: PatientCareplan
    specialSave?: (editedCareplan: PatientCareplan) => void
}
export interface State {
    patientIsOnUnansweredList: boolean;
    loading: boolean;
}


export class QuestionnaireListSimple extends Component<Props, State> {
    static displayName = QuestionnaireListSimple.name;
    static contextType = ApiContext
    questionnaireService!: IQuestionnaireService;

    constructor(props: Props) {
        super(props);

        this.state = {
            patientIsOnUnansweredList: false,
            loading: true
        }
    }

    async componentDidMount() : Promise<void>{
        try {
            let isPatientOnUnanswered = false;
            if (this.props.careplan.patient?.cpr)
                isPatientOnUnanswered = await this.questionnaireService.IsPatientOnUnanswered(this.props.careplan.patient.cpr)

            this.setState({ patientIsOnUnansweredList: isPatientOnUnanswered, loading: false });
        } catch (error) {
            this.setState(() => { throw error });
        }
    }
    initializeServices() : void{
        this.questionnaireService = this.context.questionnaireService;
    }

    render(): JSX.Element {
        this.initializeServices();
        return this.state.loading ? <LoadingSmallComponent /> : this.renderContent();
    }

    renderContent(): JSX.Element {
        const questionnaries: Questionnaire[] = this.props.careplan.questionnaires;

        if (!this.props.careplan.patient)
            return <>Ingen patient på careplan</>

        return (
            <Card>

                <CardHeader subheader={
                    <>
                        Spørgeskemaer
                        <ErrorBoundary rerenderChildren={false}>
                        </ErrorBoundary>
                    </>
                } />

                <CardContent>
                    <Table>
                        {questionnaries.length === 0 ? "Ingen spørgeskemaer for monitoreringsplanen endnu" : ""}
                        {questionnaries.map(questionnaire => {
                            return (
                                <FrequencyTableRow patient={this.props.careplan.patient!} firstCell={<div>{questionnaire.name}</div>} questionnaire={questionnaire}></FrequencyTableRow>
                            )
                        })}

                    </Table>
                    {this.state.patientIsOnUnansweredList ?
                        <Alert sx={{ margin: 2 }} color='warning' icon={<WarningAmberIcon />}>
                            <Typography variant='h6'>Denne patient mangler at besvare et eller flere spørgeskemaer</Typography>
                            <Typography>Ved ændring af frekvensen, vil patientens manglende besvarelse blive glemt</Typography>
                        </Alert>
                        : <></>
                    }

                </CardContent>
            </Card>
        );
    }
}
