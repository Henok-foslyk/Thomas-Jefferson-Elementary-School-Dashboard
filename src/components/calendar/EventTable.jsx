import { Button, Container, gridClasses, Table, TableContainer, Dialog } from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";   
import { Paper } from "@mui/material";

import EventEditDialog from "./EventEditDialog";

import { collection, doc, getDoc, getDocs, query } from "firebase/firestore";
import { db } from "../../firebase";

import "../../styles/Calendar.css"

const columns = [
    { field: 'date', headerName: 'Date', width: 130, editable: true},
    { field: 'event-name', headerName: 'Event Name', width: 130},
    { field: 'location', headerName: 'Location', width: 130}
]

const paginationModel = { page: 0, pageSizeOption: 5 };

export default function EventTable({ search }) {
    
    const [rows, setRows] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [selectedId, setSelectedId] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedEventName, setSelectedEventName] = useState(null);
    const [selectedLocation, setSelectedLocation] = useState(null);
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
        console.log("editing!");
        setIsEditing(!isEditing);
    }

    const filteredRows = search ? rows?.filter(row =>
        row["event-name"]?.toLowerCase().includes(search.toLowerCase()) ||
        row.location?.toLowerCase().includes(search.toLowerCase()) ||
        row.date?.toLowerCase().includes(search.toLowerCase())
    ) : rows;


    return (
        <>
            
                <Paper sx={{ height: 400, width: '100%' }}>
                    <DataGrid
                        rows={filteredRows || []}
                        columns={columns}
                        editMode="row"
                        initialState={{ 
                            pagination: { paginationModel },
                                sorting: { sortModel: [{ field: 'date', sort: 'desc'}] } 
                        }}
                        
                        pageSizeOption={[5, 10]}
                        checkboxSelection={false}
                        loading={isLoading}
                        hideFooterSelectedRowCount
                        onRowClick={(params) => { 
                            if (selectedId === params.id) {
                                setSelectedId(null);
                                setSelectedDate(null);
                                setSelectedEventName(null);
                                setSelectedLocation(null);                                
                            }
                            else {
                                const row = params.row;
                                setSelectedId(row.id);
                                setSelectedDate(row.date);
                                setSelectedEventName(row["event-name"]);
                                setSelectedLocation(row.location); 
                                console.log(row["event-name"]);
                            }
                        }}
                        sx={{ border: 0 }}            
                    />
                </Paper>
                    {selectedId && (
                        <Button 
                            variant="outlined"
                            onClick={() => handleEdit()}
                        >
                            Edit
                        </Button>
                    )}
                    {isEditing && (
                        <EventEditDialog 
                            id={selectedId}
                            date={selectedDate}
                            event={selectedEventName}
                            location={selectedLocation}
                            open={isEditing}
                            onClose={() => setIsEditing(false)}
                        />
                    )}
                
          
            
        </>
    );
}