import { AppBar, Box, Breadcrumbs, Chip, Container, Divider, Drawer, Fab, Grid, IconButton, List, ListItem, ListItemText, ListSubheader, Paper, Toolbar, Typography } from '@material-ui/core';
import React, { Component } from 'react';
import Stack from '@mui/material/Stack';
import { ListItemButton } from '@mui/material';
import { withThemeCreator } from '@material-ui/styles';
import MenuIcon from "@mui/icons-material/Menu"
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { useRouter } from 'next/router'
import { getDisplayName } from 'next/dist/shared/lib/utils';
import { Link,RouteComponentProps, withRouter } from 'react-router-dom';

export interface State {
    
}

interface Props {
  match : { params : {cpr : string} }
  location : { pathname : string }
}

class AutoBreadcrumbs extends Component<Props & RouteComponentProps> {
  static displayName = AutoBreadcrumbs.name;

  render () {
    let urlSegmentToDisplayName: any = { };

    urlSegmentToDisplayName["patients"] = {displayName: "Patienter"}
    urlSegmentToDisplayName["questionnaires"] = {displayName: "Spørgeskemaer"}
    urlSegmentToDisplayName["careplans"] = {displayName: "Behandlingsplaner"}

    
    let urlSegments = this.props.location.pathname.split("/")
    console.log(urlSegments);
    let totalUrlIncremental = "";
  return (
    

    <Breadcrumbs aria-label="breadcrumb">
        {urlSegments.slice(1).map(seg => {
            totalUrlIncremental += "/" + seg;
            return (
            <Link color="inherit" to={totalUrlIncremental}>
                {urlSegmentToDisplayName[seg] != undefined ? urlSegmentToDisplayName[seg].displayName : seg}
            </Link>
            )
        })}
        
    </Breadcrumbs>
    
  )
  }
}

export default withRouter(AutoBreadcrumbs);
