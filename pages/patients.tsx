import { Grid, Typography } from '@mui/material';
import { ErrorBoundary } from '../components/Layout/ErrorBoundary';
import { TaskType } from '../components/Models/TaskType';
import { Tasklist } from '../components/Tables/Tasklist';
function Patients() : JSX.Element{
  
    return (
      <>
      <Grid container spacing={3}>
        <Grid item xs={12}>
        <Typography variant="h6">
              Ulæste besvarelser
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <ErrorBoundary>
            <Tasklist taskType={TaskType.UNFINISHED_RESPONSE} pageSize={7}/>
          </ErrorBoundary>
        </Grid>
        <Grid item xs={12}>
        <Typography variant="h6">
              Mangler besvarelse
          </Typography>
        </Grid>
        <Grid item xs={12}>
        <ErrorBoundary>
      <Tasklist taskType={TaskType.UNANSWERED_QUESTIONNAIRE} pageSize={3}/>
      </ErrorBoundary>
        </Grid>
      </Grid>      
      </>
    );
  }
  
  export default Patients;