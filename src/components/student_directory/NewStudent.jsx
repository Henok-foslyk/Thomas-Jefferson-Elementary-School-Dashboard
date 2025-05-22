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
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../firebase";
import "../../styles/StudentDirectory.css";

export default function NewStudentDirectory({ setStudents }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newStudent, setNewStudent] = useState({
    first: "",
    last: "",
    year: "",
    email: "",
    dateOfBirth: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewStudent((prev) => ({ ...prev, [name]: value }));
  };

  const handleOpen = () => setDialogOpen(true);
  const handleClose = () => setDialogOpen(false);

  // Function to handle adding a new student
  const handleSubmit = async () => {
    // Write to database using auto-ID
    const docRef = await addDoc(collection(db, "students"), {
      first: newStudent.first,
      last: newStudent.last,
      year: Number(newStudent.year),
      email: newStudent.email,
      dateOfBirth: newStudent.dateOfBirth,
      finalGrade: null,
    });

    // Update local state
    setStudents((prev) => [
      ...prev,
      { id: docRef.id, ...newStudent, year: Number(newStudent.year), finalGrade: null },
    ]);

    // Reset form & close dialog
    setNewStudent({ first: "", last: "", year: "", email: "", dateOfBirth: "" });
    handleClose();
  };

  return (
    <Box className="new-student-container">
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
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <Button
                      size="small"
                      onClick={() => {
                        const first = (newStudent.first || "").trim().toLowerCase();
                        const last = (newStudent.last || "").trim().toLowerCase();
                        if (first && last) {
                          setNewStudent((p) => ({ ...p, email: `${first}.${last}@tomjeff.edu` }));
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
            name="dateOfBirth"
            label="Date of Birth"
            type="date"
            value={newStudent.dateOfBirth}
            onChange={handleChange}
            fullWidth
            margin="dense"
            slotProps={{
              label: { shrink: true },
              input: {
                sx: { padding: "23px 0px 0px" },
              },
            }}
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
