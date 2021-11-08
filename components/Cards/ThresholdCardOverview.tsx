import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Component } from 'react';
import { Questionnaire } from '../Models/Questionnaire';
import { Question } from '../Models/Question';
import ApiContext from '../../pages/_context';
import { Chip, Stack } from '@mui/material';
import { CategoryEnum } from '../Models/CategoryEnum';

export interface Props {
    questionnaire : Questionnaire;
}

export interface State {
    
}

export class ThresholdCardOverview extends Component<Props,State> {
    static contextType = ApiContext
  static displayName = ThresholdCardOverview.name;

  getChipColorFromCategory(category : CategoryEnum){
    if(category == CategoryEnum.RED)
        return "error"
    if(category == CategoryEnum.YELLOW)
        return "warning"
    //if(category == CategoryEnum.GREEN)
      //  return "success"
    if(category == CategoryEnum.BLUE)
        return "primary"

    return "default"
}

  render () {
    let allQuestions : Question[] = this.context.questionnaireService.findAllQuestions(this.props.questionnaire.questionnaireResponses)
    return (
        <Card component={Box} minWidth={100}>
            <CardContent>
                <Stack spacing={3}>
            {allQuestions.map(x=>{
                return (
                     <>
                     <Stack direction="row" spacing={2}>
                        {x.question}
                        {x.options.map(op =>{
                            return (
                                <Chip color={this.getChipColorFromCategory(op.category)} label={op.option} />
                            )
                        })}
                        {x.thresholdPoint.map(po => {
                            return (
                                <Chip color={this.getChipColorFromCategory(po.category)} label={po.from + " => "+po.to} />
                                )
                        })}
                        </Stack>
                        </>
                )
            })}
            </Stack>
            </CardContent>
        </Card>
    );
  }
}
