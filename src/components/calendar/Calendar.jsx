import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar, PickersDay } from '@mui/x-date-pickers';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Badge, IconButton } from '@mui/material';
import { useState } from 'react';
import { collection, addDoc } from "firebase/firestore";
import { db } from '../../firebase';
import dayjs from 'dayjs';
import ClearIcon from '@mui/icons-material/Clear';
import "../../styles/Calendar.css";

export default function Calendar({ dates = [], onDateSelect }) {
    const [value, setValue] = useState(null);
    const [isSelected, setIsSelected] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [eventName, setEventName] = useState('');
    const [location, setLocation] = useState('');

    const handleChange = (newValue) => {
        const dateStr = dayjs(newValue).format('YYYY-MM-DD');
        if (value && dayjs(value).isSame(newValue, 'day')) {
            setValue(null);
            setIsSelected(false);
            onDateSelect(null);
        } else {
            setValue(newValue);
            setIsSelected(true);
            onDateSelect(dateStr);
        }
    };

    const handleUnselectDate = () => {
        setValue(null);
        setIsSelected(false);
        onDateSelect(null);
    };

    const CustomDay = (props) => {
        const { day, ...other } = props;
        const formattedDay = day.format('YYYY-MM-DD');
        const hasEvent = dates.includes(formattedDay);

        return (
            <Badge
                overlap="circular"
                color="secondary"
                variant={hasEvent ? 'dot' : 'standard'}
                data-testid={`day-${formattedDay}`}
            >
                <PickersDay {...other} day={day} />
            </Badge>
        );
    };

    const handleAddEventClick = () => {
        setOpenDialog(true);
    };

    const handleDialogClose = () => {
        setOpenDialog(false);
        setEventName('');
        setLocation('');
    };

    const handleSubmitEvent = async () => {
        if (!value) return;
        
        try {
            const eventDate = dayjs(value).format('YYYY-MM-DD');
            await addDoc(collection(db, "events"), {
                date: eventDate,
                "event-name": eventName,
                location: location
            });
            handleDialogClose();
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    };

    return (
        <>
            <div className='calendar-heading'>Find by Date</div>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateCalendar 
                    value={value} 
                    onChange={handleChange}
                    slots={{ day: CustomDay }}
                />
            </LocalizationProvider>
            
            {isSelected && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '16px' }}>
                    <Button 
                        variant="outlined" 
                        onClick={handleAddEventClick}
                    >
                        Add Event
                    </Button>
                    <IconButton 
                        onClick={handleUnselectDate}
                    >
                    </IconButton>
                </div>
            )}
            
            <Dialog open={openDialog} onClose={handleDialogClose}>
                <DialogTitle>
                    Add Event for {value ? dayjs(value).format('MMMM D, YYYY') : ''}
                </DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Event Name"
                        fullWidth
                        value={eventName}
                        onChange={(e) => setEventName(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        label="Location"
                        fullWidth
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        label="Date"
                        fullWidth
                        value={value ? dayjs(value).format('YYYY-MM-DD') : ''}
                        InputProps={{
                            readOnly: true,
                        }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose}>Cancel</Button>
                    <Button onClick={handleSubmitEvent}>Add</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
