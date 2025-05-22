import { Container } from "@mui/material";
import { useState } from "react";   

import "../../styles/Calendar.css";

export default function SearchEvent() {
    const [search, setSearch] = useState('');

    return (
        <>
            <Container className="search-event-container">
                <input placeholder="Search by event name"/>
            </Container>
            
        </>
    )
}