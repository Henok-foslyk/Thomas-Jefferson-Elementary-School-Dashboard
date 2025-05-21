import { Box, Container, Typography, Pagination } from "@mui/material";
import { useEffect, useState, useMemo } from "react";
import { db } from "../firebase";
import { collection, getDocs, doc, setDoc } from "firebase/firestore";

import Navbar from "../components/Navbar.jsx";
import SearchBar from "../components/SearchBar";
import StudentTable from "../components/StudentTable.jsx";
import NewStudent from "../components/NewStudent.jsx";

export default function StudentDirectory() {
  const [studentsData, setStudentsData] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: "id", direction: "asc" });

  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);

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

  // Memoized sorted students
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

  // Memoized filtered students
  const filteredStudents = useMemo(() => {
    if (!searchQuery) return sortedStudents;
    const q = searchQuery.toLowerCase();

    return sortedStudents.filter((s) =>
      Object.values(s).some((val) => String(val).toLowerCase().includes(q))
    );
  }, [searchQuery, sortedStudents]);

  // Memoized paginated students
  const paginatedStudents = useMemo(() => {
    const start = (page - 1) * rowsPerPage;

    return filteredStudents.slice(start, start + rowsPerPage);
  }, [page, filteredStudents]);

  // Function to handle adding a new student
  const handleAddStudent = async (studentForm) => {
    // Pick the next free ID
    const nextId = getNextStudentId(studentsData);

    // Write to database
    await setDoc(doc(db, "students", String(nextId)), {
      ...studentForm,
      gpa: null,
    });

    // Update local state so UI shows it immediately
    setStudentsData((prev) => [...prev, { id: String(nextId), ...studentForm, gpa: null }]);
  };

  // Sorting handler
  function handleSort(key) {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  }

  // Function to get the next available student ID
  function getNextStudentId(students) {
    // Turn all existing IDs into numbers
    const used = new Set(students.map((s) => parseInt(s.id, 10)).filter((n) => !isNaN(n)));

    // Find the first number not in used
    let id = 1;
    while (used.has(id)) id++;
    return id;
  }

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

        <NewStudent onAdd={handleAddStudent} />

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
    </>
  );
}
