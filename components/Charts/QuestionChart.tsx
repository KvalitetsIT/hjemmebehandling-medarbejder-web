import * as React from 'react';
import { Component } from 'react';
import ApiContext from '../../pages/_context';
import { CategoryEnum } from '../Models/CategoryEnum';
import { QuestionnaireResponse } from '../Models/QuestionnaireResponse';
import { Question } from '../Models/Question';
import { Line } from 'react-chartjs-2';
import { NumberAnswer } from '../Models/Answer';
import ChartDataLabels from 'chartjs-plugin-datalabels';

export interface Props {
    question : Question
    questionnaireResponses : QuestionnaireResponse[]
}


export class QuestionChart extends Component<Props,{}> {
  static displayName = QuestionChart.name;
  static contextType = ApiContext


  constructor(props : Props){
    super(props);
    this.state = {
    }
    
}

getChipColorFromCategory(category : CategoryEnum) : string {
    const transparency = 0.4
    if(category === CategoryEnum.RED)
        return "rgba(215,11,4,"+transparency+")"
    if(category === CategoryEnum.YELLOW)
        return "rgba(225,237,65,"+transparency+")"
    if(category === CategoryEnum.BLUE)
        return "rgba(75,192,192,"+transparency+")"

    return "rgba(185,232,64,"+transparency+")"

}

getDisplayNameFromCategory(category : CategoryEnum) : string {
    if(category === CategoryEnum.RED)
        return "Rød"
    if(category === CategoryEnum.YELLOW)
        return "Gul"
    if(category === CategoryEnum.GREEN)
        return "Grøn"
    if(category === CategoryEnum.BLUE)
        return "Blå"

    return "Ukendt"
}

createThresholdDataset(question : Question, length : number) : Array<{label : string, data : number[],fill : boolean, backgroundColor : string, borderColor : string}> {

    const datasets: { label: string; data: number[]; fill: boolean; backgroundColor: string; borderColor: string; }[] = [];
    question.thresholdPoint.forEach(threshold => {
        const dataFrom = [];
        const dataTo = [];
        
        for(let i = 0; i<length;i++){
                dataFrom.push(threshold.from)
                dataTo.push(threshold.to)
        }

        const fromDataset = {
              label: this.getDisplayNameFromCategory(threshold.category) + " (min)",
              data: dataFrom,
              pointRadius: [0, 0, 0, 0, 0, 8, 0],
              fill: false,
              datalabels: {
                color: 'rgba(0,100,200,0)'
                },
              order : threshold.to,
              backgroundColor: this.getChipColorFromCategory(threshold.category),
              borderColor: this.getChipColorFromCategory(threshold.category)
            }
            datasets.push(fromDataset)
        const toDataset = {
            label: this.getDisplayNameFromCategory(threshold.category) + " (max)",
            data: dataTo,
            pointRadius: [0, 0, 0, 0, 0, 8, 0],
            fill: false,
            datalabels: {
                color: 'rgba(0,100,200,0)'
            },
            order : threshold.to,
            backgroundColor: this.getChipColorFromCategory(threshold.category),
            borderColor: this.getChipColorFromCategory(threshold.category)
            }
            datasets.push(toDataset)
    })
    
      return datasets
}

  render () : JSX.Element{

    const questionnaireResponses = this.props.questionnaireResponses;
    const question = this.props.question;
    
    const answersData : number[] = [] //Contains all numbers that should be shown in chart
    const answersLabels = [] // Contains the x-axes values (dates)
    
    //Go through all responses and push answers and dates to answerData, and answerLabels
    for(let responseIndex = 0 ; responseIndex < questionnaireResponses.length; responseIndex++){
        const response = questionnaireResponses[responseIndex];
        const answer = response.questions.get(question) as NumberAnswer
        answersData.push(answer.answer)
        answersLabels.push(response.answeredTime?.toLocaleDateString())
    }

    
    const dataSets = []; //Each entry represents one line in the chart


    dataSets.push({ // This is the question-line of the graph
        label: this.props.question.question,
        data: answersData,
        fill: false,
        datalabels: {
            align: "start",
            offset: 10,
            clip : true
          },
        pointRadius: 5,
        backgroundColor: "rgba(0,100,200,1)", // point color
        borderColor: "rgba(0,100,200,1)",
        order : -99999 //If order is lowest, the line will be in front of other lines
      })

    this.createThresholdDataset(question,questionnaireResponses.length).forEach(x=>dataSets.push(x))

    const data = {
        labels: answersLabels,
        datasets: dataSets,
      };

      //Remove all the legends for the thresholdvalues (since we are only interested in the question being a legend)
      const q = this.props.question.question
      const options = {
          plugins : {
              legend: {
                labels: {
                    filter: function( item : {text : string}){                   
                      return item.text === q 
                    }
                  }
                }
            }
        }

      

    return (
        <Line plugins={[ChartDataLabels as any]} options={options} data={data as any} />
    )
  }



}
