import { Typography } from '@material-ui/core';
import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Component } from 'react';
import Stack from '@mui/material/Stack';
import IUserService from '../../services/interfaces/IUserService';
import { User } from '../Models/User';
import UserService from '../../services/UserService';
import { FakeItToYouMakeItApi } from '../../apis/FakeItToYouMakeItApi';
import { Button } from '@mui/material';


export interface Props {
    color? : string;
}

export interface State {
    loadingUserContextButton : boolean;
    user: User;
}

export class UserContextCard extends Component<Props,State> {
  static displayName = UserContextCard.name;
  userService!: IUserService;

  constructor(props : Props){
      super(props);
      this.state = {
	      loadingUserContextButton : false,
	      user: new User()
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
        <Card component={Box} minWidth={200} maxWidth={200} >
         <CardContent >
               <Stack spacing={3} alignContent="right">
                    <Stack backgroud-color="blue" spacing={1} alignContent="right">
                    <Typography align="right" variant="body2">{this.state.user.fullName}</Typography>
                    <Typography align="right" variant="caption">{this.state.user.userId}</Typography>
                    <Button>Logout</Button>
                    </Stack>
               </Stack>
            </CardContent>
        </Card></>
    );
  }
}
