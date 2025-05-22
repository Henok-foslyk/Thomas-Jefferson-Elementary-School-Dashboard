import { Dialog, TextField, Button, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material"
import React, { useEffect } from "react"

export default function EventEditDialog({ id }) {
    const [open, setOpen] = useState('false');

    const handleClickOpen = () => {
        setOpen(true);
    };
    
    const handleClose = () => {
        setOpen(false);
    };

    useEffect(() => {
        console.log("Dialog opened with id:", id);
    }, []);

    return (
        <>

        </>
    )
}