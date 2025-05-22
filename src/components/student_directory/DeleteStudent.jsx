import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
} from "@mui/material";
import {
  deleteDoc,
  doc,
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  arrayRemove,
} from "firebase/firestore";
import { db } from "../../firebase";

export default function DeleteStudentDirectory({ student, open, onClose, onDeleted }) {
  if (!student) return null;

  const handleConfirm = async () => {
    try {
      // Remove from database
      await deleteDoc(doc(db, "students", student.id));

      // Remove from all classes
      const q = query(
        collection(db, "classes"),
        where("student_ids", "array-contains", student.id)
      );
      const classSnap = await getDocs(q);

      // Update each class to remove the student ID
      const removals = classSnap.docs.map((clsDoc) =>
        updateDoc(clsDoc.ref, {
          student_ids: arrayRemove(student.id),
        })
      );
      await Promise.all(removals);

      onDeleted(student.id);
    } catch (err) {
      console.error("Error deleting student or updating classes:", err);
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
        <Typography sx={{ mt: 2 }}>(and remove them from all classes)</Typography>
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
