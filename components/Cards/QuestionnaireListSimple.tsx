import { CardHeader, Table } from '@material-ui/core';
import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Component } from 'react';
import { PatientCareplan } from '../Models/PatientCareplan';
import { Questionnaire } from '../Models/Questionnaire';
import { AddQuestionnaireButton } from '../Input/AddQuestionnaireButton';
import { FrequencyTableRow } from '../Input/FrequencyTableRow';

export interface Props {
    careplan : PatientCareplan
    specialSave? : (editedCareplan : PatientCareplan) => void
}

export interface State {
    
}

export class QuestionnaireListSimple extends Component<Props,State> {
  static displayName = QuestionnaireListSimple.name;

  render () {
     let questionnairesFromPlandefinitions : Questionnaire[] = this.props.careplan.planDefinitions.flatMap(x=>x.questionnaires);
     let extraQuestionnaries : Questionnaire[] = this.props.careplan.questionnaires;

    return (
        <Card>
         
                <CardHeader subheader={
                    <>
                    Spørgeskemaer
                    <AddQuestionnaireButton afterAddingQuestionnaire={()=>this.forceUpdate()} careplan={this.props.careplan} />
                    </>
                }/>
            
            <CardContent>
                <Table>

                
                {questionnairesFromPlandefinitions.length == 0 && extraQuestionnaries.length == 0? "Ingen spørgeskemaer for monitoreringsplanen endnu" : ""}
                {questionnairesFromPlandefinitions.map(questionnaire => {
                    return (
                            <FrequencyTableRow firstCell={<div>{questionnaire.name}</div>} questionnaire={questionnaire}></FrequencyTableRow>
                    )
                })}
                {extraQuestionnaries.map(questionnaire => {
                    return (
                        <FrequencyTableRow firstCell={<div>+ {questionnaire.name}</div>} questionnaire={questionnaire}></FrequencyTableRow>
                    )
                })}
                </Table>

            </CardContent>
        </Card>
    );
  }
}
