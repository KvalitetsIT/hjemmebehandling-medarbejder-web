import React, { Component } from 'react';
import { Backdrop } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';

export class LoadingBackdropComponent extends Component<{},{}> {
  static displayName = LoadingBackdropComponent.name;

  render () : JSX.Element{
    return (
        <Backdrop open={true}>
        <CircularProgress color="primary" />
      </Backdrop>
    )
  }
}
