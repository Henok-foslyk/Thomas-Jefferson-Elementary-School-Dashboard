import { useEffect, useState } from "react";
import { Container, Typography, Grid, Paper, Button, Box } from "@mui/material";
import { collection, getDocs } from "firebase/firestore";
import { Link } from "react-router-dom";
import { db } from "../firebase";

import UpcomingEvents from "../components/UpcomingEvents.jsx";
import "../styles/Home.css";

export default function Home() {
  const [counts, setCounts] = useState({
    students: 0,
    teachers: 0,
    classes: 0,
    events: 0,
  });

  // Fetch counts of students, teachers, classes, and events from database
  useEffect(() => {
    async function fetchCounts() {
      const [studSnap, teachSnap, classSnap, eventSnap] = await Promise.all([
        getDocs(collection(db, "students")),
        getDocs(collection(db, "teachers")),
        getDocs(collection(db, "classes")),
        getDocs(collection(db, "events")),
      ]);

      setCounts({
        students: studSnap.size,
        teachers: teachSnap.size,
        classes: classSnap.size,
        events: eventSnap.size,
      });
    }
    fetchCounts();
  }, []);

  return (
    <Container maxWidth="lg" className="home-container" disableGutters>
      <Box className="home-header">
        <Typography variant="h4" gutterBottom>
          Welcome to the Thomas Jefferson Elementary Dashboard
        </Typography>
        <Typography variant="subtitle1">Bringing our school into the digital age.</Typography>
      </Box>

      <Grid container spacing={2} className="home-summary">
        {[
          { label: "Total Students", value: counts.students },
          { label: "Total Teachers", value: counts.teachers },
          { label: "Active Classes", value: counts.classes },
          { label: " Total Upcoming Events", value: counts.events },
        ].map(({ label, value }) => (
          <Grid key={label}>
            <Paper className="home-card" elevation={4}>
              <Typography variant="h5">{value}</Typography>
              <Typography variant="body2">{label}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={2} className="home-button-grid">
        <Grid>
          <Link to="/students">
            <Button variant="outlined" fullWidth>
              Manage Students
            </Button>
          </Link>
        </Grid>
        <Grid>
          <Link to="/teachers">
            <Button variant="outlined" fullWidth>
              Manage Teachers
            </Button>
          </Link>
        </Grid>
        <Grid>
          <Link to="/classes">
            <Button variant="outlined" fullWidth>
              View All Classes
            </Button>
          </Link>
        </Grid>
      </Grid>

      <UpcomingEvents />
    </Container>
  );
}
