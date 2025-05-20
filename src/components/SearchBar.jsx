import TextField from "@mui/material/TextField";

export default function SearchBar({ value, onChange }) {
  return (
    <TextField
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
