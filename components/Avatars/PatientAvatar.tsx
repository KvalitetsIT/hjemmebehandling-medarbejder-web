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

      const width = this.props.size ? this.props.size : 50
      const height = this.props.size ? this.props.size : 50
    return (
        <Avatar sx={{ bgcolor: "green",width:width, height:height }} variant="square">
        {initials}
      </Avatar>
    )
  }



}
