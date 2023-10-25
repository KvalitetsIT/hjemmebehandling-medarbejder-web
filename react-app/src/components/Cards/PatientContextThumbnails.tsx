import * as React from 'react';
import { Component } from 'react';
import { ThumbnailCard } from './ThumbnailCard';
import { PatientCareplan } from '@kvalitetsit/hjemmebehandling/Models/PatientCareplan';
import { PatientAvatar } from '../Avatars/PatientAvatar';
import LocalPhoneOutlinedIcon from '@mui/icons-material/LocalPhoneOutlined';
import HealingOutlinedIcon from '@mui/icons-material/HealingOutlined';
import EventNoteIcon from '@mui/icons-material/EventNote';
import ApiContext, { IApiContext } from '../../pages/_context';
import IDateHelper from '@kvalitetsit/hjemmebehandling/Helpers/interfaces/IDateHelper';
import { Link } from 'react-router-dom';
import IsEmptyCard from '@kvalitetsit/hjemmebehandling/Errorhandling/IsEmptyCard';
import { Grid, Typography } from '@mui/material';

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
              {patient?.primaryContact?.fullname ?
                <Link to={"/patients/" + patient!.cpr + "/careplans/" + currentCareplan.id}>
                  <ThumbnailCard headline="Primær kontakt" boxContent={<LocalPhoneOutlinedIcon fontSize="large" />}>
                    <Typography className="thumbnail__subheader">{patient!.primaryContact.fullname}</Typography>
                    <Typography className="thumbnail__text">{patient!.primaryContact.contact?.primaryPhone ? patient!.primaryContact.contact?.primaryPhonenumberToString() : "-"}</Typography>
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
