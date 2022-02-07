import * as React from 'react';
import { styled, Theme, CSSObject } from '@mui/material/styles';
import MuiDrawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { Link } from 'react-router-dom';
import HistoryIcon from '@mui/icons-material/History';
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';
import { CSSProperties } from '@material-ui/core/styles/withStyles';
import AddIcon from '@mui/icons-material/Add';
import { Typography } from '@mui/material';
import GroupsIcon from '@mui/icons-material/Groups';
import QuizIcon from '@mui/icons-material/Quiz';
import ApiContext from '../../../pages/_context';
import { IUserService } from '../../../services/interfaces/IUserService';

const drawerWidth = 270;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(7)} + 1px)`,
  },
});

export const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));


const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);

const bottomPush: CSSProperties = {
  marginTop: "auto",
  marginRight: 5,
  marginLeft: 5
}

const newPatientButton: CSSProperties = {
  backgroundColor: "#1976d2",
  borderRadius: 200,
  color: "white"
}


export default function MiniDrawer(): JSX.Element {
  const [open, setOpen] = React.useState(false);
  const [isAdmin, setIsAdmin] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };
  
  const things = React.useContext(ApiContext)
  const userService: IUserService = things.userService;

  React.useEffect(() => {
    async function fetchData() {
      const user = await userService.GetActiveUser();
      setIsAdmin(user.isAdmin())    
    };

    fetchData();

  });

  return (
    <>

      <Drawer variant="permanent" open={open}>
        <List >
          <ListItem button onClick={open ? handleDrawerClose : handleDrawerOpen}>
            <ListItemIcon>
              <img width={30} src="/assets/images/logo.svg" alt="Hjemmebehandling" />
            </ListItemIcon>
            <ListItemText style={{ fontWeight: "bold", paddingTop: 20, paddingBottom: 20 }} primary="Hjemmebehandling" secondary="Infektionssygdomme" />
          </ListItem>


          <Divider />

          <ListItem >
            <ListItemIcon>
            </ListItemIcon>
            <ListItemText primary={<Typography variant="h6">Kliniker</Typography>} />
          </ListItem>

          <ListItem button component={Link} color="inherit" to="/patients">
            <ListItemIcon>
              <AssignmentIcon />
            </ListItemIcon>
            <ListItemText>Opgaveliste</ListItemText>
          </ListItem>

          <ListItem button component={Link} color="inherit" to="/active/1">
            <ListItemIcon>
              <SupervisedUserCircleIcon />
            </ListItemIcon>
            <ListItemText primary="Aktive patienter" />
          </ListItem>

          <ListItem button component={Link} color="inherit" to="/inactive/1">
            <ListItemIcon>
              <HistoryIcon />
            </ListItemIcon>
            <ListItemText primary="Inaktive patienter" />
          </ListItem>


          {isAdmin ?
            <>
              <Divider />

              <ListItem >
                <ListItemIcon>
                </ListItemIcon>
                <ListItemText primary={<Typography variant="h6">Adminstrator</Typography>} />
              </ListItem>

              <ListItem button component={Link} color="inherit" to="/questionnaires">
                <ListItemIcon>
                  <QuizIcon />
                </ListItemIcon>
                <ListItemText primary="Spørgeskema" />
              </ListItem>

              <ListItem button component={Link} color="inherit" to="/plandefinitions">
                <ListItemIcon>
                  <GroupsIcon />
                </ListItemIcon>
                <ListItemText primary="Patientgrupper" />
              </ListItem>
            </> : <></>
          }


        </List>

        <List style={bottomPush}>
          <ListItem style={newPatientButton} button component={Link} color="inherit" to="/newpatient">
            <ListItemIcon>
              <AddIcon fontSize="medium" style={{ color: "white", marginLeft: -5 }} />
            </ListItemIcon>
            <ListItemText primary="Opret patient" />

          </ListItem>
        </List>


      </Drawer>
    </>

  );
}