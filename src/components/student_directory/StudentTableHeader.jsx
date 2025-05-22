import { TableHead, TableRow, TableCell, TableSortLabel } from "@mui/material";

export default function StudentTableHeader({ columns, sortConfig, onSort }) {
  return (
    <TableHead>
      <TableRow>
        <TableCell sx={{ width: 40, backgroundColor: "#ddd" }} />
        {columns.map((col) => (
          <TableCell key={col.key} sx={{ ...col.headerSx, backgroundColor: "#ddd", top: 0 }}>
            {col.sortable ? (
              <TableSortLabel
                active={sortConfig.key === col.key}
                direction={sortConfig.direction}
                onClick={() => onSort(col.key)}
              >
                <strong>{col.label}</strong>
              </TableSortLabel>
            ) : (
              <strong>{col.label}</strong>
            )}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}
