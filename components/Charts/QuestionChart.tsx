import * as React from 'react';
import { Component } from 'react';
import ApiContext from '../../pages/_context';
import { CategoryEnum } from '../Models/CategoryEnum';
import { QuestionnaireResponse } from '../Models/QuestionnaireResponse';
import { Question } from '../Models/Question';
import { Line } from 'react-chartjs-2';
import { NumberAnswer } from '../Models/Answer';

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
        return "rgba(255,0,0,"+transparency+")"
    if(category === CategoryEnum.YELLOW)
        return "rgba(255,255,0,"+transparency+")"
    if(category === CategoryEnum.BLUE)
        return "rgba(75,192,192,"+transparency+")"

    return "rgba(0,255,0,"+transparency+")"

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
              label: this.getDisplayNameFromCategory(threshold.category) + " (from)",
              data: dataFrom,
              fill: false,
              order : threshold.to,
              backgroundColor: this.getChipColorFromCategory(threshold.category),
              borderColor: this.getChipColorFromCategory(threshold.category)
            }
            datasets.push(fromDataset)
        const toDataset = {
            label: this.getDisplayNameFromCategory(threshold.category) + " (to)",
            data: dataTo,
            fill: false,
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
    
    const answersData = []
    const answersLabels= []
    
    for(let responseIndex = 0 ; responseIndex < questionnaireResponses.length; responseIndex++){
        const response = questionnaireResponses[responseIndex];
        const answer = response.questions.get(question) as NumberAnswer
        answersData.push(answer.answer)
        answersLabels.push(response.answeredTime?.toLocaleDateString())
    }


    const dataSets = [];

    dataSets.push({
        label: this.props.question.question,
        data: answersData,
        fill: false,
        backgroundColor: "rgba(0,100,200,1)",
        borderColor: "rgba(0,100,200,1)",
        order : -99999
      })

    this.createThresholdDataset(question,questionnaireResponses.length).forEach(x=>dataSets.push(x))

    const data = {
        labels: answersLabels,
        datasets: dataSets,
        options : {
            scales: {
                y: {
                    stacked: true
                }
            }
        }
      };

      

    return (
        <Line data={data} />
    )
  }



}
