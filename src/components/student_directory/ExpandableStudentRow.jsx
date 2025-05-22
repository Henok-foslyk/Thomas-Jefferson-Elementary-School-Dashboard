import { TableRow, TableCell, IconButton } from "@mui/material";
import {
  KeyboardArrowDown as ExpandMoreIcon,
  KeyboardArrowUp as ExpandLessIcon,
} from "@mui/icons-material";
import EnrolledClassesTable from "./EnrolledClassesTable.jsx";

export default function ExpandableStudentRow({ row, columns, isOpen, onToggle }) {
  return (
    <>
      <TableRow hover>
        <TableCell>
          <IconButton size="small" onClick={() => onToggle(row.id)}>
            {isOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </TableCell>

        {columns.map((col) => (
          <TableCell key={col.key} sx={col.cellSx}>
            {col.render ? col.render(row[col.key], row) : row[col.key]}
          </TableCell>
        ))}
      </TableRow>

      <TableRow>
        <TableCell colSpan={columns.length + 1} sx={{ p: 0 }}>
          {/* Enrolled classes table */}
          <EnrolledClassesTable open={isOpen} classes={row.classes} />
        </TableCell>
      </TableRow>
    </>
  );
}
