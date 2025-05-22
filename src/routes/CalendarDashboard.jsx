import React from 'react'

import Navbar from '../components/Navbar'
import Calendar from '../components/calendar/Calendar';
import EventTable from '../components/calendar/EventTable';
import SearchEvent from '../components/calendar/SearchEvent';
import NewEvent from '../components/calendar/NewEvent';
import { Grid, Paper, Box, styled } from '@mui/material';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: (theme.vars ?? theme).palette.text.secondary,
  ...theme.applyStyles('dark', {
    backgroundColor: '#1A2027',
  }),
}));

function CalendarDashboard() {
        

    
    return (
        <>
            <Navbar />
            <Box>
                <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                    <Grid size={6}>
                        <Item><SearchEvent /></Item>
                        <Item><EventTable /></Item>
                    </Grid>
                    <Grid size={6}>
                        <Item><Calendar /></Item>
                        <Item><NewEvent /></Item>
                    </Grid>
                    
                    <Grid size={6}>
                        
                    </Grid>
                </Grid>
            </Box>
        </>
    );
}

export default CalendarDashboard