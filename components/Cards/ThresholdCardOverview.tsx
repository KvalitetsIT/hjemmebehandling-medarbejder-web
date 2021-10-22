import { Badge, CircularProgress, Divider, Grid, Tooltip, Typography } from '@material-ui/core';
import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import { useParams } from 'react-router-dom';
import { IBackendApi } from '../../apis/IBackendApi';
import { PatientDetail } from '../../components/Models/PatientDetail';
import { Contact } from '../Models/Contact';
import { Component } from 'react';
import StarIcon from '@mui/icons-material/Star';
import ContactPageIcon from '@mui/icons-material/ContactPage';
import { Questionnaire } from '../Models/Questionnaire';
import { Question } from '../Models/Question';
import ApiContext from '../../pages/_context';
import { Stack } from '@mui/material';

export interface Props {
    questionnaire : Questionnaire;
}

export interface State {
    
}

export class ThresholdCardOverview extends Component<Props,State> {
    static contextType = ApiContext
  static displayName = ThresholdCardOverview.name;

  render () {
    let allQuestions : Question[] = this.context.questionnaireService.findAllQuestions(this.props.questionnaire.questionnaireResponses)
    return (
        <Card component={Box} minWidth={100}>
            <CardContent>
                <Stack spacing={3}>
            {allQuestions.map(x=>{
                return (
                    <Badge badgeContent={"hej"} color="primary">
                        <Badge badgeContent={"hej"} color="primary">
                        {x.question}
                    </Badge>
                    </Badge>
                )
            })}
            </Stack>
            </CardContent>
        </Card>
    );
  }
}
