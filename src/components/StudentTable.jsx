import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TableSortLabel,
} from "@mui/material";

// Column configuration for the table
const columns = [
  {
    key: "id",
    label: "ID",
    sortable: true,
    headerSx: { px: 3, width: 90 },
    cellSx: { px: 3 },
  },
  {
    key: "first",
    label: "First",
    sortable: true,
    headerSx: { px: 0, width: 170 },
    cellSx: { px: 0 },
  },
  {
    key: "last",
    label: "Last",
    sortable: true,
    headerSx: { px: 2, width: 170 },
    cellSx: { px: 2 },
  },
  {
    key: "year",
    label: "Year",
    sortable: true,
    headerSx: { px: 1, width: 80 },
    cellSx: { px: 2 },
    render: (v) => (v === 0 ? "K" : v),
  },
  {
    key: "email",
    label: "Email",
    sortable: false,
    headerSx: { px: 2, width: 250 },
    cellSx: { px: 2 },
  },
  {
    key: "gpa",
    label: "GPA",
    sortable: false,
    headerSx: { px: 0, width: 80 },
    cellSx: { px: 1 },
    render: (v) => (v != null ? v.toFixed(2) : "—"),
  },
  {
    key: "enrollmentYear",
    label: "Enrolled",
    sortable: true,
    headerSx: { px: 9 },
    cellSx: { px: 9 },
  },
];

export default function StudentTable({ rows, sortConfig, onSort, columnConfig = columns }) {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ tableLayout: "fixed", width: "100%" }}>
        {/* TableHead is where the column headers are defined */}
        <TableHead sx={{ backgroundColor: "#ddd" }}>
          <TableRow>
            {columnConfig.map((col) => (
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
              {columnConfig.map((col) => (
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
