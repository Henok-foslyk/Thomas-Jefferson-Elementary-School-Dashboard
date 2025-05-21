import { Container, gridClasses, Table, TableContainer } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useState } from "react";   
import { Paper } from "@mui/material";

import "../styles/calendar.css"

const columns = [
    { field: 'date', headerName: 'Date', width: 130 },
    { field: 'event', headerName: 'Event Name', width: 130},
    { field: 'location', headerName: 'Location', width: 130}
]

const paginationModel = { page: 0, pageSize: 5 };

export default function EventTable() {
    const [search, setSearch] = useState('');
    const [rows, getRows] = useState(null);



    return (
        <>
            <Container className="search-event-container">
                <Paper sx={{ height: 400, width: '100%' }}>
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        initialState={{ pagination: { paginationModel } }}
                        pageSizeOption={[5, 10]}
                        checkboxSelection
                        sx={{ border: 0 }}            
                    />
                </Paper>
                
            </Container>
            
        </>
    );
}