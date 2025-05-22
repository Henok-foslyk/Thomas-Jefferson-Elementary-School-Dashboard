import { useEffect, useState } from "react";
import { Grid, Box, Typography, Button } from "@mui/material";
import { getDocs, collection } from "firebase/firestore";
import { db } from "../firebase";
import "../styles/Home.css";
import { Link } from "react-router-dom";

export default function UpcomingEvents() {
  const [events, setEvents] = useState([]);

  // Fetch upcoming events from database
  useEffect(() => {
    (async () => {
      const eventsSnap = await getDocs(collection(db, "events"));
      const now = new Date();

      const parsed = eventsSnap.docs
        .map((d) => ({ id: d.id, ...d.data() }))
        .map((e) => {
          // Parse "YYYY-MM-DD" into a LOCAL midnight Date
          const [y, m, d] = e.date.split("-").map(Number);
          const startOfDay = new Date(y, m - 1, d, 0, 0, 0);

          // Compute the very end of the user's local day
          const endOfDay = new Date(y, m - 1, d + 1, 0, 0, 0);
          return { ...e, startOfDay, endOfDay };
        })

        // Filter out past events and sort by date
        .filter((e) => now < e.endOfDay)
        .sort((a, b) => a.startOfDay - b.startOfDay)
        .slice(0, 6);

      setEvents(parsed);
    })();
  }, []);

  const displayEvents = [
    ...events.filter((_, i) => i % 2 === 0),
    ...events.filter((_, i) => i % 2 === 1),
  ];

  const slots = Array.from({ length: 6 }, (_, i) => displayEvents[i] || null);

  return (
    <Box className="upcoming-container">
      <Typography variant="h5" align="center" gutterBottom>
        Upcoming Events
      </Typography>

      <Grid container spacing={2} justifyContent="center">
        {slots.map((e, idx) => {
          // If no event, render an empty box
          if (!e) {
            return (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={idx}>
                <Box className="upcoming-item blank" />
              </Grid>
            );
          }

          const month = e.startOfDay.toLocaleString("default", { month: "short" }).toUpperCase();
          const day = e.startOfDay.getDate();

          return (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={e.id}>
              <Box className="upcoming-item">
                <Box className="upcoming-date">
                  <Typography variant="subtitle2">{month}</Typography>
                  <Typography variant="h6">{day}</Typography>
                </Box>
                <Box className="upcoming-content">
                  <Typography variant="body1">{e["event-name"]}</Typography>
                  <Typography variant="body2">{e.location}</Typography>
                </Box>
              </Box>
            </Grid>
          );
        })}
      </Grid>

      <Box mt={2} display="flex" justifyContent="center">
        <Link to="/calendar">
          <Button variant="outlined">View All Events</Button>
        </Link>
      </Box>
    </Box>
  );
}
