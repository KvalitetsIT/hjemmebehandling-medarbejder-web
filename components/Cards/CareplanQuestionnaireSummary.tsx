import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Component } from 'react';
import { PatientCareplan } from '../Models/PatientCareplan';
import { BasicTabs } from '../Layout/Tabs';
import { Questionnaire } from '../Models/Questionnaire';
import { Button, Stack, Typography } from '@mui/material';
import { QuestionnaireResponse } from '../Models/QuestionnaireResponse';
import { Link } from 'react-router-dom';
import IDateHelper from '../../globalHelpers/interfaces/IDateHelper';
import ApiContext from '../../pages/_context';

export interface Props {
    careplan : PatientCareplan
}


export class CareplanQuestionnaireSummary extends Component<Props,{}> {
  static displayName = CareplanQuestionnaireSummary.name;
  static contextType = ApiContext;
  dateHelper! : IDateHelper
  InitialiseServices(){
      this.dateHelper = this.context.dateHelper;
  }

  render ()  : JSX.Element {
      this.InitialiseServices()
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
      let latestResponse : QuestionnaireResponse | null = null;
      const responsesFromNewToOld = questionnaire.questionnaireResponses?.sort( (a,b) => a.answeredTime!.getTime() - b.answeredTime!.getTime());
        if(responsesFromNewToOld?.length > 0)
            latestResponse = responsesFromNewToOld[0]
    return (
      <>
       <Stack spacing={20} direction="row">
           <Stack>
           <Typography variant="caption">
                Seneste besvarelse
            </Typography>
            <Typography>
                {latestResponse && latestResponse.answeredTime ? this.dateHelper.DateToString(latestResponse.answeredTime) : "-"}
            </Typography>
           </Stack>

           <Stack>
           <Typography variant="caption">
                Frekvens
            </Typography>
            <Typography>
            {questionnaire.frequency.ToString()}
            </Typography>
           </Stack>

           <Stack>
           <Button component={Link} to={"/patients/"+this.props.careplan.patient.cpr+"/questionnaires/"+questionnaire.id} variant="contained">Se besvarelser</Button>        
           </Stack>
       </Stack>
    </>
    )
  }
}