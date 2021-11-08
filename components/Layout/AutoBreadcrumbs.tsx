import { Breadcrumbs } from '@material-ui/core';
import React, { Component } from 'react';
import { Link,RouteComponentProps, withRouter } from 'react-router-dom';

export interface State {
    
}

interface Props {
  match : { params : {cpr : string} }
  location : { pathname : string }
}

class AutoBreadcrumbs extends Component<Props & RouteComponentProps> {
  static displayName = AutoBreadcrumbs.name;

  render () {
    let urlSegmentToDisplayName: any = { };

    urlSegmentToDisplayName["patients"] = {displayName: "Patienter"}
    urlSegmentToDisplayName["questionnaires"] = {displayName: "Spørgeskemaer"}
    urlSegmentToDisplayName["careplans"] = {displayName: "Behandlingsplaner"}
    urlSegmentToDisplayName["newpatient"] = {displayName: "Opret patient"}
    urlSegmentToDisplayName["edit"] = {displayName: "Redigér"}


    
    let urlSegments = this.props.location.pathname.split("/")
    console.log(urlSegments);
    let totalUrlIncremental = "";
  return (
    

    <Breadcrumbs aria-label="breadcrumb">
        {urlSegments.slice(1).map(seg => {
            totalUrlIncremental += "/" + seg;
            return (
            <Link color="inherit" to={totalUrlIncremental}>
                {urlSegmentToDisplayName[seg] !== undefined ? urlSegmentToDisplayName[seg].displayName : seg}
            </Link>
            )
        })}
        
    </Breadcrumbs>
    
  )
  }
}

export default withRouter(AutoBreadcrumbs);
