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
  {
    id: "0003",
    first: "Alice",
    last: "Smith",
    year: "2",
    email: "alice.smith@tomjeff.edu",
    enrollmentYear: "2023",
  },
  {
    id: "0004",
    first: "Bob",
    last: "Johnson",
    year: "4",
    email: "bob.johnson@tomjeff.edu",
    enrollmentYear: "2021",
  },
  {
    id: "0005",
    first: "Carol",
    last: "Lee",
    year: "1",
    email: "carol.lee@tomjeff.edu",
    enrollmentYear: "2024",
  },
  {
    id: "0006",
    first: "David",
    last: "Martinez",
    year: "5",
    email: "david.martinez@tomjeff.edu",
    enrollmentYear: "2020",
  },
  {
    id: "0007",
    first: "Eva",
    last: "Thompson",
    year: "3",
    email: "eva.thompson@tomjeff.edu",
    enrollmentYear: "2022",
  },
  {
    id: "0008",
    first: "Frank",
    last: "Turner",
    year: "4",
    email: "frank.turner@tomjeff.edu",
    enrollmentYear: "2021",
  },
  {
    id: "0009",
    first: "Grace",
    last: "Kim",
    year: "2",
    email: "grace.kim@tomjeff.edu",
    enrollmentYear: "2023",
  },
  {
    id: "0010",
    first: "Henry",
    last: "Clark",
    year: "5",
    email: "henry.clark@tomjeff.edu",
    enrollmentYear: "2020",
  },
  {
    id: "0011",
    first: "Isabel",
    last: "Wright",
    year: "1",
    email: "isabel.wright@tomjeff.edu",
    enrollmentYear: "2024",
  },
  {
    id: "0012",
    first: "Jack",
    last: "Lopez",
    year: "3",
    email: "jack.lopez@tomjeff.edu",
    enrollmentYear: "2022",
  },
  {
    id: "0013",
    first: "Katie",
    last: "Hall",
    year: "4",
    email: "katie.hall@tomjeff.edu",
    enrollmentYear: "2021",
  },
  {
    id: "0014",
    first: "Liam",
    last: "Allen",
    year: "2",
    email: "liam.allen@tomjeff.edu",
    enrollmentYear: "2023",
  },
  {
    id: "0015",
    first: "Mia",
    last: "Young",
    year: "5",
    email: "mia.young@tomjeff.edu",
    enrollmentYear: "2020",
  },
  {
    id: "0016",
    first: "Noah",
    last: "Hernandez",
    year: "3",
    email: "noah.hernandez@tomjeff.edu",
    enrollmentYear: "2022",
  },
  {
    id: "0017",
    first: "Olivia",
    last: "King",
    year: "4",
    email: "olivia.king@tomjeff.edu",
    enrollmentYear: "2021",
  },
  {
    id: "0018",
    first: "Paul",
    last: "Scott",
    year: "1",
    email: "paul.scott@tomjeff.edu",
    enrollmentYear: "2024",
  },
  {
    id: "0019",
    first: "Quinn",
    last: "Adams",
    year: "2",
    email: "quinn.adams@tomjeff.edu",
    enrollmentYear: "2023",
  },
  {
    id: "0020",
    first: "Riley",
    last: "Baker",
    year: "4",
    email: "riley.baker@tomjeff.edu",
    enrollmentYear: "2021",
  },
  {
    id: "0021",
    first: "Sophia",
    last: "Campbell",
    year: "5",
    email: "sophia.campbell@tomjeff.edu",
    enrollmentYear: "2019",
  },
];

export default function StudentDirectory() {
  const [sortConfig, setSortConfig] = useState({ key: "id", direction: "asc" });
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const rowsPerPage = 20;

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
