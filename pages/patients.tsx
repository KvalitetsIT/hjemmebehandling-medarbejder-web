import { Grid, Typography } from '@mui/material';
import { ErrorBoundary } from '@kvalitetsit/hjemmebehandling/Errorhandling/ErrorBoundary'
import { TaskType } from '@kvalitetsit/hjemmebehandling/Models/TaskType';
import { Tasklist } from '../components/Tables/Tasklist';
function Patients() : JSX.Element{
  
    return (
      <>
      <Grid container spacing={3}>
        <Grid className="grid__headline" item xs={12}>
        <Typography variant="h6">
              Ulæste besvarelser
          </Typography>
        </Grid>
        <Grid className="grid__table" item xs={12}>
          <ErrorBoundary>
            <Tasklist taskType={TaskType.UNFINISHED_RESPONSE} pageSize={6}/>
          </ErrorBoundary>
        </Grid>
        <Grid className="grid__headline" item xs={12}>
        <Typography variant="h6">
              Mangler besvarelse
          </Typography>
        </Grid>
        <Grid className="grid__table" item xs={12}>
        <ErrorBoundary>
      <Tasklist taskType={TaskType.UNANSWERED_QUESTIONNAIRE} pageSize={3}/>
      </ErrorBoundary>
        </Grid>
      </Grid>      
      </>
    );
  }
  
  export default Patients;