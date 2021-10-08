import { AppBar, Box, Breadcrumbs, Chip, Container, Divider, Drawer, Fab, Grid, IconButton, Link, List, ListItem, ListItemText, ListSubheader, Paper, Toolbar, Typography } from '@material-ui/core';
import React, { Component } from 'react';
import Stack from '@mui/material/Stack';
import { ListItemButton } from '@mui/material';
import { withThemeCreator } from '@material-ui/styles';
import MenuIcon from "@mui/icons-material/Menu"
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

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
        

       <Sidebar />

        
        <Box paddingLeft={35} paddingRight={5} paddingTop={1}>
        
            <Breadcrumbs aria-label="breadcrumb">
                <Link underline="hover" color="inherit" href="/">
                    MUI
                </Link>
                <Link underline="hover" color="inherit" href="/getting-started/installation/">
                    Core
                </Link>
                <Typography >Breadcrumbs</Typography>
            </Breadcrumbs>
            <Box paddingTop={5} >
            {this.props.children}  
            </Box>
              
            
        </Box>

        </>
    );
  }
}
