import * as React from 'react';
import Box from '@mui/material/Box';
import { Component } from 'react';
import { Chip, Stack, Typography } from '@mui/material';
import ApiContext from '../../pages/_context';
import { Question } from '@kvalitetsit/hjemmebehandling/Models/Question';
import { CategoryEnum } from '@kvalitetsit/hjemmebehandling/Models/CategoryEnum';
import { ThresholdNumber } from '@kvalitetsit/hjemmebehandling/Models/ThresholdNumber';

export interface Props {
    question : Question
    threshold : ThresholdNumber[]
}


export class ThresholdSlider extends Component<Props,{}> {
  static displayName = ThresholdSlider.name;
  static contextType = ApiContext

  constructor(props : Props){
      super(props);
      this.state = {
          questionnaireResponses : [],
          loading : true
      }
  }

  getColorFromCategory(category :CategoryEnum) : "success" | "warning" | "error" | "info" {
    if(category === CategoryEnum.GREEN)
        return "success"
    if(category === CategoryEnum.YELLOW)
        return "warning"
    if(category === CategoryEnum.RED)
        return "error"

    return "info"
  }


  render () : JSX.Element {
    let oldTo : number | undefined = undefined;
    
    return (
        <Stack direction="row">
            {this.props.threshold.sort().map(x=>{
                const shouldShowNewFrom = oldTo !== x.from;

                oldTo = x.to;

                return (
                    <>
                    {shouldShowNewFrom ? <Typography variant="caption" padding={1}>{x.from}</Typography> : <></>  }
                    
                    <Chip width={100/this.props.threshold.length+"%"} component={Box} sx={{height:10}} color={this.getColorFromCategory(x.category)}/>
                    <Typography variant="caption" padding={1}>{x.to}</Typography>
                    </>
                )
            })}
            
        </Stack>
    );
  }
}