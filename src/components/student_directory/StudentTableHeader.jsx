import { useState } from "react";
import {
  TableHead,
  TableRow,
  TableCell,
  TableSortLabel,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";

import MoreVertIcon from "@mui/icons-material/MoreVert";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import BirthdayCakeIcon from "@mui/icons-material/Cake";

import "../../styles/StudentDirectory.css";

export default function StudentTableHeader({ columns, sortConfig, onSort }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  return (
    <>
      <TableHead className="student-table-header">
        <TableRow>
          <TableCell style={{ width: 40 }} />
          {columns.map((col) => (
            <TableCell key={col.key} sx={col.headerSx}>
              {col.key === "dateOfBirth" ? (
                // For dateOfBirth column, show label + three-dot menu button
                <div style={{ display: "flex", alignItems: "center" }}>
                  Date of Birth
                  <IconButton
                    size="small"
                    aria-label="Date of Birth options"
                    onClick={handleMenuOpen}
                  >
                    <MoreVertIcon fontSize="small" />
                  </IconButton>
                </div>
              ) : col.sortable ? (
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

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MenuItem
          onClick={() => {
            onSort("dateOfBirth", "asc");
            handleMenuClose();
          }}
        >
          <ArrowUpwardIcon fontSize="small" sx={{ mr: 1 }} />
          Sort by ASC
        </MenuItem>
        <MenuItem
          onClick={() => {
            onSort("dateOfBirth", "desc");
            handleMenuClose();
          }}
        >
          <ArrowDownwardIcon fontSize="small" sx={{ mr: 1 }} />
          Sort by DESC
        </MenuItem>
        <MenuItem
          onClick={() => {
            onSort("dateOfBirth", "upcoming");
            handleMenuClose();
          }}
        >
          <BirthdayCakeIcon fontSize="small" sx={{ mr: 1 }} />
          Birthday!
        </MenuItem>
      </Menu>
    </>
  );
}
