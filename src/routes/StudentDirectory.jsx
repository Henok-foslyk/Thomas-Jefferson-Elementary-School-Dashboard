import { Box, Container, Typography, Pagination } from "@mui/material";
import { useEffect, useState, useMemo } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

import Navbar from "../components/Navbar.jsx";
import SearchBar from "../components/SearchBar";
import StudentTable from "../components/StudentTable.jsx";

export default function StudentDirectory() {
  const [studentsData, setStudentsData] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: "id", direction: "asc" });
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const rowsPerPage = 20;

  // Fetch students data from database
  useEffect(() => {
    async function fetchStudents() {
      const querySnapshot = await getDocs(collection(db, "students"));
      const loaded = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setStudentsData(loaded);
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

  // Function to handle sorting when a column header is clicked
  function handleSort(key) {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  }

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
