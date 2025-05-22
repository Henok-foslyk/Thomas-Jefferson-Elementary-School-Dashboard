import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { Button, Container, Grid } from '@mui/material';
import { useState } from 'react';

import "../../styles/Calendar.css";

export default function Calendar({ search }) {
    const [value, setValue] = useState(null);
    const [isSelected, setIsSelected] = useState(false);

    const handleChange = (newValue) => {
        setValue(newValue);
        setIsSelected(true);
    }

    const handleAddEvent = () => {
        console.log(value);
    }

    return (
        <>
           
                <div className='calendar-heading'>Find by Date</div>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateCalendar onChange={(newValue) => handleChange(newValue)}/>
                </LocalizationProvider>
                {isSelected && (
                    <Button onClick={handleAddEvent()}>Add Event</Button>
                )}
            
           
        </>
        
    );
}