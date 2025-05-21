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

export default function DeleteStudentDirectory({ student, open, onClose, onDeleted }) {
  if (!student) return null;

  const handleConfirm = async () => {
    try {
      // Remove from database
      await deleteDoc(doc(db, "students", student.id));

      onDeleted(student.id);
    } catch (err) {
      console.error("Error deleting student:", err);
    } finally {
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        Delete {student.first} {student.last}?
      </DialogTitle>
      <DialogContent>
        <Typography>
          Are you sure you want to delete{" "}
          {
            <strong>
              {student.first} {student.last}
            </strong>
          }{" "}
          from the student directory?
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
