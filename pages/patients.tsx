import { Typography } from '@material-ui/core';
import { Box } from '@mui/system';
import { CategoryEnum } from '../components/Models/CategoryEnum';
import { TaskType } from '../components/Models/TaskType';
import { Tasklist } from '../components/Tables/Tasklist';
function Patients() {
  
    return (
      <>
      <Box paddingBottom={2}>
          <Typography variant="h6">
              Ulæste besvarelser
          </Typography>
          </Box>  

        <Tasklist taskType={TaskType.UNFINISHED_RESPONSE} pageSize={7}/>
       

      <Box paddingTop={5} paddingBottom={2}>
          <Typography variant="h6">
              Mangler besvarelse
          </Typography>
          </Box>   
      <Tasklist taskType={TaskType.UNANSWERED_QUESTIONNAIRE} pageSize={3}/>
      
      </>
    );
  }
  
  export default Patients;