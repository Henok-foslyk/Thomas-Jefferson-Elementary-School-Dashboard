import {
  Collapse,
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";

export default function EnrolledClassesPanel({ open, classes }) {
  return (
    <Collapse in={open} unmountOnExit>
      <Box
        margin={2}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography variant="h6">Enrolled Classes:</Typography>

        <Table size="small" sx={{ maxWidth: 450 }}>
          <TableHead sx={{ backgroundColor: "#ddd" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold", width: 150 }}>Class</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Teacher</TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>
                Avg Grade
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {classes.length > 0 ? (
              classes.map(({ className, teacherFullName, avgGrade }) => (
                <TableRow key={className}>
                  <TableCell>{className}</TableCell>
                  <TableCell>{teacherFullName}</TableCell>
                  <TableCell align="right">
                    {avgGrade != null ? avgGrade.toFixed(1) : "—"}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              // Student has no classes
              <TableRow>
                <TableCell>—</TableCell>
                <TableCell>—</TableCell>
                <TableCell align="right">—</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Box>
    </Collapse>
  );
}
