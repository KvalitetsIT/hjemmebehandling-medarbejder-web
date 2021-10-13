import { AppBar, Box, Button, CircularProgress, Container, Divider, Drawer, Fab, FormControl, Grid, IconButton, InputLabel, List, ListItem, ListItemText, ListSubheader, MenuItem, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Toolbar, Typography } from '@material-ui/core';
import Chip from '@mui/material/Chip';
import React, { Component, useContext } from 'react';
import Stack from '@mui/material/Stack';
import { Alert, ListItemButton, SelectChangeEvent, Skeleton } from '@mui/material';
import { withThemeCreator } from '@material-ui/styles';
import MenuIcon from "@mui/icons-material/Menu"
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd"
import { QuestionnaireResponse } from '../Models/QuestionnaireResponse';
import { IBackendApi } from '../../apis/IBackendApi';
import { CategoryEnum } from '../Models/CategoryEnum';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { MeasurementCollectionStatus, MeasurementType } from '../Models/QuestionnaireResponse';
import { MeasurementCollectionStatusSelect } from '../Input/MeasurementCollectionStatusSelect';
import ApiContext from '../../pages/_context';

export interface Props {
    cpr : string;
    typesToShow : MeasurementType[]
}

export interface State {
  loading : boolean
  measurementCollections : Array<QuestionnaireResponse>
}

export class AnswerTable extends Component<Props,State> {
  static displayName = AnswerTable.name;
  static contextType = ApiContext

constructor(props : Props){
    super(props);
    this.state = {
        loading : true,
        measurementCollections : []
    }
}

  render () {
    let contents = this.state.loading ? <Skeleton variant="rectangular" height={400} /> : this.renderTableData(this.state.measurementCollections);
    return contents;
  }

  componentDidMount(){
      this.populateQuestionnaireResponses()
  }


  async populateQuestionnaireResponses() {
      let measurements = await this.context.backendApi.GetMeasurements(this.props.cpr)
    this.setState({
        loading : false,
        measurementCollections : measurements
    });
}

  renderTableData(questionaireResponses : Array<QuestionnaireResponse>){

        

        return (<>
            <TableContainer component={Paper}>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
          <TableCell>MÅLINGER</TableCell>
            {questionaireResponses.map(collection => {
                return (
                    <TableCell>{collection.answeredTime.toDateString()}</TableCell>
                )
                
            })}
          </TableRow>
            
        </TableHead>
        <TableBody>

                    
                    {this.props.typesToShow.map(type =>{
                        return (
                            <TableRow>
                                <TableCell>{type}</TableCell>
                                {questionaireResponses.map(collection => {
                                    let measurement = collection.measurements.get(type);
                                    return (
                                        <TableCell>{measurement ? measurement.value : "N/A"} {measurement ? measurement.unit : "N/A"}</TableCell>
                                    )
                                })}
                            </TableRow>
                        )
                    })}

    
<TableRow>
<TableCell></TableCell>
            {questionaireResponses.map(collection => {
                return (
                    
                    <TableCell>
                        <MeasurementCollectionStatusSelect measurementCollection={collection} />
                    </TableCell>
                )
                
            })}
             </TableRow>         


                    

            
        </TableBody>
      </Table>
    </TableContainer>

    </>
        )
  }
}
