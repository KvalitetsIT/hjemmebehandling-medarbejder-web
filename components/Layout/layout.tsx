import { Box } from '@material-ui/core';
import React, { Component } from 'react';
import { Topbar } from './Topbar';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import AutoBreadcrumbs from './AutoBreadcrumbs';
import QuestionnaireResponseDetails from '../../pages/patients/[cpr]/careplans/[careplanId]/questionnaires/[questionnaireId]';
import Patients from '../../pages/patients';
import PatientCareplans from '../../pages/patients/[cpr]/careplans/[careplanId]';
import CreatePatient from '../../pages/createpatient';
import ActivePatients from '../../pages/active/[pagenr]';
import InactivePatients from '../../pages/inactive/[pagenr]';
import MiniDrawer from './MUI/MiniVariantDrawer';


export interface State {
  drawerIsOpen: boolean
}

export class Layout extends Component<{},State> {
  static displayName = Layout.name;

constructor(props : {}){
  super(props);
  this.state = {
    drawerIsOpen : true
  }
}

  render () : JSX.Element{
      const accoridansPatient = {
        PatientIsOpen : true,
        RelativeContactIsOpen : false,
        PlanDefinitionIsOpen : false
      }

      const accoridansContact = {
        PatientIsOpen : false,
        RelativeContactIsOpen : true,
        PlanDefinitionIsOpen : false
      }

      const accoridansPlanDefinition = {
        PatientIsOpen : false,
        RelativeContactIsOpen : false,
        PlanDefinitionIsOpen : true
      }
    return (
<>


<Box sx={{ display: 'flex' }}>
      

        <Router>

        <MiniDrawer/>

        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        
          <Topbar/>
          
          <Box paddingBottom={3}>
          <AutoBreadcrumbs /> 
          </Box>
          
            <Switch>              
              <Route path="/patients/:cpr/questionnaires/:questionnaireId" render={(props) => <Redirect to={"/patients/"+props.match.params.cpr+"/careplans/Aktiv/questionnaires/"+props.match.params.questionnaireId}/>} />
              
              <Route path="/patients/:cpr/careplans/:careplanId/questionnaires/:questionnaireId" render={(props) => <QuestionnaireResponseDetails {...props}/>} />
              <Route path="/patients/:cpr/careplans/:careplanId/questionnaires/" render={(props) => <QuestionnaireResponseDetails {...props}/>} />
              <Route path="/patients/:cpr/careplans/:careplanId" render={(props) => <PatientCareplans {...props}/>} />
              <Route path="/patients/:cpr/careplans" render={(props) => <Redirect to={"/patients/"+props.match.params.cpr+"/careplans/Aktiv"}/>} />
              
              <Route path="/patients/:cpr/edit/patient" render={(props) => <CreatePatient openAccordians={accoridansPatient} {...props}/>} />
              <Route path="/patients/:cpr/edit/contact" render={(props) => <CreatePatient openAccordians={accoridansContact} {...props}/>} />
              <Route path="/patients/:cpr/edit/plandefinition" render={(props) => <CreatePatient openAccordians={accoridansPlanDefinition} {...props}/>} />
              <Route path="/patients/:cpr/edit" render={(props) => <CreatePatient openAccordians={accoridansPatient} {...props}/>} />
              <Route path="/patients/:cpr" render={(props) => <Redirect to={"/patients/"+props.match.params.cpr+"/careplans/Aktiv"}/>}/>
              
              
              <Route path="/active/:pagenr" render={(props) => <ActivePatients {...props}/>} />
              <Route path="/inactive/:pagenr" render={(props) => <InactivePatients {...props}/>} />
              <Route path="/active" render={(props) => <Redirect to={"/active/1"} {...props}/>}/>
              <Route path="/inactive" render={(props) => <Redirect to={"/inactive/1"} {...props}/>}/>
              
              <Route path="/patients"><Patients/></Route>
              <Route path="/newpatient" render={(props) => <CreatePatient openAccordians={accoridansPatient} {...props}/>} />

              <Route path="/"><Patients/></Route>
            </Switch>
            </Box>
        </Router>
        </Box>
        </>
    );
  }
}