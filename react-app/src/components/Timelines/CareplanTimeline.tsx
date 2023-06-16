import React, { Component } from 'react';
import { PatientCareplan } from '@kvalitetsit/hjemmebehandling/Models/PatientCareplan';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';

export interface Props {
    careplans : PatientCareplan[]
    activeCareplan : PatientCareplan
    careplanClicked : (careplan : PatientCareplan) => void;
}
export interface State {
    activeCareplan : PatientCareplan
}



export class CareplanTimeline extends Component<Props,State> {
  static displayName = CareplanTimeline.name;

constructor(props : Props){
    super(props);
    this.state = ({
        activeCareplan : props.activeCareplan
    })
}

clickedButton(careplan : PatientCareplan) : void{
    this.setState({
        activeCareplan : careplan
    })
    this.props.careplanClicked(careplan)
}

  render () : JSX.Element {
      const activeCareplan : PatientCareplan = this.state.activeCareplan;

    return (
        <Stepper activeStep={1} alternativeLabel>
        {this.props.careplans.sort( (a,b) => b.creationDate!.getTime() - a.creationDate!.getTime()).map(careplan => {
    return (
        
            <Step>
                    <StepLabel StepIconComponent={AssignmentIndIcon}>
                    <Button onClick={()=>this.clickedButton(careplan)} component={Link} to={"./"+careplan.id} disabled={activeCareplan.id === careplan.id ? true : false} variant="outlined">
                    {careplan.planDefinitions.map(x=>x.name + ", ")}
                    <br/>
                    {careplan.creationDate!.toLocaleDateString()} - {careplan.terminationDate ? careplan.terminationDate.toLocaleDateString() : ""}
                    <br/>
                    </Button>
                </StepLabel>
            </Step>
    )
    
    
})}
</Stepper>
   
    )
  }
}
