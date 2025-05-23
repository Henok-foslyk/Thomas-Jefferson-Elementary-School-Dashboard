import TextField from "@mui/material/TextField";
import "../styles/SearchBar.css";

export default function SearchBar({ value, onChange }) {
  return (
    <TextField
      className="search-bar-root"
      label="Search"
      variant="outlined"
      size="small"
      fullWidth
      value={value}
      onChange={onChange}
      sx={{ mb: 2 }}
    />
  );
}
