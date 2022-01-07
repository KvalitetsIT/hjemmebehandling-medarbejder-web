import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Component } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, Divider, Grid } from '@mui/material';

export interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

export interface BasicTabsProps {
  idOfStartTab?: string;
  tabLabels: string[]
  tabIds: string[]
  tabContent: JSX.Element[]
  class: string
  linkToId: boolean
}
export interface BasicTabsState {
  value: number
}

export class BasicTabs extends Component<BasicTabsProps, BasicTabsState> {
  static displayName = BasicTabs.name;
  static defaultProps = {
    linkToId: true
  }

  constructor(props: BasicTabsProps) {
    super(props);
    const startTabIndex = props.idOfStartTab !== undefined ? props.tabIds.indexOf(props.idOfStartTab) : 0;
    this.state = {
      value: startTabIndex
    }
  }

  handleChange = (event: React.SyntheticEvent, newValue: number): void => {
    this.setState({ value: newValue })
  };

  render(): JSX.Element {
    let indexTabPanelCounterLabel = 0;
    let indexTabPanelCounterContent = 0;
    return (
      <>
        <Card>

          <CardHeader sx={{ paddingTop: 0, paddingBottom: 0 }} title={
            <Tabs className={this.props.class} value={this.state.value} onChange={this.handleChange} aria-label="basic tabs example" TabIndicatorProps={{ style: { display: "none" }, }}>
              <Grid container>
                <Grid item xs={11}>
                  {this.props.tabLabels.map(tabLabel => {
                    return (
                      <>
                        {this.props.linkToId ?
                          <Tab component={Link} to={this.props.tabIds[indexTabPanelCounterLabel++]} label={<Typography className='labelTextTab'>{tabLabel}</Typography>} /> :
                          <Tab label={<Typography className='labelTextTab'>{tabLabel}</Typography>} />
                        }
                      </>
                    )
                  })}
                </Grid>
              </Grid>
              {this.props.children}

            </Tabs>

          } />
          <Divider />
          <CardContent>
            <Grid container >
              <Grid item xs={12}>
                {this.props.tabContent.map(content => {

                  return (
                    <this.TabPanel value={this.state.value} index={indexTabPanelCounterContent++}>
                      {content}
                    </this.TabPanel>
                  )
                })}
              </Grid>
            </Grid>
          </CardContent>

        </Card>
      </>
    );
  }


  TabPanel(props: TabPanelProps): JSX.Element {

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