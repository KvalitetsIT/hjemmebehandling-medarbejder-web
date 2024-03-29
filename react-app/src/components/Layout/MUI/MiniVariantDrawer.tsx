import * as React from 'react';
import { styled, Theme, CSSObject } from '@mui/material/styles';
import MuiDrawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { NavLink, useLocation } from 'react-router-dom';
import { Typography, Tooltip, ListItemButton } from '@mui/material';
import ApiContext from '../../../pages/_context';
import { IUserService } from '../../../services/interfaces/IUserService';
import { ActivePatientsIcon, GroupIcon, InactivePatientsIcon, SurveyIcon, TasklistIcon, AboutIcon } from '../../Icons/Icons';

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
    width: `calc(${theme.spacing(8)} + 1px)`,
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


export default function MiniDrawer(): JSX.Element {
  const [open, setOpen] = React.useState(false);
  const [isAdmin, setIsAdmin] = React.useState(false);
  const { pathname } = useLocation()

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
          <ListItemButton onClick={open ? handleDrawerClose : handleDrawerOpen}>
            <ListItemIcon>
              <img height={30} width={30} src="/assets/images/logo.svg" alt="KOMO" />
            </ListItemIcon>
            <ListItemIcon>
              <img height={30} width={150} src="/assets/images/komo.svg" alt="KOMO" />
            </ListItemIcon>
          </ListItemButton>
          <Divider />

          <ListItem >
            <ListItemIcon>
            </ListItemIcon>
            <ListItemText primary={<Typography variant="h6">Kliniker</Typography>} />
          </ListItem>

          <Tooltip title={'Opgaveliste'} placement='right'>
            <ListItemButton component={NavLink} color="inherit" to="/patients" className={pathname === '/' ? 'active' : ''}>
              <ListItemIcon>
                <TasklistIcon />
              </ListItemIcon>
              <ListItemText>Opgaveliste</ListItemText>
            </ListItemButton>
          </Tooltip>

          <Tooltip title={'Aktive patienter'} placement='right'>
            <ListItemButton component={NavLink} color="inherit" to="/active/1">
              <ListItemIcon>
                <ActivePatientsIcon />
              </ListItemIcon>
              <ListItemText primary="Aktive patienter" />
            </ListItemButton>
          </Tooltip>

          <Tooltip title={'Afsluttede patienter'} placement='right'>
            <ListItemButton component={NavLink} color="inherit" to="/inactive/1">
              <ListItemIcon>
                <InactivePatientsIcon />
              </ListItemIcon>
              <ListItemText primary="Afsluttede patienter" />
            </ListItemButton>
          </Tooltip>


          {isAdmin ?
            <>
              <Divider />

              <ListItem >
                <ListItemIcon>
                </ListItemIcon>
                <ListItemText primary={<Typography variant="h6">Administrator</Typography>} />
              </ListItem>

              <Tooltip title={'Spørgeskema'} placement='right'>
                <ListItemButton component={NavLink} color="inherit" to="/questionnaires">
                  <ListItemIcon>
                    <SurveyIcon />
                  </ListItemIcon>
                  <ListItemText primary="Spørgeskema" />
                </ListItemButton>
              </Tooltip>

              <Tooltip title={'Patientgrupper'} placement='right'>
                <ListItemButton component={NavLink} color="inherit" to="/plandefinitions">
                  <ListItemIcon>
                    <GroupIcon />
                  </ListItemIcon>
                  <ListItemText primary="Patientgrupper" />
                </ListItemButton>
              </Tooltip>
            </> : <></>
          }


        </List>

        <Tooltip title={'Om KOMO'} placement='right'>
          <List className='toButtom'>
            <ListItemButton component={NavLink} color="inherit" to="/about">
              <ListItemIcon>
                <AboutIcon />
              </ListItemIcon>
              <ListItemText primary="Om KOMO" />
            </ListItemButton>
          </List>
        </Tooltip>


      </Drawer>
    </>

  );
}