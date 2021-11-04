import { CardHeader, CircularProgress, Divider, Grid, Tooltip, Typography } from '@material-ui/core';
import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import { Link, useParams } from 'react-router-dom';
import { IBackendApi } from '../../apis/IBackendApi';
import { PatientDetail } from '../../components/Models/PatientDetail';
import { Contact } from '../Models/Contact';
import { Component } from 'react';
import StarIcon from '@mui/icons-material/Star';
import ContactPageIcon from '@mui/icons-material/ContactPage';
import { PatientCareplan } from '../Models/PatientCareplan';
import { Questionnaire } from '../Models/Questionnaire';
import { Stack } from '@mui/material';
import { NumberedChartCard } from './NumberedChartCard';
import { AddQuestionnaireButton } from '../Input/AddQuestionnaireButton';

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
                {questionnairesFromPlandefinitions.length == 0 && extraQuestionnaries.length == 0? "Ingen spørgeskemaer for monitoreringsplanen endnu" : ""}
                {questionnairesFromPlandefinitions.map(questionnaire => {
                    return (
                        <Stack direction="row" spacing={2}>
                            <Typography variant="inherit">{questionnaire.name}</Typography>
                            <Typography variant="caption">{questionnaire.frequency.ToString()}</Typography>
                        </Stack>
                    )
                })}
                {extraQuestionnaries.map(questionnaire => {
                    return (
                        <Stack direction="row" spacing={2}>
                            <Typography variant="caption">+</Typography>
                            <Typography variant="inherit">{questionnaire.name}</Typography>
                            <Typography variant="caption">{questionnaire.frequency.ToString()}</Typography>
                        </Stack>
                    )
                })}
                
            </CardContent>
        </Card>
    );
  }
}
