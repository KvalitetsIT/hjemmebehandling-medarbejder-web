import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import { Component } from 'react';
import { Box, Card, CardContent, CardHeader, Divider, Grid } from '@mui/material';



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
  onChange?: (index: number) => void
  children?: JSX.Element
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
    this.props.onChange && this.props.onChange(newValue)
  };

  render(): JSX.Element {
    let indexTabPanelCounterContent = 0;
    return (
      <>
        <Card>
          <CardHeader sx={{ padding: 0 }} subheader={
            <Tabs className={this.props.class} value={this.state.value} onChange={this.handleChange}  >
              {this.props.tabLabels.map(tabLabel => {
                return (
                  <Tab sx={{height: "4em"}} label={<Typography className='labelTextTab'>{tabLabel}</Typography>} />
                ) 
              }
              )}
              <>
                {this.props.children}
              </>
            </Tabs>

          }></CardHeader>
          <Divider />
          <CardContent>
            <Grid container >
              <Grid item xs={12}>
                {this.props.tabContent.map(content => {

                  return (
                    <this.renderTabPanel value={this.state.value} index={indexTabPanelCounterContent++}>
                      {content}
                    </this.renderTabPanel>
                  )
                })}
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </>
    );
  }

  renderTabPanel(props: TabPanelProps): JSX.Element {

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





