import { useState } from "react";
import { Button, Container } from "@mui/material";
import { collection, addDoc } from "firebase/firestore";

import { db } from "../../firebase";

import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import "../../styles/Calendar.css";

export default function NewEvent() {
  const [date, setDate] = useState("");
  const [eventName, setEventName] = useState("");
  const [location, setLocation] = useState("");

  const handleAddEvent = async (eventDate, newEventName, eventLocation) => {
    console.log(eventDate);
    try {
      const docRef = await addDoc(collection(db, "events"), {
        date: eventDate,
        "event-name": newEventName,
        location: eventLocation,
      });
      console.log("added doc: ", docRef.id);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <Container className="new-event-container">
        <label>
          {" "}
          Date of Event <span></span>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </label>
        <br></br>
        <label>
          Name of Event <span></span>
          <input type="text" value={eventName} onChange={(e) => setEventName(e.target.value)} />
        </label>
        <br></br>
        <label>
          Location <span></span>
          <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} />
        </label>

        <Button variant="contained" onClick={() => handleAddEvent(date, eventName, location)}>
          <CalendarMonthIcon fontSize="small" sx={{ mr: 1, mb: 0.3 }} /> Add Event
        </Button>
      </Container>
    </>
  );
}
