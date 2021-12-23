import * as React from 'react';
import { Component } from 'react';
import ApiContext from '../../pages/_context';
import { Slider } from '@material-ui/core';
import { CategoryEnum } from '@kvalitetsit/hjemmebehandling/Models/CategoryEnum';

export interface Props {
    category : CategoryEnum
    values : number[]
    onChange : (values : number[]) => void
}

export interface State {
    values : number[]
}


export class ColorSlider extends Component<Props,State> {
  static displayName = ColorSlider.name;
  static contextType = ApiContext

  getChipColorFromCategory(category : CategoryEnum) : string{
    if(category === CategoryEnum.RED)
        return "red"
    if(category === CategoryEnum.YELLOW)
        return "yellow"
    if(category === CategoryEnum.GREEN)
        return "success"
    if(category === CategoryEnum.BLUE)
        return "blue"

    return ""

}

  constructor(props : Props){
      super(props);
      this.handleChange = this.handleChange.bind(this);
      this.state = {
          values : props.values
      }
      
  }

  handleChange (event: React.ChangeEvent<{}>, newValue: number | number[]) : void{
    this.setState({values : newValue as number[]})
    this.props.onChange(newValue as number[])
  }

  render () :JSX.Element{
    return (
            <Slider
            onChange={this.handleChange}
            getAriaLabel={() => 'Temperature range'}
            value={this.state.values}
            min={0}
            max={200}
            valueLabelDisplay="on"/>
    )
  }



}
