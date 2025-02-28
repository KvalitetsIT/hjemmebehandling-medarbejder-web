import * as React from 'react';
import { Component } from 'react';
import { ThumbnailCard } from './ThumbnailCard';
import { PatientCareplan } from '../Models/PatientCareplan';
import { PatientAvatar } from '../Avatars/PatientAvatar';
import LocalPhoneOutlinedIcon from '@mui/icons-material/LocalPhoneOutlined';
import HealingOutlinedIcon from '@mui/icons-material/HealingOutlined';
import EventNoteIcon from '@mui/icons-material/EventNote';
import ApiContext, { IApiContext } from '../../pages/_context';
import IDateHelper from '../Helpers/interfaces/IDateHelper';
import { Link } from 'react-router-dom';
import IsEmptyCard from '../Errorhandling/IsEmptyCard';
import { Grid, Typography } from '@mui/material';
import { PrimaryContact } from '../Models/PrimaryContact';

export interface Props {
  currentCareplan: PatientCareplan
}

export class PatientContextThumbnails extends Component<Props, {}> {
  static displayName = PatientContextThumbnails.name;
  static contextType = ApiContext
   
  
  dateHelper!: IDateHelper


  constructor(props: Props) {
    super(props)
     
  }

  initialiseServices(): void {
    const api = this.context as IApiContext
    this.dateHelper =  api.dateHelper
  }
  render(): JSX.Element {
    this.initialiseServices()
    const currentCareplan = this.props.currentCareplan;
    const patient = currentCareplan?.patient;

    const primaryContact = patient!.primaryContact as PrimaryContact;

    return (

      <IsEmptyCard object={currentCareplan} jsxWhenEmpty="Ingen monitoreringsplan">
        <IsEmptyCard object={currentCareplan?.patient} jsxWhenEmpty="Ingen patient">


          <Grid container spacing={2}>
            <Grid item xs="auto">
              <Link to={"/patients/" + patient?.cpr + "/careplans/" + currentCareplan?.id}>
                <ThumbnailCard avatar={<PatientAvatar patient={patient!} />} headline={patient?.firstname + " " + patient?.lastname} boxContent={<HealingOutlinedIcon fontSize="large" />} >
                  <Typography className="thumbnail__subheader">{patient?.cprToString()}</Typography>
                  <Typography className="thumbnail__text">{patient?.contact?.primaryPhone ? patient!.contact?.primaryPhonenumberToString() : "-"}</Typography>
                </ThumbnailCard>
              </Link>
            </Grid>
            <Grid item xs="auto">
              {primaryContact?.fullname ?
                <Link to={"/patients/" + patient!.cpr + "/careplans/" + currentCareplan.id}>
                  <ThumbnailCard headline="Primær kontakt" boxContent={<LocalPhoneOutlinedIcon fontSize="large" />}>
                    <Typography className="thumbnail__subheader">{primaryContact .fullname}</Typography>
                    <Typography className="thumbnail__text">{primaryContact.contact?.primaryPhone ? primaryContact .contact?.primaryPhonenumberToString() : "-"}</Typography>
                  </ThumbnailCard>
                </Link>
                : <></>}
            </Grid>
            <Grid item xs="auto">
              <Link to={"/patients/" + patient?.cpr + "/careplans/" + currentCareplan?.id}>
                <ThumbnailCard headline="Monitoreringsplan" boxContent={<EventNoteIcon fontSize="large" />}>
                  <Typography className="thumbnail__subheader">{currentCareplan?.terminationDate ? "Ikke aktiv" : "Aktiv"}</Typography>
                  <Typography className="thumbnail__text">Startet: {currentCareplan && currentCareplan.creationDate ? this.dateHelper.DateToString(currentCareplan.creationDate) : "N/A"}</Typography>
                </ThumbnailCard>
              </Link>
            </Grid>
          </Grid>
        </IsEmptyCard>
      </IsEmptyCard>

    );
  }
}
