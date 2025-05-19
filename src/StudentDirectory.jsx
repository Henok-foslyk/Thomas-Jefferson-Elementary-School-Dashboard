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
} from "@mui/material";

const students = [
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
  return (
    <>
      {/* <Navbar /> */}

      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Students
        </Typography>

        <TableContainer component={Paper}>
          <Table>
            <TableHead sx={{ backgroundColor: "#ddd" }}>
              <TableRow>
                <TableCell>
                  <strong>ID</strong>
                </TableCell>
                <TableCell>
                  <strong>First</strong>
                </TableCell>
                <TableCell>
                  <strong>Last</strong>
                </TableCell>
                <TableCell>
                  <strong>Year</strong>
                </TableCell>
                <TableCell>
                  <strong>Email</strong>
                </TableCell>
                <TableCell align="center">
                  <strong>Enrolled</strong>
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {students.map((student) => (
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
