import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
} from "@mui/material";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase";

export default function DeleteTeacherDirectory({ teacher, open, onClose, onDeleted }) {
  if (!teacher) return null;

  const handleConfirm = async () => {
    try {
      // Remove from database
      await deleteDoc(doc(db, "teachers", teacher.id));

      onDeleted(teacher.id);
    } catch (err) {
      console.error("Error deleting teacher:", err);
    } finally {
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        Delete {teacher.first} {teacher.last}?
      </DialogTitle>
      <DialogContent>
        <Typography>
          Are you sure you want to delete{" "}
          {
            <strong>
              {teacher.first} {teacher.last}
            </strong>
          }{" "}
          from the teacher directory?
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button color="error" onClick={handleConfirm}>
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
}
