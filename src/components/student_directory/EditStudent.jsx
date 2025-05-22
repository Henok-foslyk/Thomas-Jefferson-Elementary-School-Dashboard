import { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import "../../styles/StudentDirectory.css";

export default function EditStudent({ student, onClose, setStudents }) {
  const [form, setForm] = useState({
    first: "",
    last: "",
    year: "",
    email: "",
  });

  // Set initial form values when student prop changes
  useEffect(() => {
    if (student) {
      setForm({
        first: student.first ?? "",
        last: student.last ?? "",
        year: student.year ?? "",
        email: student.email ?? "",
      });
    }
  }, [student]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handle save button click
  async function handleSave() {
    if (!student) return;

    const updates = {};
    if (form.first.trim() !== "" && form.first !== student.first) {
      updates.first = form.first;
    }
    if (form.last.trim() !== "" && form.last !== student.last) {
      updates.last = form.last;
    }
    if (form.year !== "" && Number(form.year) !== student.year) {
      updates.year = Number(form.year);
    }
    if (form.email.trim() !== "" && form.email !== student.email) {
      updates.email = form.email;
    }

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
          value={form.first}
          onChange={handleChange}
          fullWidth
          margin="dense"
        />
        <TextField
          name="last"
          label="Last Name"
          value={form.last}
          onChange={handleChange}
          fullWidth
          margin="dense"
        />
        <TextField
          name="year"
          label="Year (0 for K)"
          type="number"
          value={form.year}
          onChange={handleChange}
          fullWidth
          margin="dense"
        />
        <TextField
          name="email"
          label="Email"
          value={form.email}
          onChange={handleChange}
          fullWidth
          margin="dense"
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
