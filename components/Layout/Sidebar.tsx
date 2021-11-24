import { Box, Drawer, Fab, List, ListItem, ListItemText, ListSubheader, Toolbar, Typography } from '@material-ui/core';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { CSSProperties } from 'react';

export interface State {
  drawerIsOpen: boolean
}

export class Sidebar extends Component<{},State> {
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

constructor(props : {}){
    super(props);
    this.state = {
        drawerIsOpen : false
    }
}

toogleDrawer = () : void => {
    this.setState({ drawerIsOpen: !this.state.drawerIsOpen });
  };

  render () : JSX.Element{
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
            </ListItem>
            <ListSubheader>Patienter
                </ListSubheader>
                
            
            <ListItem button component={Link} color="inherit" to="/patients">
                <ListItemText>Opgaveliste</ListItemText>
            </ListItem>
            <ListItem button component={Link} color="inherit"  to="/active/1">                
                <ListItemText primary="Aktive patienter" />
            </ListItem>
            <ListItem button component={Link} color="inherit"  to="/inactive/1">                
                <ListItemText primary="Inaktive patienter" />
            </ListItem>
        </List>

        <div style={this.bottomPush}>
          <Fab component={Link} to="/newpatient" variant="extended">
            Opret patient
          </Fab>
        </div>
        </Drawer>


                </>
    );
  }
}
