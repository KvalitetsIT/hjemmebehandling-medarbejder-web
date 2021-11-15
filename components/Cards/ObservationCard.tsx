import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Component } from 'react';
import { PatientCareplan } from '../Models/PatientCareplan';
import { CardHeader, Grid, GridSize } from '@mui/material';
import { Questionnaire } from '../Models/Questionnaire';
import { QuestionnaireResponse } from '../Models/QuestionnaireResponse';
import ApiContext from '../../pages/_context';
import { LoadingComponent } from '../Layout/LoadingComponent';
import IDateHelper from '../../globalHelpers/interfaces/IDateHelper';
import IQuestionnaireService from '../../services/interfaces/IQuestionnaireService';
import { NumberAnswer } from '../Models/Answer';
import { Question } from '../Models/Question';
import { QuestionChart } from '../Charts/QuestionChart';
import { ThresholdSlider } from './ThresholdSlider';

export interface Props {
    careplan : PatientCareplan;
    questionnaire : Questionnaire;
}

export interface State {
    questionnaireResponses : QuestionnaireResponse[]
    loading : boolean
}

export class ObservationCard extends Component<Props,State> {
  static displayName = ObservationCard.name;
  static contextType = ApiContext
  questionnaireService! : IQuestionnaireService;
  dateHelper! : IDateHelper

  constructor(props : Props){
      super(props);
      this.state = {
          questionnaireResponses : [],
          loading : true
      }
  }
  initialiseServices() : void {
    this.questionnaireService = this.context.questionnaireService;
    this.dateHelper = this.context.dateHelper;
  }

  async componentDidMount() :  Promise<void> {
    const responses = await this.questionnaireService.GetQuestionnaireResponses(this.props.careplan.id,[this.props.questionnaire.id],1,5)
    console.log(responses)
    this.setState({questionnaireResponses : responses, loading : false})
  }

  findObservationQuestions(questionnaireResponse : QuestionnaireResponse) : Question[] {
    
    const questions : Question[] = [];
    questionnaireResponse.questions.forEach( (answer,question) =>{
        const numberAnswer : NumberAnswer = answer as NumberAnswer;
        if(numberAnswer){
            questions.push(question)
        }
    })
    return questions;
  }

  getColumnSize(elementsInArray : number) : GridSize{

    if(elementsInArray == 1)
        return 12;
    if(elementsInArray == 2)
        return 6;

    return 4
  }

  render () : JSX.Element {
    this.initialiseServices()

    if(this.state.loading)
        return (<LoadingComponent/>)

    if(this.state.questionnaireResponses.length == 0){
        return (<></>)
    }

    const allQuestions : Question[] = [];
    const questionIterator = this.state.questionnaireResponses[0].questions.keys()
    let question = questionIterator.next()
    
    while(!question.done){
        allQuestions.push(question.value)
        question = questionIterator.next()
    }
        

    return (
        <Grid container>
        {allQuestions.map(question => {
                return (
                <Grid item xs={this.getColumnSize(allQuestions.length)}>
                    <Card>
                        <CardHeader subheader={question.question}/>
                        <CardContent>
                                <QuestionChart question={question} questionnaireResponses={this.state.questionnaireResponses} /> 
                        </CardContent>
                    </Card>
                    <Card  marginTop={3} component={Box}>
                        <CardHeader subheader={question.question + " - Alarmgrænser"}/>
                        <CardContent>
                            <ThresholdSlider question={question}/>
                        </CardContent>
                    </Card>
                </Grid>
             )
            })}
        </Grid>
    );
  }
}