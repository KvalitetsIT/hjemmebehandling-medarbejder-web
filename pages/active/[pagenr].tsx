import { Box, Typography } from '@mui/material';
import * as React from 'react';
import { LoadingBackdropComponent } from '../../components/Layout/LoadingBackdropComponent';
import ApiContext from '../_context';
import PatientsTable from '../../components/Cards/PatientsTable';

interface State {
    loadingPage: boolean,
}

interface Props {
    match : { params : {pagenr : string} }
}

class ActivePatients extends React.Component<Props,State> {
  static contextType = ApiContext

  constructor(props : Props){
    super(props); 
    this.state = {
      loadingPage : true
    }
}
componentDidMount() : void{
  this.setState({loadingPage : false})
}

  render () : JSX.Element{
        const contents = this.state.loadingPage ? <LoadingBackdropComponent/> : this.renderPage();
        return contents;
    }

    renderPage() : JSX.Element{
      const currentPage = parseInt(this.props.match.params.pagenr);
        return (<>
          <Box paddingBottom={2}>
          <Typography variant="h6">
          Aktive patienter
        </Typography>
        </Box>

        <PatientsTable showActivePatients={true} showInactivePatients={false} pagenumber={currentPage}></PatientsTable>

         
        </>
        )
    }
  }
  export default ActivePatients