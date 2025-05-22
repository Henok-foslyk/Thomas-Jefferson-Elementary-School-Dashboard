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

export default function EditTeacher({ teacher, onClose, setTeachers }) {
  const [editTeacher, setEditTeacher] = useState({
    first: "",
    last: "",
    email: "",
    phone: "",
  });
  const [phoneInvalidChars, setPhoneInvalidChars] = useState(false);
  const [phoneInvalidFormat, setPhoneInvalidFormat] = useState(false);

  // Set initial form values when teacher prop changes
  useEffect(() => {
    if (teacher) {
      setEditTeacher({
        first: teacher.first || "",
        last: teacher.last || "",
        email: teacher.email || "",
        phone: teacher.phone || "",
      });
      setPhoneInvalidChars(false);
      setPhoneInvalidFormat(false);
    }
  }, [teacher]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "phone") {
      const charsOk = /^[0-9-]*$/.test(value);
      setPhoneInvalidChars(!charsOk);
      if (phoneInvalidFormat) setPhoneInvalidFormat(false);
    }
    setEditTeacher((f) => ({ ...f, [name]: value }));
  };

  const handlePhoneBlur = () => {
    const raw = editTeacher.phone.replace(/-/g, "");

    // if only digits+dash errors exist, skip until chars is valid
    if (phoneInvalidChars) return;

    // If exactly 10 digits, format
    if (/^\d{10}$/.test(raw)) {
      const formatted = raw.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
      setEditTeacher((f) => ({ ...f, phone: formatted }));
      setPhoneInvalidFormat(false);
      return;
    }
    // Already matches US pattern
    if (/^\d{3}-\d{3}-\d{4}$/.test(editTeacher.phone)) {
      setPhoneInvalidFormat(false);
      return;
    }
    // Otherwise invalid
    setPhoneInvalidFormat(true);
  };

  // Handle save button click
  const handleSave = async () => {
    if (!teacher || phoneInvalidChars || phoneInvalidFormat) return;

    // Validate inputs
    const updates = {};
    if (editTeacher.first.trim() !== "" && editTeacher.first !== teacher.first) {
      updates.first = editTeacher.first;
    }
    if (editTeacher.last.trim() !== "" && editTeacher.last !== teacher.last) {
      updates.last = editTeacher.last;
    }
    if (editTeacher.email.trim() !== "" && editTeacher.email !== teacher.email) {
      updates.email = editTeacher.email;
    }
    if (editTeacher.phone.trim() !== "" && editTeacher.phone !== teacher.phone) {
      updates.phone = editTeacher.phone;
    }

    // If nothing changed, just close
    if (Object.keys(updates).length === 0) {
      onClose();
      return;
    }

    // Update in database
    try {
      const ref = doc(db, "teachers", teacher.id);
      await updateDoc(ref, updates);

      // Update local table state
      setTeachers((list) => list.map((t) => (t.id === teacher.id ? { ...t, ...updates } : t)));
      onClose();
    } catch (err) {
      console.error("Failed to update teacher:", err);
    }
  };

  return (
    <Dialog open={Boolean(teacher)} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Teacher</DialogTitle>

      <DialogContent dividers>
        <TextField
          name="first"
          label="First Name"
          value={editTeacher.first}
          onChange={handleChange}
          fullWidth
          margin="dense"
        />
        <TextField
          name="last"
          label="Last Name"
          value={editTeacher.last}
          onChange={handleChange}
          fullWidth
          margin="dense"
        />
        <TextField
          name="email"
          label="Email"
          value={editTeacher.email}
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
                      const first = (editTeacher.first || "").trim().toLowerCase();
                      const last = (editTeacher.last || "").trim().toLowerCase();
                      if (first && last) {
                        setEditTeacher((p) => ({ ...p, email: `${first}.${last}@tomjeff.edu` }));
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
          label="Phone Number"
          value={editTeacher.phone}
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
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSave}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
