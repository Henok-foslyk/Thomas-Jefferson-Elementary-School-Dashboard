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
  Collapse,
  Box,
  Typography,
} from "@mui/material";
import {
  KeyboardArrowDown as ExpandMoreIcon,
  KeyboardArrowUp as ExpandLessIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import React, { useState } from "react";

export default function StudentTable({ rows, sortConfig, onSort, onEdit, onDelete }) {
  const [openRow, setOpenRow] = useState({});

  const toggleRow = (id) => {
    setOpenRow((prev) => (prev === id ? null : id));
  };

  // Column configuration for the table
  const columns = [
    // {
    //   key: "id",
    //   label: "ID",
    //   sortable: true,
    //   headerSx: { px: 3, width: 30 },
    //   cellSx: { px: 3 },
    // },
    {
      key: "first",
      label: "First",
      sortable: true,
      headerSx: { px: 2, width: 150 },
      cellSx: { px: 2 },
    },
    {
      key: "last",
      label: "Last",
      sortable: true,
      headerSx: { px: 0, width: 170 },
      cellSx: { px: 0 },
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
      headerSx: { px: 2, width: 230 },
      cellSx: { px: 2 },
    },
    {
      key: "finalGrade",
      label: "Final Grade",
      sortable: true,
      headerSx: { px: 0, width: 110 },
      cellSx: { px: 2 },
      render: (v) => (v != null ? v.toFixed(2) : "—"),
    },
    {
      key: "enrollmentYear",
      label: "Enrolled",
      sortable: true,
      headerSx: { px: 7 },
      cellSx: { px: 8 },
    },
    {
      key: "actions",
      sortable: false,
      cellSx: { textAlign: "right" },
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
    <TableContainer component={Paper} sx={{ maxHeight: 800 }}>
      <Table stickyHeader sx={{ tableLayout: "fixed" }}>
        {/* TableHead is where the column headers are defined */}
        <TableHead>
          <TableRow>
            {/* Expand cell for the row toggle */}
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

        {/* TableBody is where the actual data rows are rendered */}
        <TableBody>
          {rows.map((row) => (
            <React.Fragment key={row.id}>
              {/* Row with expandable content */}
              <TableRow hover>
                <TableCell>
                  <IconButton size="small" onClick={() => toggleRow(row.id)}>
                    {openRow === row.id ? <ExpandLessIcon /> : <ExpandMoreIcon />}
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
                  <Collapse in={openRow === row.id} unmountOnExit>
                    <Box margin={2}>
                      <Typography variant="subtitle2">Enrolled Classes:</Typography>
                      {row.classes.length > 0 ? (
                        row.classes.map((cls) => (
                          <Typography key={cls} variant="body2">
                            • {cls}
                          </Typography>
                        ))
                      ) : (
                        <Typography variant="body2">None assigned yet</Typography>
                      )}
                    </Box>
                  </Collapse>
                </TableCell>
              </TableRow>
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
