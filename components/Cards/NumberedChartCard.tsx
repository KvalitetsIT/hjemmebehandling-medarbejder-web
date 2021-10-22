import { CardHeader, CircularProgress, Divider, Grid, Tooltip, Typography } from '@material-ui/core';
import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import { useParams } from 'react-router-dom';
import { IBackendApi } from '../../apis/IBackendApi';
import { PatientDetail } from '../Models/PatientDetail';
import { Contact } from '../Models/Contact';
import { Component } from 'react';
import StarIcon from '@mui/icons-material/Star';
import ContactPageIcon from '@mui/icons-material/ContactPage';
import { PatientCareplan } from '../Models/PatientCareplan';
import { PlanDefinition } from '../Models/PlanDefinition';
import { Line } from 'react-chartjs-2';
import type { Chart, ChartType, ChartData, ChartOptions, DefaultDataPoint, Plugin, InteractionItem } from 'chart.js';
import { Questionnaire } from '../Models/Questionnaire';
import { NumberAnswer } from '../Models/Answer';
import { Question } from '../Models/Question';
import { CategoryEnum } from '../Models/CategoryEnum';

export interface Props {
    questionnaire : Questionnaire;
}

export interface State {
    
}
class dataset{
    label : string = "";
    data: number[] = [];
    backgroundColor:string[] = []
    pointRadius : number = 10
}
class chartData {
    labels : string[] = [];
    datasets : dataset[] = []
}

export class NumberedChartCard extends Component<Props,State> {
  static displayName = NumberedChartCard.name;
  

getChipColorFromCategory(category : CategoryEnum){
    if(category == CategoryEnum.RED)
        return "red"
    if(category == CategoryEnum.YELLOW)
        return "yellow"
    if(category == CategoryEnum.BLUE)
        return "blue"

    return "green"

}

  render () {
    
    let data = new chartData();
    let questionToData = new Map<Question,dataset>();
    
    for(let responseIndex = 0; responseIndex < this.props.questionnaire.questionnaireResponses.length; responseIndex++){
        let response = this.props.questionnaire.questionnaireResponses[responseIndex];
        data.labels.push(response.answeredTime?.toLocaleDateString()!)

        response.questions.forEach( (a,q) => {
            
            let numberedAnswer = a as NumberAnswer;
            if(numberedAnswer){
                if(!questionToData.has(q)){
                    let set = new dataset();
                    set.label = q.question.slice(0,30);
                    questionToData.set(q,set)
                }
                    
                questionToData.get(q)?.data.push(numberedAnswer.answer)
            }
            
        })
        
    }

    questionToData.forEach( (d,q) => {
        
        
        for(let i = 0;i<d.data.length;i++){
            let answerValue = d.data[i];
            let threshold = q.thresholdPoint.find(x=>x.from <= answerValue && answerValue <= x.to)

            d.backgroundColor.push(this.getChipColorFromCategory(threshold?.category!));
        }
        data.datasets.push(d)
    } )

      
      
    let options = {
        plugins: {
            legend: {
              display: false
            }
          },
    scales: {
        x: {
            display: false //this will remove all the x-axis grid lines
        },
        y: {
        beginAtZero: true
        }
    }
    };

    return (
        <Card component={Box}>
            <CardContent>
            <Line data={data as never} options={options} />
            </CardContent>
        </Card>
    );
  }
}
//npm install --save react-chartjs-2 chart.js