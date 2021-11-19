import React, { Component } from 'react';
import CircularProgress from '@mui/material/CircularProgress';

export class LoadingSmallComponent extends Component<{},{}> {
  static displayName = LoadingSmallComponent.name;

  render () : JSX.Element{
    return (
        <CircularProgress color="primary" />
    )
  }
}
