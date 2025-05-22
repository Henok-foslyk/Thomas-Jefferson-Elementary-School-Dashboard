import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TableSortLabel,
  IconButton,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export default function TeacherTable({ rows, sortConfig, onSort, classMap, onEdit, onDelete }) {
  // Column configuration for the table
  const columns = [
    {
      key: "first",
      label: "First",
      sortable: true,
      headerSx: { px: 4, width: 150 },
      cellSx: { px: 4 },
    },
    {
      key: "last",
      label: "Last",
      sortable: true,
      headerSx: { px: 0, width: 170 },
      cellSx: { px: 0 },
    },
    {
      key: "class",
      label: "Class",
      sortable: true,
      headerSx: { px: 1, width: 150 },
      cellSx: { px: 1 },
      render: (v) => classMap?.[v] || "—",
    },
    {
      key: "email",
      label: "Email",
      sortable: false,
      headerSx: { px: 2, width: 230 },
      cellSx: { px: 2 },
    },
    {
      key: "phone",
      label: "Phone",
      sortable: false,
      headerSx: { px: 2, width: 100 },
      cellSx: { px: 2 },
      render: (v) => v || "—",
    },
    {
      key: "actions",
      label: "",
      sortable: false,
      headerSx: { px: 0, width: 100 },
      cellSx: { px: 2 },
      render: (_, row) => (
        <>
          <IconButton size="small" onClick={() => onEdit(row)}>
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={() => onDelete(row)}>
            <DeleteIcon fontSize="small" />
          </IconButton>
        </>
      ),
    },
  ];
  return (
    <TableContainer component={Paper}>
      <Table sx={{ tableLayout: "fixed", width: "100%" }}>
        {/* TableHead is where the column headers are defined */}
        <TableHead sx={{ backgroundColor: "#8a9cb3" }}>
          <TableRow>
            {columns.map((col) => (
              <TableCell key={col.key} sx={col.headerSx}>
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

        {/* TableBody is where the actual data rows are rendered */}
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              {columns.map((col) => (
                <TableCell key={col.key} sx={col.cellSx}>
                  {col.render ? col.render(row[col.key], row) : row[col.key]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
