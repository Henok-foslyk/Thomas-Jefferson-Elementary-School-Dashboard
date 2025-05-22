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
import "../../styles/StudentDirectory.css";

export default function EnrolledClassesPanel({ open, classes }) {
  return (
    <Collapse in={open} unmountOnExit>
      <Box className="enrolled-classes-panel">
        <Typography variant="h6">Enrolled Classes:</Typography>

        <Table size="small" className="enrolled-classes-table">
          <TableHead className="enrolled-classes-header">
            <TableRow>
              <TableCell className="enrolled-classes-cell">Class</TableCell>
              <TableCell className="enrolled-classes-cell">Teacher</TableCell>
              <TableCell align="right" className="enrolled-classes-cell">
                Grade
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {classes.length > 0 ? (
              classes.map(({ className, teacherFullName, avgGrade }) => (
                <TableRow key={className}>
                  <TableCell>{className}</TableCell>
                  <TableCell>{teacherFullName}</TableCell>
                  <TableCell className="enrolled-classes-cell">
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
