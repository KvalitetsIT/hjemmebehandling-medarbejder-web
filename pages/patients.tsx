import { Typography } from '@material-ui/core';
import { Box } from '@mui/system';
import { ErrorBoundary } from '../components/Layout/ErrorBoundary';
import { TaskType } from '../components/Models/TaskType';
import { Tasklist } from '../components/Tables/Tasklist';
function Patients() : JSX.Element{
  
    return (
      <>
      <Box paddingBottom={2}>
          <Typography variant="h6">
              Ulæste besvarelser
          </Typography>
          </Box>  

<ErrorBoundary>
        <Tasklist taskType={TaskType.UNFINISHED_RESPONSE} pageSize={7}/>
        </ErrorBoundary>

      <Box paddingTop={5} paddingBottom={2}>
          <Typography variant="h6">
              Mangler besvarelse
          </Typography>
          </Box>  
          <ErrorBoundary>
      <Tasklist taskType={TaskType.UNANSWERED_QUESTIONNAIRE} pageSize={3}/>
      </ErrorBoundary>
      </>
    );
  }
  
  export default Patients;