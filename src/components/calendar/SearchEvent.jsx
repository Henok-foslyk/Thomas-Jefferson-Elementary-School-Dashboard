import { TextField } from "@mui/material";
import { useState } from "react";   

import "../../styles/Calendar.css";

export default function SearchEvent({ search, setSearch }) {
    

    return (
        <>
            <TextField
                fullWidth
                label="Search events"
                variant="outlined"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
        </>
    )
}