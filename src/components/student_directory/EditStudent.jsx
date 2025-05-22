import { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
  TextField,
} from "@mui/material";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import "../../styles/StudentDirectory.css";

export default function EditStudent({ student, onClose, setStudents }) {
  const [editStudent, setEditStudent] = useState({
    first: "",
    last: "",
    year: "",
    email: "",
    dateOfBirth: "",
  });

  // Set initial form values when student prop changes
  useEffect(() => {
    if (student) {
      setEditStudent({
        first: student.first ?? "",
        last: student.last ?? "",
        year: student.year ?? "",
        email: student.email ?? "",
        dateOfBirth: student.dateOfBirth ?? "",
      });
    }
  }, [student]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditStudent((prev) => ({ ...prev, [name]: value }));
  };

  // Handle save button click
  async function handleSave() {
    if (!student) return;

    // Validate inputs
    const updates = {};

    if (editStudent.first.trim() !== "" && editStudent.first !== student.first)
      updates.first = editStudent.first;

    if (editStudent.last.trim() !== "" && editStudent.last !== student.last)
      updates.last = editStudent.last;

    if (editStudent.year !== "" && Number(editStudent.year) !== student.year)
      updates.year = Number(editStudent.year);

    if (editStudent.email.trim() !== "" && editStudent.email !== student.email)
      updates.email = editStudent.email;

    if (editStudent.dateOfBirth && editStudent.dateOfBirth !== student.dateOfBirth)
      updates.dateOfBirth = editStudent.dateOfBirth;

    // If nothing changed, just close
    if (Object.keys(updates).length === 0) {
      onClose();
      return;
    }

    // Update in database
    try {
      const ref = doc(db, "students", student.id);
      await updateDoc(ref, updates);

      // Update local table state
      setStudents((prev) => prev.map((s) => (s.id === student.id ? { ...s, ...updates } : s)));

      onClose();
    } catch (err) {
      console.error("Failed to update student", err);
    }
  }

  return (
    <Dialog open={Boolean(student)} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Student</DialogTitle>

      <DialogContent>
        <TextField
          name="first"
          label="First Name"
          value={editStudent.first}
          onChange={handleChange}
          fullWidth
          margin="dense"
        />
        <TextField
          name="last"
          label="Last Name"
          value={editStudent.last}
          onChange={handleChange}
          fullWidth
          margin="dense"
        />
        <TextField
          name="year"
          label="Year (0 for K)"
          type="number"
          value={editStudent.year}
          onChange={handleChange}
          fullWidth
          margin="dense"
        />
        <TextField
          name="email"
          label="Email"
          value={editStudent.email}
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
                      const first = (editStudent.first || "").trim().toLowerCase();
                      const last = (editStudent.last || "").trim().toLowerCase();
                      if (first && last) {
                        setEditStudent((p) => ({ ...p, email: `${first}.${last}@tomjeff.edu` }));
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
          value={editStudent.dateOfBirth}
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
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSave}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
