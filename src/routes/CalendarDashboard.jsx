import { React, useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Calendar from '../components/calendar/Calendar';
import EventTable from '../components/calendar/EventTable';
import SearchEvent from '../components/calendar/SearchEvent';
import { Grid, Paper, Box, Typography } from '@mui/material';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

function CalendarDashboard() {
    const [search, setSearch] = useState('');
    const [events, setEvents] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);

    useEffect(() => {
      const fetchEvents = async () => {
        const snapshot = await getDocs(collection(db, "events"));
        const eventData = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            dateStr: typeof data.date === 'string'
              ? data.date
              : data.date?.toDate?.().toISOString().split("T")[0]
          };
        });
        setEvents(eventData);
      };

      fetchEvents();
    }, []);

    return (
        <>
            <Navbar />
            <Box sx={{ padding: 1 }}>
                <Grid container justifyContent="center">
                    <Typography variant="h5" gutterBottom>Calendar and Events Dashboard</Typography>
                </Grid>
                
                {/* SEARCH FULL WIDTH */}
                <Grid container justifyContent="center" sx={{ mb: 2 }}>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Paper sx={{ padding: 2 }}>
                            <SearchEvent search={search} setSearch={setSearch}/>
                        </Paper>
                    </Grid>
                </Grid>
                
                {/* EVENT TABLE + CALENDAR SIDE BY SIDE */}
                <Grid container spacing={2} justifyContent="center">
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Paper sx={{ padding: 2 }}>
                            <EventTable 
                                search={search} 
                                events={events}
                                selectedDate={selectedDate}
                            />
                        </Paper>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Paper sx={{ padding: 2 }}>
                            <Calendar 
                                dates={events.map(e => e.dateStr)} 
                                onDateSelect={setSelectedDate}
                            />
                        </Paper>
                    </Grid>
                </Grid>    
            </Box>
        </>
    );
}

export default CalendarDashboard;