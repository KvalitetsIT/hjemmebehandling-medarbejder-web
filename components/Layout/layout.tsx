import { AppBar, Box, Breadcrumbs, Chip, Container, Divider, Drawer, Fab, Grid, IconButton, List, ListItem, ListItemText, ListSubheader, Paper, Toolbar, Typography } from '@material-ui/core';
import React, { Component, useContext } from 'react';
import Stack from '@mui/material/Stack';
import { ListItemButton } from '@mui/material';
import { withThemeCreator } from '@material-ui/styles';
import MenuIcon from "@mui/icons-material/Menu"
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from 'react-router-dom';
import App from '../../pages';
import AutoBreadcrumbs from './AutoBreadcrumbs';
import ApiContext from '../../pages/_context';
import QuestionnaireResponseDetails from '../../pages/patients/[cpr]/careplans/[careplanId]/questionnaires/[questionnaireId]';
import Patients from '../../pages/patients';
import PatientCareplans from '../../pages/patients/[cpr]/careplans/[careplanId]';
import NewPatient from '../../pages/newpatient';


export interface Props {
}
export interface State {
  drawerIsOpen: boolean
}



export class Layout extends Component<Props,State> {
  static displayName = Layout.name;

constructor(props : Props){
    super(props);

}

toogleDrawer = () => {
    
  };

  render () {
    return (
<>
        <Topbar />
        
        <Router>
            

        <Sidebar/>
        
       
        <Box paddingLeft={35} paddingRight={5} paddingTop={1}>
        
            <AutoBreadcrumbs/> 
            
            <Box paddingTop={5} >
        
            <Switch>
              <Route path="/patients/:cpr/careplans/:careplanId/questionnaires/:questionnaireId" render={(props) => <QuestionnaireResponseDetails {...props}/>} />
              <Route path="/patients/:cpr/careplans/:careplanId/questionnaires/" render={(props) => <QuestionnaireResponseDetails {...props}/>} />
              <Route path="/patients/:cpr/careplans/:careplanId" render={(props) => <PatientCareplans {...props}/>} />
              <Route path="/patients/:cpr/questionnaires/:questionnaireId" render={(props) => <Redirect to={"/patients/"+props.match.params.cpr+"/careplans/Aktiv/questionnaires/"+props.match.params.questionnaireId}/>} />
              <Route path="/patients/:cpr/careplans" render={(props) => <Redirect to={"/patients/"+props.match.params.cpr+"/careplans/Aktiv"}/>} />
              <Route path="/patients/:cpr" render={(props) => <Redirect to={"/patients/"+props.match.params.cpr+"/careplans/Aktiv"}/>}/>
              <Route path="/patients"><Patients/></Route>
              
              <Route path="/newpatient" render={(props) => <NewPatient {...props}/>} />





              <Route path="/">
                <h2>Home</h2>
              </Route>
            </Switch>

            </Box>
            
            
        </Box>

        </Router>
        </>
    );
  }
}
