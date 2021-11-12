import { Typography } from '@material-ui/core';
import * as React from 'react';
import { Component } from 'react';
import Stack from '@mui/material/Stack';
import { ThumbnailCard } from './ThumbnailCard';
import { PatientCareplan } from '../Models/PatientCareplan';
import { PatientAvatar } from '../Avatars/PatientAvatar';
import LocalPhoneOutlinedIcon from '@mui/icons-material/LocalPhoneOutlined';
import HealingOutlinedIcon from '@mui/icons-material/HealingOutlined';
import EventNoteIcon from '@mui/icons-material/EventNote';
import ApiContext from '../../pages/_context';
import IDateHelper from '../../globalHelpers/interfaces/IDateHelper';
import { Link } from 'react-router-dom';

export interface Props {
    currentCareplan : PatientCareplan
}

export class PatientContextThumbnails extends Component<Props,{}> {
  static displayName = PatientContextThumbnails.name;
  static contextType = ApiContext
  dateHelper! : IDateHelper

  initialiseServices(){
      this.dateHelper = this.context.dateHelper
  }
  render ()  : JSX.Element{
      this.initialiseServices()
    const currentCareplan = this.props.currentCareplan;
    const patient = currentCareplan.patient;
    return (
      <Link to={"/patients/"+patient.cpr+"/careplans/"+currentCareplan.id}>
        <Stack direction="row" spacing={2}>
        <ThumbnailCard avatar={<PatientAvatar size={80} patient={currentCareplan.patient} />} headline={patient.firstname + " "+currentCareplan?.patient.lastname} boxContent={<HealingOutlinedIcon fontSize="large"/>} >
          <Typography variant="subtitle2">{currentCareplan?.patient.cpr}</Typography>
          <Typography variant="subtitle1">{currentCareplan?.patient.patientContact.primaryPhone}</Typography>
        </ThumbnailCard>
        <ThumbnailCard color="lightblue" headline="Primær kontakt" boxContent={<LocalPhoneOutlinedIcon fontSize="large"/>}>
          <Typography variant="subtitle2">{currentCareplan.patient.contact.fullname}</Typography>
          <Typography variant="subtitle1">{currentCareplan.patient.contact.primaryPhone}</Typography>
        </ThumbnailCard>
        <ThumbnailCard color="lightblue" headline="Monitoreringsplan" boxContent={<EventNoteIcon fontSize="large"/>}>
          <Typography variant="subtitle2">{currentCareplan?.terminationDate ? "Ikke aktiv" : "Aktiv"}</Typography>
          <Typography variant="subtitle1">Startet: {this.dateHelper.DateToString(currentCareplan?.creationDate)}</Typography>
        </ThumbnailCard>
        </Stack>
        </Link>
    );
  }
}
