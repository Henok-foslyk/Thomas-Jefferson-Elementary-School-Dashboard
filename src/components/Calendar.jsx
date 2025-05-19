import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { Container } from '@mui/material';

export default function Calendar() {
    return (
        <>
            <Container>
                <div className='calendar-heading'>test</div>
                 <LocalizationProvider dateAdapter={AdapterDayjs}>
                 <DateCalendar />
                </LocalizationProvider>
            </Container>
           
        </>
        
    );
}