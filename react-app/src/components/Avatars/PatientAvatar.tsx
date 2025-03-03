import * as React from 'react';
import { Component } from 'react';
import { Avatar, Typography } from '@mui/material';
import ApiContext from '../../pages/_context';
import { PatientSimple } from '../Models/PatientSimple';

export interface Props {
  patient: PatientSimple
  height?: number
}



export class PatientAvatar extends Component<Props, {}> {
  static displayName = PatientAvatar.name;
  static contextType = ApiContext


  constructor(props: Props) {
    super(props);
  }


  render(): JSX.Element {
    const patient = this.props.patient;
    let initials = "";
    initials += patient.firstname ? patient.firstname[0] : ""
    initials += patient.lastname ? patient.lastname[0] : ""

    return (

      <Avatar variant="square" sx={{height: this.props.height, width: this.props.height}}>
        <Typography fontWeight="bold" variant='h5'>{initials}</Typography>
      </Avatar>
    )
  }



}
