import { AppBar, Box, Button, CircularProgress, Container, Divider, Drawer, Fab, Grid, IconButton, List, ListItem, ListItemText, ListSubheader, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Toolbar, Typography } from '@material-ui/core';
import Chip from '@mui/material/Chip';
import React, { Component } from 'react';
import Stack from '@mui/material/Stack';
import { Alert, ListItemButton } from '@mui/material';
import { withThemeCreator } from '@material-ui/styles';
import MenuIcon from "@mui/icons-material/Menu"
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd"
import { QuestionnaireResponse } from '../Models/QuestionnaireResponse';
import { IBackendApi } from '../../apis/IBackendApi';
import { CategoryEnum } from '../Models/CategoryEnum';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { MeasurementCollection } from '../Models/MeasurementCollection';
import { MockedBackendApi } from '../../apis/MockedBackendApi';

export interface Props {
    backendApi : IBackendApi
    cpr : string;
}

export interface State {
  loading : boolean
  measurementCollections : Array<MeasurementCollection>
}

export class AnswerTable extends Component<Props,State> {
  static displayName = AnswerTable.name;

constructor(props : Props){
    super(props);
    this.state = {
        loading : true,
        measurementCollections : []
    }
}

  render () {
    let contents = this.state.loading ? <CircularProgress color="inherit" /> : this.renderTableData(this.state.measurementCollections);
    return contents;
  }

  componentDidMount(){
      this.populateQuestionnaireResponses()
  }

  async populateQuestionnaireResponses() {
      let measurements = this.props.backendApi.GetMeasurements(this.props.cpr)
    this.setState({
        loading : false,
        measurementCollections : measurements

    });
}

  renderTableData(measurementCollections : Array<MeasurementCollection>){
        return (<>
            <TableContainer component={Paper}>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>

            {measurementCollections.map(collection => {
                <TableCell>{collection.time.toLocaleString()}</TableCell>
            })}
          </TableRow>
            
        </TableHead>
        <TableBody>
        {measurementCollections.map((collection) => (
                <TableRow>
                  {collection.status}
                </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>

    </>
        )
  }
}
