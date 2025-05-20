import React from 'react'

import Navbar from '../components/Navbar'
import Calendar from '../components/Calendar';
import NewEvent from '../components/NewEvent';

function CalendarDashboard() {
    return (
        <>
            <Navbar />
            <Calendar />
            <NewEvent />
        </>
    );
}

export default CalendarDashboard