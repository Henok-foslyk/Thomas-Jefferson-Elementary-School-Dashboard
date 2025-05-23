import { TextField } from "@mui/material";
import { useStat, useMemo, useEffect } from "react";   

import "../../styles/Calendar.css";

export default function SearchEvent({ search, setSearch }) {
    const handleSearch = (searchValue) => {
        console.log(`Searching for ${searchValue}`);
        setSearch(searchValue);
    }


    return (
        <>
            <TextField
                fullWidth
                label="Search events"
                variant="outlined"
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
            />
        </>
    )
}