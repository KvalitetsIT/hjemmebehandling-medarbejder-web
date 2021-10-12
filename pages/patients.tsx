import { Typography } from '@material-ui/core';
import { Box } from '@mui/system';
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

        <Tasklist pageSize={7} categories={[CategoryEnum.RED,CategoryEnum.YELLOW, CategoryEnum.GREEN]}/>   
       

      <Box paddingTop={5} paddingBottom={2}>
          <Typography variant="h6">
              Mangler besvarelse
          </Typography>
          </Box>   
      <Tasklist pageSize={3} categories={[CategoryEnum.BLUE]}/>      
      
      </>
    );
  }
  
  export default Patients;