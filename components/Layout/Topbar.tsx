import { Box, Grid } from '@material-ui/core';
import { Typography, Stack, Button, Divider} from '@mui/material';
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';

import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { SearchPatientInput } from '../Input/SearchPatientInput';
import { UserContextCard } from '../Cards/UserContextCard';
import { ErrorBoundary } from '@kvalitetsit/hjemmebehandling/Errorhandling/ErrorBoundary'
export interface State {
  drawerIsOpen: boolean
}

export class Topbar extends Component<{}, State> {
  static displayName = Topbar.name;


  render(): JSX.Element {
    return (
      <>

        <Grid component={Box} paddingRight={2} paddingBottom={3} container>
          <Grid item xs={2}>

            <ErrorBoundary>
              <SearchPatientInput />
            </ErrorBoundary>


          </Grid>

          <Grid item xs={2}>
            <Stack direction="row"
              justifyContent="flex-start"
              alignItems="center"
              spacing={1}
              sx={{height: '100%'}}
            >
              <Divider orientation='vertical' sx={{backgroundColor: '#5D74AC', pl: 0.25, ml: 3, mr:2, height: '75%'}} />
              <Button component={Link} to={"/newpatient"} startIcon={<AddCircleRoundedIcon fontSize="large" sx={{ color: '#5D74AC', width:'35px', height: '35px' }} />} >
                <Typography variant="h6" sx={{ color: '#5D74AC' }}>Opret patient</Typography>
              </Button>
            </Stack>
          </Grid>

          <Grid item xs>
            
              <UserContextCard />
            
          </Grid>
        </Grid>

      </>
    );
  }
}
