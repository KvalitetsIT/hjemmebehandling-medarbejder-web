import React, { Component } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { Box } from '@mui/system';

export class LoadingSmallComponent extends Component<{},{}> {
  static displayName = LoadingSmallComponent.name;

  render () : JSX.Element{
    return (
      <Box padding={5}>
        <CircularProgress color="primary" />
      </Box>
        
    )
  }
}
