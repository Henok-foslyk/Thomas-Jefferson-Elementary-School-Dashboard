// EventEditDialog.jsx
import {
  Dialog, TextField, Button, DialogActions, DialogContent,
  DialogContentText, DialogTitle, Container
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";

export default function EventEditDialog({ id, date, event, location, open, onClose, onRefresh }) {
  const [editedEvent, setEditedEvent] = useState(event);
  const [editedLocation, setEditedLocation] = useState(location);
  const [editedDate, setEditedDate] = useState(date);

  useEffect(() => {
    setEditedEvent(event);
    setEditedLocation(location);
    setEditedDate(date);
  }, [event, location, date]);

  const handleSave = async () => {
    try {
      const ref = doc(db, "events", id);
      await updateDoc(ref, {
        "event-name": editedEvent,
        location: editedLocation,
        date: editedDate,
      });
      onClose();
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error("Failed to update event:", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit Event</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Update the event details below.
        </DialogContentText>
        <Container>
          <TextField
            margin="dense"
            label="Event"
            value={editedEvent}
            onChange={(e) => setEditedEvent(e.target.value)}
            fullWidth
            variant="standard"
          />
          <TextField
            margin="dense"
            label="Location"
            value={editedLocation}
            onChange={(e) => setEditedLocation(e.target.value)}
            fullWidth
            variant="standard"
          />
          <TextField
            margin="dense"
            label="Date"
            type="date"
            value={editedDate}
            onChange={(e) => setEditedDate(e.target.value)}
            fullWidth
            variant="standard"
            InputLabelProps={{ shrink: true }}
          />
        </Container>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave}>Save</Button>
      </DialogActions>
    </Dialog>
  );
}
