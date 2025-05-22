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
import { db } from "../../firebase";

export default function NewTeacherDirectory({ setTeachers }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newTeacher, setNewTeacher] = useState({
    first: "",
    last: "",
    email: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewTeacher((prev) => ({ ...prev, [name]: value }));
  };

  const handleOpen = () => setDialogOpen(true);
  const handleClose = () => setDialogOpen(false);

  // Function to handle adding a new teacher
  const handleSubmit = async () => {
    // Write to database using auto-ID
    const docRef = await addDoc(collection(db, "teachers"), {
      first: newTeacher.first,
      last: newTeacher.last,
      class: null,
      email: newTeacher.email,
    });

    // Update local state
    setTeachers((prev) => [...prev, { id: docRef.id, ...newTeacher, class: null }]);

    // Reset form & close dialog
    setNewTeacher({ first: "", last: "", email: "" });
    handleClose();
  };

  return (
    <Box mb={2} display="flex" justifyContent="flex-end">
      <Button variant="contained" color="primary" onClick={handleOpen}>
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
