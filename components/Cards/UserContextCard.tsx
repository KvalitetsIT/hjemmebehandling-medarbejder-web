import { Typography } from '@material-ui/core';
import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Component } from 'react';
import IUserService from '../../services/interfaces/IUserService';
import { User } from '../Models/User';
import UserService from '../../services/UserService';
import { FakeItToYouMakeItApi } from '../../apis/FakeItToYouMakeItApi';
import { Button, CardActionArea, CardActions, Collapse } from '@mui/material';


export interface Props {
    color? : string;
}

export interface State {
    loadingUserContextButton : boolean;
    user: User;
    expand: boolean
}

export class UserContextCard extends Component<Props,State> {
  static displayName = UserContextCard.name;
  userService!: IUserService;

  constructor(props : Props){
      super(props);
      this.state = {
	      loadingUserContextButton : false,
	      user: new User(),
	      expand: false
      }

  }

  componentWillMount() :void {
      this.InitializeServices();
      this.getUser();
  }

  InitializeServices() : void{
    //how can we load this from context 
	this.userService  = new UserService(new FakeItToYouMakeItApi());
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

  render ()  : JSX.Element{

    return (<>
        <Card component={Box} minWidth={200} maxWidth={250} align-items= "right" style={{backgroundColor: "#f8f8f8"}}>
        <CardActionArea onClick={()=>this.setState({ expand:!this.state.expand})} align-items= "right">
          <CardContent >
                    <Typography align="right" variant="body2">{this.state.user.fullName} ({this.state.user.userId})</Typography>
          </CardContent>
         </CardActionArea>
         <Collapse in={this.state.expand}>
              <CardContent >
                    <Typography align="right" variant="body2">{this.state.user.orgId}</Typography>
              </CardContent>
              <CardActions>
                <Button style={{ width: '100%', color: 'red' }}>
                logud
                </Button>
              </CardActions>
            </Collapse>
        </Card></>
    );
  }
}
