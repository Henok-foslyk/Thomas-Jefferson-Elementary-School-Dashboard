import { Button, Container, gridClasses, Table, TableContainer, Dialog } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";   
import { Paper } from "@mui/material";

import EventEditDialog from "./EventEditDialog";

import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "../firebase";

import "../styles/calendar.css"

const columns = [
    { field: 'date', headerName: 'Date', width: 130 },
    { field: 'event-name', headerName: 'Event Name', width: 130},
    { field: 'location', headerName: 'Location', width: 130}
]

const paginationModel = { page: 0, pageSizeOption: 5 };

export default function EventTable() {
    const [search, setSearch] = useState('');
    const [rows, setRows] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [selectedId, setSelectedId] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        const getEvents = async () => {
            setIsLoading(true);
            try {
                const querySnapshot = await getDocs(collection(db, "events"));
                const events = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setRows(events);
                
            }
            catch(e) {
                console.error(e);
            }
            setIsLoading(false);
        }
        getEvents();
        if (rows) {
            console.log(rows);
        }
        
    }, [])

    useEffect(() => {
        if (rows) {
            console.log(rows);
        }
    }, [rows])

    useEffect(() => {
        if(message) {
            console.log(message) 
        }
    }, [message])

    const handleEdit = () => {
        console.log("edited!");
        setIsEditing(!isEditing);
        
    }

    return (
        <>
            <Container className="search-event-container">
                <Paper sx={{ height: 400, width: '100%' }}>
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        initialState={{ pagination: { paginationModel } }}
                        pageSizeOption={[5, 10]}
                        checkboxSelection={false}
                        loading={isLoading}
                        onRowClick={(params) => { 
                            if (selectedId === params.id) {
                                setSelectedId(null);
                            }
                            else {
                                setSelectedId(params.id)} 
                            }
                        }
                        
                        sx={{ border: 0 }}            
                    /><br></br>
                    {selectedId && (
                        <Button 
                            variant="outlined"
                            onClick={() => handleEdit()}
                        >
                            Edit
                        </Button>
                    )}
                    {isEditing && (
                        <EventEditDialog id={selectedId} />
                    )}
                </Paper>
            </Container>
            
        </>
    );
}