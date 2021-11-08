import { Box, Grid, Typography } from '@material-ui/core';
import React, { Component } from 'react';
import { SearchPatientInput } from '../Input/SearchPatientInput';

export interface Props {
}
export interface State {
  drawerIsOpen: boolean
}

export class Topbar extends Component<Props,State> {
  static displayName = Topbar.name;

toogleDrawer = () => {
    
  };

  render () {
    return (
        <>
        
        <Box padding={3}>
            <Grid container>
                <Grid item xs={6}>
                <Box paddingLeft={30}>
                  <SearchPatientInput />
                </Box>
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
