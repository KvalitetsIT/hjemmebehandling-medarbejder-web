import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Component } from 'react';
import { Line } from 'react-chartjs-2';
import { Questionnaire } from '../Models/Questionnaire';
import { NumberAnswer } from '../Models/Answer';
import { CategoryEnum } from '../Models/CategoryEnum';
import { ThresholdNumber } from "../Models/ThresholdNumber";

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
    borderWidth: number = 8
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
    let questionToData = new Map<string, [dataset, ThresholdNumber[]]>();
    //let questionToThreshold = new Map<string, ThresholdNumber[]>();
    
    for(let responseIndex = 0; responseIndex < this.props.questionnaire.questionnaireResponses.length; responseIndex++){
        let response = this.props.questionnaire.questionnaireResponses[responseIndex];
        data.labels.push(response.answeredTime?.toLocaleDateString()!)

        response.questions.forEach( (a,q) => {
            
            let numberedAnswer = a as NumberAnswer;
            if(typeof numberedAnswer.answer === 'number') {
                if(!questionToData.has(q.question!)){
                    let set = new dataset();
                    set.label = q.question.slice(0,30);
                    questionToData.set(q.question!, [set, q.thresholdPoint!])
                }

                let ds: dataset = questionToData.get(q.question!)![0]
                ds.data.push(numberedAnswer.answer)
            }
            
        })
        
    }

    questionToData.forEach( (d, q) => {
        let ds: dataset = d[0]
        let thresholds: ThresholdNumber[] = d[1]
        
        
        for(let i = 0; i < ds.data.length; i++){
            let answerValue = ds.data[i];
            let threshold = thresholds.find(x=>x.from <= answerValue && answerValue <= x.to)

            ds.backgroundColor.push(this.getChipColorFromCategory(threshold?.category!));
        }
        data.datasets.push(ds)
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