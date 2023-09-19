import { Box, Typography } from '@mui/material';
import * as React from 'react';
import { LoadingBackdropComponent } from '../../components/Layout/LoadingBackdropComponent';
import ApiContext from '../_context';
import PatientsTable from '../../components/Cards/PatientsTable';
import { useState } from 'react';

interface Props {
  match: { params: { pagenr: string } }
}

const InactivePatients = (props: Props) => {


  let loading = useState(true)
  loading = useState(false);

  return loading ? <LoadingBackdropComponent /> :
    (<>
      <Box paddingBottom={2}>
        <Typography variant="h6">
          Afsluttede patienter
        </Typography>
      </Box>
      <PatientsTable showActivePatients={false} ></PatientsTable>
    </>)


}
export default InactivePatients