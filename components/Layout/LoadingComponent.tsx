import React, { Component } from 'react';
import { Backdrop } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';

export interface Props {
}
export interface State {
    
}



export class LoadingComponent extends Component<Props,State> {
  static displayName = LoadingComponent.name;

  render () {
    return (
        <Backdrop open={true}>
        <CircularProgress color="primary" />
      </Backdrop>
    )
  }
}
