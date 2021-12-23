import { Typography } from '@material-ui/core';
import * as React from 'react';
import { Component } from 'react';
import Stack from '@mui/material/Stack';
import { ThumbnailCard } from './ThumbnailCard';
import { PatientCareplan } from '@kvalitetsit/hjemmebehandling/Models/PatientCareplan';
import { PatientAvatar } from '../Avatars/PatientAvatar';
import LocalPhoneOutlinedIcon from '@mui/icons-material/LocalPhoneOutlined';
import HealingOutlinedIcon from '@mui/icons-material/HealingOutlined';
import EventNoteIcon from '@mui/icons-material/EventNote';
import ApiContext from '../../pages/_context';
import IDateHelper from '@kvalitetsit/hjemmebehandling/Helpers/interfaces/IDateHelper';
import { Link } from 'react-router-dom';

export interface Props {
    currentCareplan : PatientCareplan
}

export class PatientContextThumbnails extends Component<Props,{}> {
  static displayName = PatientContextThumbnails.name;
  static contextType = ApiContext
  dateHelper! : IDateHelper

  initialiseServices() : void {
      this.dateHelper = this.context.dateHelper
  }
  render ()  : JSX.Element{
      this.initialiseServices()
    const currentCareplan = this.props.currentCareplan;
    const patient = currentCareplan.patient;
    return (
      
        <Stack direction="row" spacing={2}>
          <Link to={"/patients/"+patient.cpr+"/careplans/"+currentCareplan.id}>
        <ThumbnailCard avatar={<PatientAvatar patient={currentCareplan.patient} />} headline={patient.firstname + " "+currentCareplan?.patient.lastname} boxContent={<HealingOutlinedIcon fontSize="large"/>} >
          <Typography className="thumbnail__subheader">{currentCareplan?.patient.cpr}</Typography>
          <Typography className="thumbnail__text">{currentCareplan?.patient.primaryPhone ? currentCareplan?.patient.primaryPhone : "-"}</Typography>
        </ThumbnailCard>
        </Link>
        
        {currentCareplan.patient.contact.primaryContact ? 
        <Link to={"/patients/"+patient.cpr+"/careplans/"+currentCareplan.id}>
        <ThumbnailCard headline="Primær kontakt" boxContent={<LocalPhoneOutlinedIcon fontSize="large"/>}>
          <Typography className="thumbnail__subheader">{currentCareplan.patient.contact.fullname}</Typography>
          <Typography className="thumbnail__text">{currentCareplan.patient.contact.primaryPhone ? currentCareplan.patient.contact.primaryPhone : "-"}</Typography>
        </ThumbnailCard>
        </Link>
        : <></>}
        <Link to={"/patients/"+patient.cpr+"/careplans/"+currentCareplan.id}>
        <ThumbnailCard headline="Monitoreringsplan" boxContent={<EventNoteIcon fontSize="large"/>}>
          <Typography className="thumbnail__subheader">{currentCareplan?.terminationDate ? "Ikke aktiv" : "Aktiv"}</Typography>
          <Typography className="thumbnail__text">Startet: {this.dateHelper.DateToString(currentCareplan?.creationDate)}</Typography>
        </ThumbnailCard>
        </Link>
        </Stack>
        
    );
  }
}
