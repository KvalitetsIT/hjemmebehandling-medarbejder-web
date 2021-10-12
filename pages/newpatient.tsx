import { Typography } from '@material-ui/core';
import { Box } from '@mui/system';
import { MockedBackendApi } from '../apis/MockedBackendApi';
import { CategoryEnum } from '../components/Models/CategoryEnum';
import { Tasklist } from '../components/Tables/Tasklist';
function Patients() {
  
    return (
      <>
      <Box paddingBottom={2}>
          <Typography variant="h6">
              Ulæste besvarelser
          </Typography>
          </Box>  

      
      </>
    );
  }
  
  export default Patients;