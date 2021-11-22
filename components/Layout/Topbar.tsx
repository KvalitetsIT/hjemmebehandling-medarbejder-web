import { Box, Grid } from '@material-ui/core';
import React, { Component } from 'react';
import { SearchPatientInput } from '../Input/SearchPatientInput';
import { UserContextCard } from '../Cards/UserContextCard';
export interface State {
  drawerIsOpen: boolean
}

export class Topbar extends Component<{},State> {
  static displayName = Topbar.name;


  render () : JSX.Element {
    return (
        <>
    <Grid justify="space-between" container>
      <Grid item >
         <Box paddingLeft={30}>
            <SearchPatientInput />
         </Box>
      </Grid>
      <Grid>
        <Box paddingRight={5} >
            <UserContextCard />
        </Box>
      </Grid>
    </Grid>

        </>
    );
  }
}
