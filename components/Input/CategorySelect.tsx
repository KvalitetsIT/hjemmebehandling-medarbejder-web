import * as React from 'react';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { Component } from 'react';
import { Typography } from '@mui/material';
import ApiContext from '../../pages/_context';
import { CategoryEnum } from '@kvalitetsit/hjemmebehandling/Models/CategoryEnum';

export interface Props {
    category : CategoryEnum
    onChange : (value : CategoryEnum) => void
}

export interface State {
    category : CategoryEnum
}


export class CategorySelect extends Component<Props,State> {
  static displayName = CategorySelect.name;
  static contextType = ApiContext


  constructor(props : Props){
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
        category : props.category
    }
    
}

getAllCategories() : CategoryEnum[]{
    return [CategoryEnum.GREEN,CategoryEnum.YELLOW,CategoryEnum.RED]
}
getDanishColornameFromCategory(category : CategoryEnum) : string{
    if(category === CategoryEnum.RED)
        return "Rød"
    if(category === CategoryEnum.YELLOW)
        return "Gul"
    if(category === CategoryEnum.GREEN)
        return "Grøn"

    return "Ukendt"
}

 

  handleChange (event: SelectChangeEvent) : void {
    const newValue = this.getAllCategories().find(x=>x.toString() === event.target.value.toString())
    this.setState({category : newValue as CategoryEnum})
    this.props.onChange(newValue as CategoryEnum)
  }

  render () : JSX.Element{
    return (
        <Select
        labelId="demo-multiple-name-label"
        id="demo-multiple-name"
        value={this.state.category.toString()}
        onChange={this.handleChange}
        >
        {this.getAllCategories().map((category) => (
            <MenuItem
            key={category}
            value={category}
            
            >
            <Typography>{this.getDanishColornameFromCategory(category)}</Typography>
            </MenuItem>
        ))}
        </Select> 
    )
  }



}
