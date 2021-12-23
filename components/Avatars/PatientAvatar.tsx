import * as React from 'react';
import { Component } from 'react';
import { Avatar } from '@mui/material';
import ApiContext from '../../pages/_context';
import { PatientDetail } from '@kvalitetsit/hjemmebehandling/Models/PatientDetail';

export interface Props {
    patient : PatientDetail
    size? : number
}



export class PatientAvatar extends Component<Props,{}> {
  static displayName = PatientAvatar.name;
  static contextType = ApiContext


  constructor(props : Props){
    super(props);
}


  render () : JSX.Element{
      const patient = this.props.patient;
      let initials = "";
      initials += patient.firstname ? patient.firstname[0] : ""
      initials += patient.lastname ? patient.lastname[0] : ""

    return (
        <Avatar variant="square">
        {initials}
      </Avatar>
    )
  }



}
