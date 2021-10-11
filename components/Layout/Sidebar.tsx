import { AppBar, Box, Chip, Container, Divider, Drawer, Fab, Grid, IconButton, List, ListItem, ListItemText, ListSubheader, Paper, Toolbar, Typography } from '@material-ui/core';
import React, { Component } from 'react';
import Stack from '@mui/material/Stack';
import { ListItemButton } from '@mui/material';
import { withThemeCreator } from '@material-ui/styles';
import MenuIcon from "@mui/icons-material/Menu"
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { CSSProperties } from 'react';

export interface Props {
}
export interface State {
  drawerIsOpen: boolean
}

export class Sidebar extends Component<Props,State> {
  static displayName = Sidebar.name;

  style = {
    margin: 0,
    top: 'auto',
    right: 20,
    bottom: 20,
    left: 'auto',
    position: 'fixed',
};

bottomPush : CSSProperties = {
  position: "fixed",
  bottom: 0,
  textAlign: "center",
  paddingBottom: 20,
  marginLeft : 30,
}

constructor(props : Props){
    super(props);
    this.state = {
        drawerIsOpen : false
    }
}

toogleDrawer = () => {
    this.setState({ drawerIsOpen: !this.state.drawerIsOpen });
  };

  render () {
    return (
<>
            
        <Drawer  variant="permanent" anchor="left" elevation={2}>
        <Toolbar >
          <Box paddingBottom={5} paddingTop={5}>
              <Typography variant="h6" align="left">
              Hjemmebehandling
              </Typography>
              <Typography variant="subtitle2" align="left">
              Infektionssygdomme
              </Typography>
          </Box>    
        </Toolbar>
  

        <List>
    
         
                
             
                
             
   
        <ListItem button component={Link} color="inherit" to="/">
        <ListItemText >Home</ListItemText>
            </ListItem>
            <ListSubheader>Patienter
                </ListSubheader>
                
            
            <ListItem button component={Link} color="inherit" to="/patients">
                <ListItemText>Opgaveliste</ListItemText>
            </ListItem>
            <ListItem button>                
                <ListItemText primary="Aktive patienter" />
            </ListItem>
            <ListItem button>                
                <ListItemText primary="Inaktive patienter" />
            </ListItem>
        </List>

        <div style={this.bottomPush}>
          <Fab href="/newpatient" variant="extended">
            Opret patient
          </Fab>
        </div>
        </Drawer>


                </>
    );
  }
}
