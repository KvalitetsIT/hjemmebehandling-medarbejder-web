import { Box } from '@material-ui/core';
import React, { Component } from 'react';
import { Topbar } from './Topbar';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import AutoBreadcrumbs from './AutoBreadcrumbs';
import QuestionnaireResponseDetails from '../../pages/patients/[cpr]/careplans/[careplanId]/questionnaires/[questionnaireId]';
import Patients from '../../pages/patients';
import PatientCareplans from '../../pages/patients/[cpr]/careplans/[careplanId]';
import CreatePatient, { CreatePatientSectionsEnum } from '../../pages/createpatient';
import ActivePatients from '../../pages/active/[pagenr]';
import InactivePatients from '../../pages/inactive/[pagenr]';
import MiniDrawer from './MUI/MiniVariantDrawer';
import { ErrorBoundary } from '@kvalitetsit/hjemmebehandling/Errorhandling/ErrorBoundary'
import { CreateToastEvent, CreateToastEventData } from '@kvalitetsit/hjemmebehandling/Events/CreateToastEvent'
import PlandefinitionOverview from '../../pages/planDefinitions/overview';
import CreatePlandefinition from '../../pages/planDefinitions/create';
import CreateQuestionnairePage from '../../pages/questionnaires/create';
import QuestionnaireOverviewPage from '../../pages/questionnaires/overview';
import { Toast } from '@kvalitetsit/hjemmebehandling/Errorhandling/Toast';
import { CheckmarkIcon } from '../Icons/Icons';


export interface State {
  drawerIsOpen: boolean,
  createToastData?: CreateToastEventData;
}

export class Layout extends Component<{}, State> {
  static displayName = Layout.name;

  constructor(props: {}) {
    super(props);
    this.state = {
      drawerIsOpen: true
    }

    window.addEventListener(CreateToastEvent.eventName, (event: Event) => {
      const data = (event as CustomEvent).detail as CreateToastEventData;
      this.setState({ createToastData: data });
    });
  }

  resetToast(): void {
    this.setState({ createToastData: undefined })
  }

  render(): JSX.Element {

    const accoridansPatient: boolean[] = [];
    accoridansPatient[CreatePatientSectionsEnum.patientInfo] = true;
    accoridansPatient[CreatePatientSectionsEnum.primaryContactInfo] = false;
    accoridansPatient[CreatePatientSectionsEnum.planDefinitionInfo] = false;

    const accoridansContact: boolean[] = [];
    accoridansContact[CreatePatientSectionsEnum.patientInfo] = false;
    accoridansContact[CreatePatientSectionsEnum.primaryContactInfo] = true;
    accoridansContact[CreatePatientSectionsEnum.planDefinitionInfo] = false;

    const accoridansPlanDefinition: boolean[] = [];
    accoridansPlanDefinition[CreatePatientSectionsEnum.patientInfo] = false;
    accoridansPlanDefinition[CreatePatientSectionsEnum.primaryContactInfo] = false;
    accoridansPlanDefinition[CreatePatientSectionsEnum.planDefinitionInfo] = true;

    return (
      <>


        <Box sx={{ display: 'flex' }}>

          <ErrorBoundary>
            <Router>

              <MiniDrawer />

              <Box component="main" sx={{ flexGrow: 1, p: 3 }}>

                <Topbar />


                <Box paddingBottom={3}>
                  <AutoBreadcrumbs />
                </Box>
                <ErrorBoundary ekstraText="Fejlen der opstod kræver opdatering af siden (F5)">
                  {this.state.createToastData ?
                    <Toast onClose={() => this.resetToast()} icon={<CheckmarkIcon color='white' size='2rem' />} positionVertical='top' positionhorizontal='center' snackbarTitle={this.state.createToastData.title} snackbarColor='error'></Toast>
                    : <></>
                  }
                  <Switch>
                    <Route path="/patients/:cpr/questionnaires/:questionnaireId" render={(props) => <Redirect to={"/patients/" + props.match.params.cpr + "/careplans/Aktiv/questionnaires/" + props.match.params.questionnaireId} />} />

                    <Route path="/patients/:cpr/careplans/:careplanId/questionnaires/:questionnaireId" render={(props) => <QuestionnaireResponseDetails {...props} />} />
                    <Route path="/patients/:cpr/careplans/:careplanId/questionnaires/" render={(props) => <QuestionnaireResponseDetails {...props} />} />
                    <Route path="/patients/:cpr/careplans/:careplanId" render={(props) => <PatientCareplans {...props} />} />
                    <Route path="/patients/:cpr/careplans" render={(props) => <Redirect to={"/patients/" + props.match.params.cpr + "/careplans/Aktiv"} />} />

                    <Route path="/patients/:cpr/edit/patient" render={(props) => <CreatePatient editmode={true} openAccordians={accoridansPatient} {...props} />} />
                    <Route path="/patients/:cpr/edit/contact" render={(props) => <CreatePatient editmode={true} openAccordians={accoridansContact} {...props} />} />
                    <Route path="/patients/:cpr/edit/plandefinition" render={(props) => <CreatePatient editmode={true} openAccordians={accoridansPlanDefinition} {...props} />} />
                    <Route path="/patients/:cpr/edit" render={(props) => <CreatePatient editmode={true} openAccordians={accoridansPatient} {...props} />} />
                    <Route path="/patients/:cpr" render={(props) => <Redirect to={"/patients/" + props.match.params.cpr + "/careplans/Aktiv"} />} />

                    <Route path="/plandefinitions/:plandefinitionid/edit" render={(props) => <CreatePlandefinition {...props} />} />
                    <Route path="/plandefinitions/create" render={(props) => <CreatePlandefinition {...props} />} />
                    <Route path="/plandefinitions" render={(props) => <PlandefinitionOverview {...props} />} />

                    <Route path="/questionnaires/:questionnaireId/edit" render={(props) => <CreateQuestionnairePage {...props} />} />
                    <Route path="/questionnaires/create" render={(props) => <CreateQuestionnairePage {...props} />} />
                    <Route path="/questionnaires" render={(props) => <QuestionnaireOverviewPage {...props} />} />

                    <Route path="/active/:pagenr" render={(props) => <ActivePatients {...props} />} />
                    <Route path="/inactive/:pagenr" render={(props) => <InactivePatients {...props} />} />
                    <Route path="/active" render={(props) => <Redirect to={"/active/1"} {...props} />} />
                    <Route path="/inactive" render={(props) => <Redirect to={"/inactive/1"} {...props} />} />

                    <Route path="/patients"><Patients /></Route>
                    <Route path="/newpatient" render={(props) => <CreatePatient editmode={false} openAccordians={accoridansPatient} {...props} />} />

                    <Route path="/"><Patients /></Route>
                  </Switch>
                </ErrorBoundary>
              </Box>

            </Router>
          </ErrorBoundary>
        </Box>
      </>
    );
  }
}