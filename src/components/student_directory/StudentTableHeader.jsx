import { TableHead, TableRow, TableCell, TableSortLabel } from "@mui/material";
import "../../styles/StudentDirectory.css";

export default function StudentTableHeader({ columns, sortConfig, onSort }) {
  return (
    <TableHead className="student-table-header">
      <TableRow>
        <TableCell style={{ width: 40 }} />
        {columns.map((col) => (
          <TableCell key={col.key} sx={col.headerSx}>
            {col.sortable ? (
              <TableSortLabel
                active={sortConfig.key === col.key}
                direction={sortConfig.direction}
                onClick={() => onSort(col.key)}
              >
                {col.label}
              </TableSortLabel>
            ) : (
              col.label
            )}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}
