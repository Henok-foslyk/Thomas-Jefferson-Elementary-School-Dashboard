import {
  Box,
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Pagination,
  Paper,
  TableSortLabel,
  TextField,
} from "@mui/material";
import { useEffect, useState, useMemo } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

import Navbar from "../components/Navbar.jsx";

export default function StudentDirectory() {
  const [studentsData, setStudentsData] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: "id", direction: "asc" });
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const rowsPerPage = 20;

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
        aKey = Number(aKey);
        bKey = Number(bKey);
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

  const filteredStudents = useMemo(() => {
    if (!searchQuery) return sortedStudents;
    const q = searchQuery.toLowerCase();

    return sortedStudents.filter((s) =>
      Object.values(s).some((val) => String(val).toLowerCase().includes(q))
    );
  }, [searchQuery, sortedStudents]);

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

        <TextField
          label="Search"
          variant="outlined"
          size="small"
          fullWidth
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setPage(1); // reset to page 1 on new search
          }}
          sx={{ mb: 2 }}
        />

        <TableContainer component={Paper}>
          <Table sx={{ tableLayout: "fixed", width: "100%" }}>
            <TableHead sx={{ backgroundColor: "#ddd" }}>
              <TableRow>
                <TableCell sx={{ px: 3, width: 70 }}>
                  <TableSortLabel
                    active={sortConfig.key === "id"}
                    direction={sortConfig.key === "id" ? sortConfig.direction : "asc"}
                    onClick={() => handleSort("id")}
                  >
                    <strong>ID</strong>
                  </TableSortLabel>
                </TableCell>
                <TableCell sx={{ px: 0, width: 170 }}>
                  <TableSortLabel
                    active={sortConfig.key === "first"}
                    direction={sortConfig.key === "first" ? sortConfig.direction : "asc"}
                    onClick={() => handleSort("first")}
                  >
                    <strong>First</strong>
                  </TableSortLabel>
                </TableCell>
                <TableCell sx={{ px: 2, width: 170 }}>
                  <TableSortLabel
                    active={sortConfig.key === "last"}
                    direction={sortConfig.key === "last" ? sortConfig.direction : "asc"}
                    onClick={() => handleSort("last")}
                  >
                    <strong>Last</strong>
                  </TableSortLabel>
                </TableCell>
                <TableCell sx={{ px: 5, width: 60 }}>
                  <TableSortLabel
                    active={sortConfig.key === "year"}
                    direction={sortConfig.key === "year" ? sortConfig.direction : "asc"}
                    onClick={() => handleSort("year")}
                  >
                    <strong>Year</strong>
                  </TableSortLabel>
                </TableCell>
                <TableCell sx={{ px: 2, width: 250 }}>
                  <strong>Email</strong>
                </TableCell>
                <TableCell sx={{ px: 9 }}>
                  <TableSortLabel
                    active={sortConfig.key === "enrollmentYear"}
                    direction={sortConfig.key === "enrollmentYear" ? sortConfig.direction : "asc"}
                    onClick={() => handleSort("enrollmentYear")}
                  >
                    <strong>Enrolled</strong>
                  </TableSortLabel>
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {paginatedStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell sx={{ px: 3 }}>{student.id}</TableCell>
                  <TableCell sx={{ px: 0 }}>{student.first}</TableCell>
                  <TableCell sx={{ px: 2 }}>{student.last}</TableCell>
                  <TableCell sx={{ px: 6 }}>{student.year}</TableCell>
                  <TableCell sx={{ px: 2 }}>{student.email}</TableCell>
                  <TableCell sx={{ px: 9 }}>{student.enrollmentYear}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
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
