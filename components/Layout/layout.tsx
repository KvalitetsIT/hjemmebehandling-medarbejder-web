import { Box } from '@material-ui/core';
import React, { Component } from 'react';
import { Topbar } from './Topbar';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import QuestionnaireResponseDetails from '../../pages/patients/[cpr]/careplans/[careplanId]/questionnaires/[questionnaireId]';
import Patients from '../../pages/patients';
import PatientCareplans from '../../pages/patients/[cpr]/careplans/[careplanId]';
import { PatientAccordianSectionsEnum } from '../createpatient';
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
import NewPatientPage from '../../pages/newPatients';
import EditPatientContact from '../../pages/patients/[cpr]/edit/contact';
import EditPatientInfo from '../../pages/patients/[cpr]/edit/patient';
import EditPatientPlandefinition from '../../pages/patients/[cpr]/edit/plandefinition';
import AboutPage from '../../pages/about';


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



    return (
      <>


        <Box sx={{ display: 'flex' }}>

          <ErrorBoundary>
            <Router>

              <MiniDrawer />

              <Box component="main" sx={{ flexGrow: 1, p: 3 }}>

                <Topbar />

                <ErrorBoundary ekstraText="Fejlen der opstod kræver opdatering af siden (F5)">
                  {this.state.createToastData ?
                    <Toast onClose={() => this.resetToast()} icon={<CheckmarkIcon size='2rem' />} positionVertical='bottom' positionhorizontal='right' snackbarTitle={this.state.createToastData.title} snackbarColor={this.state.createToastData.alertColor}>
                      {this.state.createToastData.subTitle}
                    </Toast>
                    : <></>
                  }
                  <Switch>
                    <Route path="/patients/:cpr/questionnaires/:questionnaireId" render={(props) => <Redirect to={"/patients/" + props.match.params.cpr + "/careplans/Aktiv/questionnaires/" + props.match.params.questionnaireId} />} />

                    <Route path="/patients/:cpr/careplans/:careplanId/questionnaires/:questionnaireId" render={(props) => <QuestionnaireResponseDetails {...props} />} />
                    <Route path="/patients/:cpr/careplans/:careplanId/questionnaires/" render={(props) => <QuestionnaireResponseDetails {...props} />} />
                    <Route path="/patients/:cpr/careplans/:careplanId" render={(props) => <PatientCareplans {...props} />} />
                    <Route path="/patients/:cpr/careplans" render={(props) => <Redirect to={"/patients/" + props.match.params.cpr + "/careplans/Aktiv"} />} />

                    <Route path="/patients/:cpr/edit/patient" render={(props) => <EditPatientInfo key="patient" editmode={true} activeAccordian={PatientAccordianSectionsEnum.patientInfo} {...props} />} />
                    <Route path="/patients/:cpr/edit/contact" render={(props) => <EditPatientContact key="contact" editmode={true} activeAccordian={PatientAccordianSectionsEnum.primaryContactInfo} {...props} />} />
                    <Route path="/patients/:cpr/edit/plandefinition" render={(props) => <EditPatientPlandefinition key="planDefinition" editmode={true} activeAccordian={PatientAccordianSectionsEnum.planDefinitionInfo} {...props} />} />
                    <Route path="/patients/:cpr/edit" render={(props) => <EditPatientInfo key="edit" editmode={true} activeAccordian={PatientAccordianSectionsEnum.patientInfo} {...props} />} />
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
                    <Route path="/newpatient" render={(props) => <NewPatientPage editmode={false} activeAccordian={PatientAccordianSectionsEnum.patientInfo} {...props} />} />

                    <Route path="/about"><AboutPage /></Route>

                    <Route path="/"><Patients /></Route>

                    {/* The following routes applies to the newest version of router dom 
                         
                    <Route path='/' element={<Patients />} />
                    <Route path="/about"><AboutPage /></Route>
                    <Route path="/patients"><Patients /></Route>
                    <Route path="/newpatient" element={<NewPatientPage editmode={false} activeAccordian={PatientAccordianSectionsEnum.patientInfo} {...this.props}/>} />
                    <Route path="/active/:pagenr" element={<ActivePatients />} />
                    <Route path="/inactive/:pagenr" element={<InactivePatients />} />
                    <Route path="/active" element={<Redirect to={"/active/1"} />} />
                    <Route path="/inactive" element={<Redirect to={"/inactive/1"} />} />

                    <Route path='/patients/:cpr'>
                      <Route index element={<Redirect to={"/patients/:cpr/careplans/Aktiv"} />} />
                      <Route path='/edit'>
                        <Route index element={<EditPatientInfo key="edit" editmode={true} activeAccordian={PatientAccordianSectionsEnum.patientInfo} />} />
                        <Route path="patient" element={<EditPatientInfo key="patient" editmode={true} activeAccordian={PatientAccordianSectionsEnum.patientInfo} />} />
                        <Route path="contact" element={<EditPatientContact key="contact" editmode={true} activeAccordian={PatientAccordianSectionsEnum.primaryContactInfo} />} />
                        <Route path="plandefinition" element={<EditPatientPlandefinition key="planDefinition" editmode={true} activeAccordian={PatientAccordianSectionsEnum.planDefinitionInfo} />} />
                      </Route>
                      <Route path='/careplans'>
                        <Route index element={<Redirect to={"/patients/" + props.match.params.cpr + "/careplans/Aktiv"} />} />
                        <Route path=':careplanId'>
                          <Route index element={<PatientCareplans />} />
                          <Route path="/questionnaires">
                            <Route index element={<QuestionnaireResponseDetails />} />
                            <Route path=":questionnaireId" element={<QuestionnaireResponseDetails />} />
                          </Route>
                        </Route>
                      </Route>
                      <Route path="questionnaires/:questionnaireId" element={<Redirect to={"/patients/" + props.match.params.cpr + "/careplans/Aktiv/questionnaires/" + props.match.params.questionnaireId} />} />
                    </Route>

                    <Route path='/questionnaires'>
                      <Route index element={<QuestionnaireOverviewPage />} />
                      <Route path=":questionnaireId/edit" element={<CreateQuestionnairePage />} />
                      <Route path="create" element={<CreateQuestionnairePage />} />
                    </Route>

                    <Route path='/plandefinitions'>
                      <Route index element={<PlandefinitionOverview />} />
                      <Route path=":plandefinitionid/edit" element={<CreatePlandefinition />} />
                      <Route path="create" element={<CreatePlandefinition />} />
                    </Route> 
                    
*/}
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