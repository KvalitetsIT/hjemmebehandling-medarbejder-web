import { AppBar, Box, Chip, Container, Divider, Drawer, Fab, Grid, IconButton, List, ListItem, ListItemText, ListSubheader, Paper, TextField, Toolbar, Typography } from '@material-ui/core';
import React, { Component } from 'react';
import Stack from '@mui/material/Stack';
import { ListItemButton } from '@mui/material';
import { withThemeCreator } from '@material-ui/styles';
import MenuIcon from "@mui/icons-material/Menu"
import { Sidebar } from './Sidebar';

export interface Props {
}
export interface State {
  drawerIsOpen: boolean
}

export class Topbar extends Component<Props,State> {
  static displayName = Topbar.name;



constructor(props : Props){
    super(props);
}

toogleDrawer = () => {
    
  };

  render () {
    return (
        <>
        
        <Box padding={3}>
            <Grid container>
                <Grid item xs={6}>
                <Box paddingLeft={30}><TextField id="outlined-basic" size="small" label="Søg" variant="outlined" /></Box>
                </Grid>
                <Grid item xs={6}>
                <Typography align="right">
                    Susanne Jensen
            </Typography>
            <Typography variant="subtitle2" align="right">
                    Kliniker
            </Typography>
                </Grid>
            </Grid>
            </Box>
        
        </>
    );
  }
}
