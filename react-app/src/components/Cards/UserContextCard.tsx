import * as React from 'react';
import { Component } from 'react';
import { IUserService } from '../../services/interfaces/IUserService';
import { User } from '../Models/User';
import { Button, Menu, MenuItem, Typography } from '@mui/material';
import ApiContext, { IApiContext } from '../../pages/_context';
import { LoadingSmallComponent } from '../Layout/LoadingSmallComponent';


export interface Props {
  color?: string;
}

export interface State {
  loadingUserContextButton: boolean;
  user: User;
  expand: boolean
  ancherEl: any
}

export class UserContextCard extends Component<Props, State> {
  static displayName = UserContextCard.name;
  
  static contextType = ApiContext;
 
  
  userService!: IUserService;

  constructor(props: Props) {
    super(props);
     
    this.state = {
      loadingUserContextButton: true,
      user: new User(),
      expand: false,
      ancherEl: null
    }
    
    this.handleClick = this.handleClick.bind(this);
    this.handleClose = this.handleClose.bind(this);

  }

  async componentDidMount(): Promise<void> {
    this.setState({ loadingUserContextButton: true })
    try {
      await this.getUser();
    } catch (error) {
      this.setState(() => { throw error })
    }
    this.setState({ loadingUserContextButton: false })
  }

  InitializeServices(): void {
const api = this.context as IApiContext
    this.userService =   api.userService;
  }

  logout(): void {
    window.location.href = "/oauth2/sign_out";
  }



  async getUser(): Promise<void> {

    const user = await this.userService.GetActiveUser();

    const u = this.state.user;
    u.userId = user.userId ? user.userId : "";
    u.fullName = user.fullName ? user.fullName : "";
    u.orgId = user.orgId ? user.orgId : "";
    u.orgName = user.orgName ? user.orgName : "";
    u.email = user.email ? user.email : "";
    u.entitlements = user.entitlements ? user.entitlements : [];
    u.autorisationsids = user.autorisationsids ? user.autorisationsids : [];
    u.firstName = user.firstName ? user.firstName : "";
    u.lastName = user.lastName ? user.lastName : "";

    this.setState({
      user: u
    })

  }
  handleClick(event: React.MouseEvent<HTMLButtonElement>): void {
    this.setState({ ancherEl: event.currentTarget });
  }

  handleClose(): void {
    this.setState({ ancherEl: null });
  }

  render(): JSX.Element {
    this.InitializeServices();
    const toReturn = this.state.loadingUserContextButton ? <LoadingSmallComponent /> : this.renderCard();
    return (
      <div style={{ display: "flex", justifyContent: "end" }}>
        {toReturn}
      </div>
    )
  }

  renderCard(): JSX.Element {
    return (<>

      <Button
        className="profileButton"
        onClick={this.handleClick}
        variant="text"
        color="inherit"
      >
        <div>
          <Typography className="user__context-name" align="right" variant="body2">{this.state.user.fullName}</Typography>
          <Typography className="user__context-role" align="right" variant="body2">
            {this.state.user.entitlements?.join(", ")}
          </Typography>
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

    </>
    );
  }
}

