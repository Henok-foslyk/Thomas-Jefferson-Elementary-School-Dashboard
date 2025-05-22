import { React, useState } from 'react';
import Navbar from '../components/Navbar';
import Calendar from '../components/calendar/Calendar';
import EventTable from '../components/calendar/EventTable';
import SearchEvent from '../components/calendar/SearchEvent';
import { Grid, Paper, Box, Typography } from '@mui/material';

function CalendarDashboard() {
    const [search, setSearch] = useState('');

  return (
    <>
      <Navbar />
      <Box sx={{ padding: 1 }}>
        <Grid container justifyContent="center">
            <Typography variant="h5" gutterBottom>Calendar and Events Dashboard</Typography>
        </Grid>
        {/* SEARCH FULL WIDTH */}
        <Grid container justifyContent="center" sx={{ mb: 2 }}>
          <Grid item xs={12}>
            <Paper sx={{ padding: 2 }}>
              <SearchEvent search={search} setSearch={setSearch}/>
            </Paper>
          </Grid>
        </Grid>
        
        {/* EVENT TABLE + CALENDAR SIDE BY SIDE */}
        <Grid container spacing={2} justifyContent="center">
            <Grid item xs={12} md={6}>
                <Paper sx={{ padding: 2 }}>
                    <EventTable search={search}/>
                </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
                <Paper sx={{ padding: 2 }}>
                    <Calendar search={search}/>
                </Paper>
            </Grid>
        </Grid>    
      </Box>
    </>
  );
}

export default CalendarDashboard;
