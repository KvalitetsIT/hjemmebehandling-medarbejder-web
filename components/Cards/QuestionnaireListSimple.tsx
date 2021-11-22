import { CardHeader, Table } from '@material-ui/core';
import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Component } from 'react';
import { PatientCareplan } from '../Models/PatientCareplan';
import { Questionnaire } from '../Models/Questionnaire';
import { AddQuestionnaireButton } from '../Input/AddQuestionnaireButton';
import { FrequencyTableRow } from '../Input/FrequencyTableRow';
import { ErrorBoundary } from '../Layout/ErrorBoundary';

export interface Props {
    careplan : PatientCareplan
    specialSave? : (editedCareplan : PatientCareplan) => void
}


export class QuestionnaireListSimple extends Component<Props,{}> {
  static displayName = QuestionnaireListSimple.name;

  render () : JSX.Element {
    const questionnaries : Questionnaire[] = this.props.careplan.questionnaires;

    return (
        <Card>
         
                <CardHeader subheader={
                    <>
                    Spørgeskemaer
                    <ErrorBoundary rerenderChildren={true}>
                    <AddQuestionnaireButton afterAddingQuestionnaire={()=>this.forceUpdate()} careplan={this.props.careplan} />
                    </ErrorBoundary>
                    </>
                }/>
            
            <CardContent>
                <Table>
                {questionnaries.length === 0 ? "Ingen spørgeskemaer for monitoreringsplanen endnu" : ""}
                {questionnaries.map(questionnaire => {
                    return (
                        <FrequencyTableRow firstCell={<div>{questionnaire.name}</div>} questionnaire={questionnaire}></FrequencyTableRow>
                    )
                })}
                </Table>

            </CardContent>
        </Card>
    );
  }
}
