import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { Container, Grid } from "@mui/material";

import "../../styles/Calendar.css";

export default function Calendar() {
  return (
    <>
      <Container className="calender-container">
        <div className="calendar-heading">Events Calendar</div>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateCalendar />
        </LocalizationProvider>
      </Container>
    </>
  );
}
