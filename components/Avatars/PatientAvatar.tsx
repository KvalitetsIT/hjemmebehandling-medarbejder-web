import * as React from 'react';
import { Component } from 'react';
import { Avatar } from '@mui/material';
import ApiContext from '../../pages/_context';
import { PatientDetail } from '../Models/PatientDetail';

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
        <Avatar sx={{ bgcolor: "green", width:'100%', height:'100%' }} variant="square">
        {initials}
      </Avatar>
    )
  }



}
