import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Component } from 'react';
import { PatientCareplan } from '../Models/PatientCareplan';
import { BasicTabs } from '../Layout/Tabs';
import { Questionnaire } from '../Models/Questionnaire';

export interface Props {
    careplan : PatientCareplan
}


export class CareplanQuestionnaireSummary extends Component<Props,{}> {
  static displayName = CareplanQuestionnaireSummary.name;


  render ()  : JSX.Element {
    const questionnaires = this.props.careplan.questionnaires;
    return (
        <Card>
        <CardContent>
        <BasicTabs 
            idOfStartTab={questionnaires[0].id}
            tabIds={questionnaires.map(x=>x.id)}
            tabLabels={questionnaires.map(x=>x.name)}
            tabContent={questionnaires.map(x=>this.renderQuestionnaireResponseTab(x))}
            >
          </BasicTabs>
        
        </CardContent>
        </Card>
    );
  }

  renderQuestionnaireResponseTab(questionnaire : Questionnaire) : JSX.Element{
    return (
      <>
       {questionnaire.id}
    </>
    )
  }
}
