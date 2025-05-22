import { Dialog, TextField, Button, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, Container } from "@mui/material"
import React, { useEffect, useState } from "react"

export default function EventEditDialog({ id, date, event, location, open, onClose }) {


    useEffect(() => {
        console.log("Dialog opened with id:", id);
    }, [id]);

    return (
        <>
            <Dialog open={open} onClose={onClose}>
                <DialogContent>
                    <DialogContentText>
                        Editing the {event} event located at {location}, scheduled for {date}
                    </DialogContentText><br></br>
                        <Container>
                            <TextField 
                                autoFocus 
                                margin="dense"
                                label="Event"
                                defaultValue={event} 
                                fullWidth 
                                variant="standard"
                            />
                            <TextField 
                                autoFocus 
                                margin="dense"
                                label="Location"
                                defaultValue={location} 
                                fullWidth 
                                variant="standard"
                            />
                            <TextField 
                                autoFocus 
                                margin="dense"
                                label="Date"
                                defaultValue={date}
                                type="date"
                                fullWidth 
                                variant="standard"
                            />
                        </Container>
                            
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>
                        Cancel
                    </Button>
                    <Button>
                        Save
                    </Button>
                </DialogActions>
            </Dialog>

        </>
    )
}