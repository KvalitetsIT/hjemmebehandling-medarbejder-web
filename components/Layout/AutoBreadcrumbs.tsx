import { AppBar, Box, Breadcrumbs, Chip, Container, Divider, Drawer, Fab, Grid, IconButton, Link, List, ListItem, ListItemText, ListSubheader, Paper, Toolbar, Typography } from '@material-ui/core';
import React, { Component } from 'react';
import Stack from '@mui/material/Stack';
import { ListItemButton } from '@mui/material';
import { withThemeCreator } from '@material-ui/styles';
import MenuIcon from "@mui/icons-material/Menu"
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { useRouter } from 'next/router'
import { getDisplayName } from 'next/dist/shared/lib/utils';

export default function AutoBreadcrumbs() {

    let urlSegmentToDisplayName: any = { };

    urlSegmentToDisplayName["patients"] = {displayName: "Patienter"}


    let router = useRouter();
    let urlSegments = router.pathname.split("/")
    console.log(urlSegments);
    let totalUrlIncremental = "";
  return (
    

    <Breadcrumbs aria-label="breadcrumb">
        {urlSegments.slice(1).map(seg => {
            totalUrlIncremental += "/" + seg;
            return (
            <Link underline="hover" color="inherit" href={totalUrlIncremental}>
                {urlSegmentToDisplayName[seg] != undefined ? urlSegmentToDisplayName[seg].displayName : seg}
            </Link>
            )
        })}
        
    </Breadcrumbs>
    
  )
}

