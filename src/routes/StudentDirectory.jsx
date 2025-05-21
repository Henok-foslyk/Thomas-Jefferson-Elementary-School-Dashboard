import { Box, Container, Typography, Pagination } from "@mui/material";
import { useEffect, useState, useMemo } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

import Navbar from "../components/Navbar.jsx";
import SearchBar from "../components/SearchBar";
import StudentTable from "../components/StudentTable.jsx";
import NewStudentDirectory from "../components/NewStudentDirectory.jsx";
import DeleteStudentDirectory from "../components/DeleteStudentDirectory.jsx";

export default function StudentDirectory() {
  const [studentsData, setStudentsData] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: "last", direction: "asc" });

  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);

  const [toDelete, setToDelete] = useState(null);

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

  // Sorting handler
  function handleSort(key) {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
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

        <NewStudentDirectory students={studentsData} setStudents={setStudentsData} />

        <StudentTable
          rows={paginatedStudents}
          sortConfig={sortConfig}
          onSort={handleSort}
          onDelete={(student) => setToDelete(student)}
        />

        <DeleteStudentDirectory
          student={toDelete}
          open={Boolean(toDelete)}
          onClose={() => setToDelete(null)}
          onDeleted={(id) => {
            setStudentsData((prev) => prev.filter((s) => s.id !== id));
          }}
        />

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
