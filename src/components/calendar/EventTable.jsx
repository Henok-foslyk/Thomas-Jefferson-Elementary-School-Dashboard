import { Button, Paper } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";  
import EventEditDialog from "./EventEditDialog";
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "../../firebase";
import "../../styles/Calendar.css";

const columns = [
    { field: 'date', headerName: 'Date', width: 130, editable: true },
    { field: 'event-name', headerName: 'Event Name', width: 130 },
    { field: 'location', headerName: 'Location', width: 130 }
];

export default function EventTable({ search, events, selectedDate, onRefresh }) {
    const [filteredRows, setFilteredRows] = useState([]);
    const [selectedId, setSelectedId] = useState(null);
    const [selectedRow, setSelectedRow] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if (!events) return;
        
        const filtered = search
            ? events.filter(row => {
                const searchTerm = search.toLowerCase();
                return (
                    row["event-name"]?.toLowerCase().includes(searchTerm) ||
                    row.location?.toLowerCase().includes(searchTerm) ||
                    row.date?.toLowerCase().includes(searchTerm)
                );
            })
            : events;
        
        setFilteredRows(filtered);
        
        if (selectedDate) {
            // Compare against both date and dateStr fields to ensure compatibility
            const matchedRow = filtered.find(row => 
                row.date === selectedDate || row.dateStr === selectedDate
            );
            if (matchedRow) {
                setSelectedId(matchedRow.id);
                setSelectedRow(matchedRow);
            } else {
                setSelectedId(null);
                setSelectedRow(null);
            }
        } else {
            setSelectedId(null);
            setSelectedRow(null);
        }
    }, [search, events, selectedDate]);

    const handleEdit = () => {
        setIsEditing(!isEditing);
    };

    const handleDelete = async () => {
  if (!selectedId) return;
  try {
    await deleteDoc(doc(db, "events", selectedId));
    setSelectedId(null);
    setSelectedRow(null);
    if (onRefresh) onRefresh();
  } catch (error) {
    console.error("Failed to delete event:", error);
  }
};

    const handleRowClick = (params) => {
        if (selectedId === params.id) {
            setSelectedId(null);
            setSelectedRow(null);
        } else {
            setSelectedId(params.id);
            setSelectedRow(params.row);
        }
    };

    return (
        <>
            <div className='calendar-heading'>Events Table</div>
            <Paper sx={{ height: 400, width: '100%' }}>
                <DataGrid
                    rows={filteredRows}
                    columns={columns}
                    editMode="row"
                    getRowId={(row) => row.id}
                    initialState={{
                        pagination: { paginationModel: { page: 0, pageSize: 5 } },
                        sorting: { sortModel: [{ field: 'date', sort: 'asc' }] },
                    }}
                    pageSizeOptions={[5, 10]}
                    onRowClick={handleRowClick}
                    getRowClassName={(params) => 
                        params.id === selectedId ? 'selected-row' : ''
                    }
                    sx={{
                        border: 0,
                        '& .MuiDataGrid-row': {
                            cursor: 'pointer',
                        },
                        '& .selected-row': {
                            backgroundColor: 'rgba(25, 118, 210, 0.08)',
                            '&:hover': {
                                backgroundColor: 'rgba(25, 118, 210, 0.12)'
                            }
                        }
                    }}
                />
            </Paper>
           
            {selectedId && (
                <>
                    <Button
                        variant="outlined"
                        onClick={handleEdit}
                        sx={{ mt: 2 }}
                    >
                        Edit
                    </Button>
                    <Button
                        variant="outlined"
                        color="error"
                        onClick={handleDelete}
                        sx={{ mt: 2 }}
                    >
                        Delete
                    </Button>
                </>
            )}
           
            {isEditing && selectedRow && (
                <EventEditDialog
                    id={selectedId}
                    date={selectedRow.date}
                    event={selectedRow["event-name"]}
                    location={selectedRow.location}
                    open={isEditing}
                    onClose={() => {
                        setIsEditing(false);
                        onRefresh(); // ✅ correct
                    }}

                />
            )}
        </>
    );
}