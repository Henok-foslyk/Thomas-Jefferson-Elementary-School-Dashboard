import { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";

export default function NewStudent({ onAdd }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newStudent, setNewStudent] = useState({
    first: "",
    last: "",
    year: "",
    email: "",
    enrollmentYear: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewStudent((prev) => ({ ...prev, [name]: value }));
  };

  const handleOpen = () => setDialogOpen(true);
  const handleClose = () => setDialogOpen(false);

  const handleSubmit = async () => {
    // Create Firestore document
    const docRef = await addDoc(collection(db, "students"), {
      first: newStudent.first,
      last: newStudent.last,
      year: Number(newStudent.year),
      email: newStudent.email,
      enrollmentYear: String(newStudent.enrollmentYear),
      gpa: null,
    });
    // Build new student object
    const newStudent = {
      id: docRef.id,
      first: newStudent.first,
      last: newStudent.last,
      year: Number(newStudent.year),
      email: newStudent.email,
      enrollmentYear: String(newStudent.enrollmentYear),
      gpa: null,
    };

    onAdd(newStudent);

    // Reset form & close dialog
    setNewStudent({ first: "", last: "", year: "", email: "", enrollmentYear: "" });
    handleClose();
  };

  return (
    <Box mb={2} display="flex" justifyContent="flex-end">
      <Button variant="contained" color="primary" onClick={handleOpen}>
        Add Student
      </Button>

      <Dialog open={dialogOpen} onClose={handleClose}>
        <DialogTitle>Add New Student</DialogTitle>
        <DialogContent>
          <TextField
            name="first"
            label="First Name"
            value={newStudent.first}
            onChange={handleChange}
            fullWidth
            margin="dense"
          />
          <TextField
            name="last"
            label="Last Name"
            value={newStudent.last}
            onChange={handleChange}
            fullWidth
            margin="dense"
          />
          <TextField
            name="year"
            label="Year (0 for K)"
            type="number"
            value={newStudent.year}
            onChange={handleChange}
            fullWidth
            margin="dense"
          />
          <TextField
            name="email"
            label="Email"
            value={newStudent.email}
            onChange={handleChange}
            fullWidth
            margin="dense"
          />
          <TextField
            name="enrollmentYear"
            label="Enrollment Year"
            type="number"
            value={newStudent.enrollmentYear}
            onChange={handleChange}
            fullWidth
            margin="dense"
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
