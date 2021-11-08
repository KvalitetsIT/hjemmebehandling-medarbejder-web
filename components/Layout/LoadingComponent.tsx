import React, { Component } from 'react';
import { Backdrop } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';

export class LoadingComponent extends Component<{},{}> {
  static displayName = LoadingComponent.name;

  render () : JSX.Element{
    return (
        <Backdrop open={true}>
        <CircularProgress color="primary" />
      </Backdrop>
    )
  }
}
