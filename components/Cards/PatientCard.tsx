import { Typography } from '@material-ui/core';
import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import { PatientDetail } from '../../components/Models/PatientDetail';
import { PatientAvatar } from '../../components/Avatars/PatientAvatar';
import { Component } from 'react';
import { CardHeader, Divider, Grid, Stack } from '@mui/material';
import { Skeleton } from '@mui/material';
import ModeEditOutlineIcon from '@mui/icons-material/ModeEditOutline';
import { ConfirmationButton } from '../Input/ConfirmationButton';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import ApiContext from '../../pages/_context';
import IUserService from '../../services/interfaces/IUserService';
import {ErrorBoundary} from '@kvalitetsit/hjemmebehandling/Errorhandling/ErrorBoundary'
export interface Props {
  patient: PatientDetail

}

export interface State {
  loading: boolean;
}

export class PatientCard extends Component<Props, State> {
  static displayName = PatientCard.name;
  static contextType = ApiContext
  userService!: IUserService;

  constructor(props: Props) {
    super(props);
    this.state = { loading: true }
  }

  async resetPassword(): Promise<void> {
    try {
      await this.userService.ResetPassword(this.props.patient)
    } catch (error: any) {
      this.setState(() => { throw error })
    }
  }

  initialiseServices(): void {
    this.userService = this.context.userService;
  }
  render(): JSX.Element {
    this.initialiseServices();
    const contents = this.state.loading ? <Skeleton variant="rectangular" height={200} /> : this.renderCard();
    return contents;
  }

  componentDidMount(): void {
    this.setState({ loading: false })
  }

  renderCard(): JSX.Element {
    const contact = this.props.patient.contact
    return (
      <Card>

        <CardContent>
          <CardHeader
            avatar={<PatientAvatar patient={this.props.patient} />}
            title={
              <Stack>
                <Typography>
                  {this.props.patient.firstname} {this.props.patient.lastname} {this.props.patient.username ? " ("+this.props.patient.username+")" : ""}<br />
                  
                  {this.props.patient.cpr?.slice(0, 6)}-{this.props.patient.cpr?.slice(6)}
                </Typography>
                <Typography variant="subtitle2">
                  {this.props.patient.primaryPhone} {this.props.patient.secondaryPhone ? "(" + this.props.patient.secondaryPhone + ")" : ""}
                </Typography>
              </Stack>
            }
            action={
              <Stack>
                <ErrorBoundary>
                  <Button component={Link} to={"/patients/" + this.props.patient.cpr + "/edit"}><ModeEditOutlineIcon fontSize="inherit" /> </Button>
                </ErrorBoundary>
                <ErrorBoundary>
                  <ConfirmationButton variant="text" color="primary" title="Nulstil adgangskode?" buttonText={<LockOpenIcon />} action={async () => await this.resetPassword()}>
                    Brugernavn: <Typography variant='button'>{this.props.patient.username} </Typography> 
                    <br/>
                    <br/>
                    Er du sikker på at du ønsker at nulstille patientens adgangskode?
                  </ConfirmationButton>
                </ErrorBoundary>
              </Stack>
            }
          />

          <Divider />
          <Grid container padding={2}>
            <Grid item xs={12}>
              <Typography variant="subtitle2">
                {this.props.patient.address?.street}<br />
                {this.props.patient.address?.zipCode}, {this.props.patient.address?.city}<br />
                {this.props.patient.address?.country}
              </Typography>
              <br />
              <Typography variant="button">
                Kontakt
              </Typography>
              <Typography variant="subtitle2">
                {contact.fullname} {contact.affiliation ? "(" + contact.affiliation + ")" : ""}
                <br />
                {contact.primaryPhone} {contact.secondaryPhone ? "(" + contact.secondaryPhone + ")" : ""}<br />
              </Typography>
            </Grid>
          </Grid>



        </CardContent>
      </Card>
    )
  }

}
