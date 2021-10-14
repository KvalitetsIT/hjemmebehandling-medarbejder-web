import { AppBar, Box, Breadcrumbs, Chip, Container, Divider, Drawer, Fab, Grid, IconButton, List, ListItem, ListItemText, ListSubheader, Paper, Toolbar, Typography } from '@material-ui/core';
import React, { Component, useContext } from 'react';
import Stack from '@mui/material/Stack';
import { ListItemButton } from '@mui/material';
import { withThemeCreator } from '@material-ui/styles';
import MenuIcon from "@mui/icons-material/Menu"
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import App from '../../pages';
import AutoBreadcrumbs from './AutoBreadcrumbs';
import ApiContext from '../../pages/_context';
import QuestionnaireResponseDetails from '../../pages/patients/[cpr]/questionnaires/[questionnaireId]';
import PatientCareplans from '../../pages/patients/[cpr]';
import Patients from '../../pages/patients';


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
              <Route path="/patients/:cpr/questionnaires/:questionnaireId" render={(props) => <QuestionnaireResponseDetails {...props}/>} />
              <Route path="/patients/:cpr/questionnaires/" render={(props) => <QuestionnaireResponseDetails {...props}/>} />
              <Route path="/patients/:cpr" render={(props) => <PatientCareplans {...props}/>} />
              
              <Route path="/patients"><Patients/></Route>
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
