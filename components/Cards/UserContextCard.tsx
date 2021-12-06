import { Typography } from '@material-ui/core';
import * as React from 'react';
import { Component } from 'react';
import IUserService from '../../services/interfaces/IUserService';
import { User } from '../Models/User';
import { Button, Menu, MenuItem } from '@mui/material';
import ApiContext from '../../pages/_context';


export interface Props {
    color? : string;
}

export interface State {
    loadingUserContextButton : boolean;
    user: User;
    expand: boolean
    ancherEl : any
}

export class UserContextCard extends Component<Props,State> {
  static displayName = UserContextCard.name;
  static contextType = ApiContext;
  userService!: IUserService;

  constructor(props : Props){
      super(props);
      this.state = {
	      loadingUserContextButton : false,
	      user: new User(),
	      expand: false,
        ancherEl : null
      }

      this.handleClick = this.handleClick.bind(this);
      this.handleClose = this.handleClose.bind(this);

  }

  componentWillMount() :void {
      this.InitializeServices();
      this.getUser();
  }

  InitializeServices() : void{
	 this.userService = this.context.userService;
  }
  
  logout() :void {
 	 window.location.href = "/oauth2/sign_out";
  }
  
  

async getUser() : Promise<void>{
  try{
    this.setState({
      loadingUserContextButton: true
    })
    
    const user = await this.userService.GetUser();
    
    const u = this.state.user;
    u.userId = user.userId ?user.userId:"";
    u.fullName = user.fullName ?user.fullName:"";
    u.orgId = user.orgId ?user.orgId:"";
    u.orgName = user.orgName ?user.orgName:"";
    u.email = user.email ?user.email:"";
    u.entitlements = user.entitlements ?user.entitlements:[];
    u.autorisationsids = user.autorisationsids ?user.autorisationsids:[];
    u.firstName = user.firstName ?user.firstName:"";
    u.lastName = user.lastName ?user.lastName:"";
    
    this.setState({
      user: u
    })
    
    this.setState({
      loadingUserContextButton: false
    })
    
  } catch(error){
	this.setState({
    loadingUserContextButton: false
    })
    throw error;
  }
  
}
handleClick(event: React.MouseEvent<HTMLButtonElement>) : void {
  this.setState({ancherEl : event.currentTarget});
};

handleClose() : void {
  this.setState({ancherEl : null});
};

  render ()  : JSX.Element{

    return (<>
         <div>
          <Button
            className="profileButton"
            id="basic-button"
            aria-controls="basic-menu"
            aria-haspopup="true"
            onClick={this.handleClick}
            variant="text"
            color="inherit"
          >
            <div>
             <Typography align="right" variant="body2">{this.state.user.fullName} ({this.state.user.userId})</Typography>
             <Typography align="right" variant="body2">{this.state.user.email}</Typography>
             </div>
          </Button>
          <Menu
            anchorEl={this.state.ancherEl}
            id="basic-menu"
            open={this.state.ancherEl}
            onClose={this.handleClose}
            MenuListProps={{
              'aria-labelledby': 'basic-button',
            }}
          >
            <MenuItem disabled>
              <Typography align="right" variant="body2">{this.state.user.orgName}</Typography>
            </MenuItem>
            <MenuItem onClick={this.logout}>Log ud</MenuItem>
          </Menu>
        </div>
    
        </>
    );
  }
}

