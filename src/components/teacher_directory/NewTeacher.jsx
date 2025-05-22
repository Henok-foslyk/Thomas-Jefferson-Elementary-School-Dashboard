import { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
  TextField,
} from "@mui/material";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";

import { collection, addDoc } from "firebase/firestore";
import { db } from "../../firebase";

export default function NewTeacher({ setTeachers }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newTeacher, setNewTeacher] = useState({
    first: "",
    last: "",
    email: "",
    phone: "",
  });

  const [phoneInvalidChars, setPhoneInvalidChars] = useState(false);
  const [phoneInvalidFormat, setPhoneInvalidFormat] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "phone") {
      // Validate only digits and dashes
      const charsValid = /^[0-9-]*$/.test(value);
      setPhoneInvalidChars(!charsValid);

      // Reset format error if the user is typing
      if (phoneInvalidFormat) setPhoneInvalidFormat(false);
    }

    setNewTeacher((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhoneBlur = () => {
    const raw = newTeacher.phone.replace(/-/g, "");

    // if only digits+dash errors exist, skip until chars is valid
    if (phoneInvalidChars) return;

    // If exactly 10 digits, format
    if (/^\d{10}$/.test(raw)) {
      const formatted = raw.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
      setNewTeacher((f) => ({ ...f, phone: formatted }));
      setPhoneInvalidFormat(false);
      return;
    }
    // Already matches US pattern
    if (/^\d{3}-\d{3}-\d{4}$/.test(newTeacher.phone)) {
      setPhoneInvalidFormat(false);
      return;
    }
    // Otherwise invalid
    setPhoneInvalidFormat(true);
  };

  const handleOpen = () => setDialogOpen(true);
  const handleClose = () => setDialogOpen(false);

  // Function to handle adding a new teacher
  const handleSubmit = async () => {
    // Prevent submit if any phone error
    if (phoneInvalidChars || phoneInvalidFormat) return;

    // Write to database using auto-ID
    const docRef = await addDoc(collection(db, "teachers"), {
      first: newTeacher.first,
      last: newTeacher.last,
      class: null,
      email: newTeacher.email,
      phone: newTeacher.phone,
    });

    // Update local state
    setTeachers((prev) => [...prev, { id: docRef.id, ...newTeacher, class: null }]);

    // Reset form & close dialog
    setNewTeacher({ first: "", last: "", email: "", phone: "" });
    setPhoneInvalidChars(false);
    setPhoneInvalidFormat(false);
    handleClose();
  };

  return (
    <Box mb={4} display="flex" justifyContent="flex-end">
      <Button variant="contained" color="primary" onClick={handleOpen}>
        <PersonAddAlt1Icon fontSize="small" sx={{ mr: 1, mb: 0.3 }} />
        Add Teacher
      </Button>

      <Dialog open={dialogOpen} onClose={handleClose}>
        <DialogTitle>Add New Teacher</DialogTitle>
        <DialogContent>
          <TextField
            name="first"
            label="First Name"
            value={newTeacher.first}
            onChange={handleChange}
            fullWidth
            margin="dense"
          />
          <TextField
            name="last"
            label="Last Name"
            value={newTeacher.last}
            onChange={handleChange}
            fullWidth
            margin="dense"
          />
          <TextField
            name="email"
            label="Email"
            value={newTeacher.email}
            onChange={handleChange}
            fullWidth
            margin="dense"
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <Button
                      size="small"
                      onClick={() => {
                        const first = (newTeacher.first || "").trim().toLowerCase();
                        const last = (newTeacher.last || "").trim().toLowerCase();
                        if (first && last) {
                          setNewTeacher((p) => ({ ...p, email: `${first}.${last}@tomjeff.edu` }));
                        }
                      }}
                    >
                      Auto
                    </Button>
                  </InputAdornment>
                ),
              },
            }}
          />
          <TextField
            name="phone"
            label="Phone"
            value={newTeacher.phone}
            onChange={handleChange}
            onBlur={handlePhoneBlur}
            fullWidth
            margin="dense"
            error={phoneInvalidChars || phoneInvalidFormat}
            helperText={
              phoneInvalidChars
                ? "Only digits (0-9) and dashes (-) allowed"
                : phoneInvalidFormat
                ? "Please enter a valid phone number (Ex. XXX-XXX-XXXX)"
                : ""
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
