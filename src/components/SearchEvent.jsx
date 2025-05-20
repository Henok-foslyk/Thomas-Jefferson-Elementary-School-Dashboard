import { Container } from "@mui/material";
import { useState } from "react";   

import "../styles/calendar.css"

export default function SearchEvent() {
    const [search, setSearch] = useState('');

    return (
        <>
            <Container class="search-event-container">
                <h1>search event by name</h1>
            </Container>
            
        </>
    )
}