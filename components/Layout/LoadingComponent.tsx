import { AppBar, Box, Breadcrumbs, Chip, Container, Divider, Drawer, Fab, Grid, IconButton, List, ListItem, ListItemText, ListSubheader, Paper, Toolbar, Typography } from '@material-ui/core';
import React, { Component } from 'react';
import Stack from '@mui/material/Stack';
import { Backdrop, ListItemButton } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import { withThemeCreator } from '@material-ui/styles';
import MenuIcon from "@mui/icons-material/Menu"
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import AutoBreadcrumbs from './AutoBreadcrumbs';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import Patients from '../../pages/patients';
import App from '../../pages';
import PatientDetails from '../../pages/patients/[cpr]/questionnaires/[questionnaireId]';

export interface Props {
}
export interface State {
    
}



export class LoadingComponent extends Component<Props,State> {
  static displayName = LoadingComponent.name;

constructor(props : Props){
    super(props);

}

  render () {
    return (
        <Backdrop open={true}>
        <CircularProgress color="primary" />
      </Backdrop>
    )
  }
}
