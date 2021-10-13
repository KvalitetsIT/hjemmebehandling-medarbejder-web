import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Component } from 'react';

export interface TabPanelProps {
    children?: React.ReactNode;
  index: number;
  value: number;
}

export interface BasicTabsProps {
    tabLabels : string[]
    tabContent : JSX.Element[]
}
export interface BasicTabsState {
    value : number
}

export class BasicTabs extends Component<BasicTabsProps,BasicTabsState> {
  static displayName = BasicTabs.name;

constructor(props : BasicTabsProps){
    super(props);
    this.state = {
        value : 0
    }
}

  handleChange = (event: React.SyntheticEvent, newValue: number) => {
    this.setState({value : newValue})
  };

  render () {
        let indexTabPanelCounter = 0;
        return (
            <>
                    <Tabs value={this.state.value} onChange={this.handleChange} aria-label="basic tabs example">
                        {this.props.tabLabels.map(tabLabel => {
                            return (
                                <Tab label={tabLabel}  />
                            )
                        })}
                    </Tabs>
            
                    {this.props.tabContent.map(content => {
                            
                            return (
                                <this.TabPanel  value={this.state.value} index={indexTabPanelCounter++}>
                                {content}
                              </this.TabPanel>
                            )
                        })}
            </>
              );
  }


  TabPanel(props: TabPanelProps) {
  
    return (
      <div
        role="tabpanel"
        hidden={props.value !== props.index}
        id={`simple-tabpanel-${props.index}`}
        aria-labelledby={`simple-tab-${props.index}`}
      >
        {props.value === props.index && (
          <Box sx={{ p: 3 }}>
            <Typography>{props.children}</Typography>
          </Box>
        )}
      </div>
    );
  }

}