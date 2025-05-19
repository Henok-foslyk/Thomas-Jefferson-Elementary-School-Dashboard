import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TableSortLabel,
} from "@mui/material";
import { useState, useMemo } from "react";
import Navbar from "../components/Navbar.jsx";

const studentsData = [
  {
    id: "0001",
    first: "John",
    last: "Doe",
    year: "3",
    email: "john.doe@tomjeff.edu",
    enrollmentYear: "2022",
  },
  {
    id: "0002",
    first: "Jane",
    last: "Doe",
    year: "4",
    email: "jane.doe@tomjeff.edu",
    enrollmentYear: "2021",
  },
];

export default function StudentDirectory() {
  const [sortConfig, setSortConfig] = useState({ key: "id", direction: "asc" });

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
  }, [sortConfig]);

  // Function to handle sorting when a column header is clicked
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

        <TableContainer component={Paper}>
          <Table>
            <TableHead sx={{ backgroundColor: "#ddd" }}>
              <TableRow>
                <TableCell>
                  <TableSortLabel
                    active={sortConfig.key === "id"}
                    direction={sortConfig.key === "id" ? sortConfig.direction : "asc"}
                    onClick={() => handleSort("id")}
                  >
                    <strong>ID</strong>
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortConfig.key === "first"}
                    direction={sortConfig.key === "first" ? sortConfig.direction : "asc"}
                    onClick={() => handleSort("first")}
                  >
                    <strong>First</strong>
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortConfig.key === "last"}
                    direction={sortConfig.key === "last" ? sortConfig.direction : "asc"}
                    onClick={() => handleSort("last")}
                  >
                    <strong>Last</strong>
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortConfig.key === "year"}
                    direction={sortConfig.key === "year" ? sortConfig.direction : "asc"}
                    onClick={() => handleSort("year")}
                  >
                    <strong>Year</strong>
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <strong>Email</strong>
                </TableCell>
                <TableCell>
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
              {sortedStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>{student.id}</TableCell>
                  <TableCell>{student.first}</TableCell>
                  <TableCell>{student.last}</TableCell>
                  <TableCell>{student.year}</TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell>{student.enrollmentYear}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </>
  );
}
