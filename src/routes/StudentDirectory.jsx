import {
  Box,
  Container,
  Typography,
  Pagination,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import { useEffect, useState, useMemo } from "react";
import { db } from "../firebase";
import { collection, getDocs, addDoc } from "firebase/firestore";

import Navbar from "../components/Navbar.jsx";
import SearchBar from "../components/SearchBar";
import StudentTable from "../components/StudentTable.jsx";

export default function StudentDirectory() {
  const [studentsData, setStudentsData] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: "id", direction: "asc" });

  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [newStudent, setNewStudent] = useState({
    first: "",
    last: "",
    year: "",
    email: "",
    enrollmentYear: "",
  });

  const rowsPerPage = 20;

  // Fetch students data from database
  useEffect(() => {
    async function fetchStudents() {
      const studentSnapshot = await getDocs(collection(db, "students"));
      const students = studentSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setStudentsData(students);
    }
    fetchStudents();
  }, []);

  // useMemo to memoize the sorted students
  const sortedStudents = useMemo(() => {
    const sorted = [...studentsData];

    sorted.sort((a, b) => {
      let aKey = a[sortConfig.key];
      let bKey = b[sortConfig.key];

      // Numeric-sort for year & enrollmentYear
      if (sortConfig.key === "year" || sortConfig.key === "enrollmentYear") {
        // When sorting, treat year === 0 or "K" as 0 so Kindergarten comes first
        const parseVal = (v) => (v === "K" || v === 0 ? 0 : Number(v));

        aKey = parseVal(aKey);
        bKey = parseVal(bKey);
      }

      if (aKey < bKey) return sortConfig.direction === "asc" ? -1 : 1;
      if (aKey > bKey) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [sortConfig, studentsData]);

  // useMemo to memoize the filtered students
  const filteredStudents = useMemo(() => {
    if (!searchQuery) return sortedStudents;
    const q = searchQuery.toLowerCase();

    return sortedStudents.filter((s) =>
      Object.values(s).some((val) => String(val).toLowerCase().includes(q))
    );
  }, [searchQuery, sortedStudents]);

  // useMemo to memoize the paginated students
  const paginatedStudents = useMemo(() => {
    const start = (page - 1) * rowsPerPage;

    return filteredStudents.slice(start, start + rowsPerPage);
  }, [page, filteredStudents]);

  const handleAddStudent = async () => {
    // Create a new doc in the students collection
    const docRef = await addDoc(collection(db, "students"), {
      first: newStudent.first,
      last: newStudent.last,
      year: Number(newStudent.year),
      email: newStudent.email,
      enrollmentYear: String(newStudent.enrollmentYear),
      gpa: null,
    });

    // Update local state
    setStudentsData((prev) => [...prev, { id: docRef.id, ...newStudent, gpa: null }]);

    // Reset & close
    setNewStudent({ first: "", last: "", year: "", email: "", enrollmentYear: "" });
    setDialogOpen(false);
  };

  // Function to handle sorting when a column header is clicked
  function handleSort(key) {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  }

  const handleNewChange = (e) => {
    const { name, value } = e.target;
    setNewStudent((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <Navbar />

      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Students
        </Typography>

        <SearchBar
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setPage(1);
          }}
        />

        <Box sx={{ mb: 2, display: "flex", justifyContent: "flex-end" }}>
          <Button variant="contained" color="primary" onClick={() => setDialogOpen(true)}>
            Add Student
          </Button>
        </Box>

        <StudentTable rows={paginatedStudents} sortConfig={sortConfig} onSort={handleSort} />

        <Box display="flex" justifyContent="flex-end" p={2}>
          <Pagination
            count={Math.ceil(filteredStudents.length / rowsPerPage)}
            page={page}
            onChange={(_, value) => setPage(value)}
            showFirstButton
            showLastButton
            size="small"
          />
        </Box>
      </Container>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Add New Student</DialogTitle>
        <DialogContent>
          <TextField
            name="first"
            label="First Name"
            value={newStudent.first}
            onChange={handleNewChange}
            fullWidth
            margin="dense"
          />
          <TextField
            name="last"
            label="Last Name"
            value={newStudent.last}
            onChange={handleNewChange}
            fullWidth
            margin="dense"
          />
          <TextField
            name="year"
            label="Year (0 for Kindergarten)"
            type="number"
            value={newStudent.year}
            onChange={handleNewChange}
            fullWidth
            margin="dense"
          />
          <TextField
            name="email"
            label="Email"
            value={newStudent.email}
            onChange={handleNewChange}
            fullWidth
            margin="dense"
          />
          <TextField
            name="enrollmentYear"
            label="Enrollment Year"
            type="number"
            value={newStudent.enrollmentYear}
            onChange={handleNewChange}
            fullWidth
            margin="dense"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleAddStudent} variant="contained">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
