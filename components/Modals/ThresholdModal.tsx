import { Box, CardHeader, Modal, TableRow, Typography } from '@material-ui/core';
import React, { Component } from 'react';
import Stack from '@mui/material/Stack';
import { Button, Card, CardContent, Table, TableCell, TableHead } from '@mui/material';
import { Question } from '../Models/Question';
import TuneIcon from '@mui/icons-material/Tune';
import { CategoryEnum } from '../Models/CategoryEnum';
import { ColorSlider } from '../Input/ColorSlider';
import { ThresholdNumber } from '../Models/ThresholdNumber';
import { ThresholdOption } from '../Models/ThresholdOption';
import { CategorySelect } from '../Input/CategorySelect';

export interface Props {
    question : Question;
    onThresholdNumberChange : (newThresholdNumber : ThresholdNumber) => void
    onThresholdOptionChange : (newThresholdOption : ThresholdOption) => void
}
export interface State {
  modalIsOpen: boolean
  editMode : boolean
  onThresholdNumberChange : (newThresholdNumber : ThresholdNumber) => void
  onThresholdOptionChange : (newThresholdOption : ThresholdOption) => void
}


export class ThresholdModal extends Component<Props,State> {
  static displayName = ThresholdModal.name;
  constructor(props : Props){
    super(props);
    
    this.state = {
        onThresholdNumberChange : props.onThresholdNumberChange.bind(props.onThresholdNumberChange),
        onThresholdOptionChange : props.onThresholdOptionChange.bind(props.onThresholdOptionChange),
        modalIsOpen : false,
        editMode : false
    }
}

getChipColorFromCategory(category : CategoryEnum){
    if(category === CategoryEnum.RED)
        return "error"
    if(category === CategoryEnum.YELLOW)
        return "warning"
    //if(category == CategoryEnum.GREEN)
      //  return "success"
    if(category === CategoryEnum.BLUE)
        return "primary"

    return "default"

}

getDanishColornameFromCategory(category : CategoryEnum){
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

SliderThresholdNumberChange(threshold : ThresholdNumber){
    return (newValues : number[]) => {
        let sortedNumbers = newValues.sort( (a,b) => a - b );
        threshold.from = sortedNumbers[0];
        threshold.to = sortedNumbers[1];
        this.state.onThresholdNumberChange(threshold)
    }
}

SelectThresholdOptionChange(threshold : ThresholdOption){
    return (newCategory : CategoryEnum) => {
        threshold.category = newCategory;
        this.state.onThresholdOptionChange(threshold)
    }
}

  render () {
    let hasNumberenThresholds = this.props.question.thresholdPoint.length > 0
    let hasOptionThresholds = this.props.question.options.length > 0

    let hasThreshold = hasNumberenThresholds || hasOptionThresholds;
      
    if(!hasThreshold)
        return ("")

    return (
        <>
        <Modal disableEnforceFocus open={this.state.modalIsOpen} onClose={()=>this.setState({modalIsOpen : false})}>
            <Box top={200} right={500}  sx={{ width: 400 , position: 'absolute' as 'absolute'}}>
                <Card>
                    <CardHeader title="Tærskelværdier" subheader={this.props.question.question}/>
                    <CardContent>
                        <Stack spacing={5}>
                        {this.props.question.thresholdPoint.map(threshold => {
                            return (
                                <>
                       <Stack direction="row" spacing={3}>
                           <Typography>
                               {this.getDanishColornameFromCategory(threshold.category)}
                           </Typography>
                                <ColorSlider onChange={this.SliderThresholdNumberChange(threshold)} category={threshold.category} values={[threshold.from, threshold.to]} />
                     </Stack>
                            </>
                            )
                        })}

                        {this.props.question.options.length > 0 ? 
                        <Table>
                        <TableHead>
                                <TableRow>
                                    <TableCell>Svarmulighed</TableCell>
                                    <TableCell>Kateogri</TableCell>
                                </TableRow>
                                </TableHead>
                        {this.props.question.options.map(threshold => {
                            return (
                                <>
                                    <TableRow>
                                        <TableCell>{threshold.option}</TableCell>
                                        <TableCell>
                                        <CategorySelect  onChange={this.SelectThresholdOptionChange(threshold)} category={threshold.category}/>
                                        </TableCell>
                                    </TableRow>
                            </>
                            )
                        })}

                        </Table>
                        : ""}

                        {this.state.editMode ? 
                            <Button onClick={()=>this.setState({editMode : false})} variant="contained">Gem</Button> : 
                            <Button onClick={()=>this.setState({editMode : true})} variant="contained">Ændré</Button>    
                        }
                        
                        
                       </Stack>
                    </CardContent>
                </Card>
            </Box>
        </Modal>
        <Button onClick={()=>this.setState({modalIsOpen : true})} variant="text">
                <TuneIcon color="info"/>
        </Button>
        </>
    );
  }
}

