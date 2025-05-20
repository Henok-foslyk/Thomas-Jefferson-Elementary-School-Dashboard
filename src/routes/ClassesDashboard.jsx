import React from 'react'
import { useState, useEffect } from 'react'
import { Link } from "react-router-dom";

import Navbar from '../components/Navbar'
import './ClassesDashboard.css'

function ClassesDashboard() {
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchClasses = async () => {
            try {
                // const response = await fetch("link here later");
                // setClasses(response.data);
                // setLoading(false);
            } catch (err) {
                setError("Failed to fetch classes: " + err);
                setLoading(false);
            }
        };
        fetchClasses();
    }, []);

    return (
        <div>
            <Navbar/>
            <h1 className="center">Classes</h1>
            <div className="header">
                <p className="center">Class</p>
                <p className="center">Teacher</p>
                <p className="center">Roster Count</p>
                <p className="center">Location</p>
            </div>

            {loading ? (
                <p className="center">Loading classes...</p>
            ) : error ? (
                <p className="center">{error}</p>
            ) : (
                classes.length > 0 ? (
                classes.map((item, index) => (
                    <div key={item.id} className="row">
                        <p className="center">
                            <Link to={`/class/${item.id}`}>
                                {item.class}
                            </Link>
                        </p>
                        <p className="center">{item.teacher}</p>
                        <p className="center">{item.rosterCount}</p>
                        <p className="center">{item.location}</p>
                    </div>
                ))
                ) : (
                <p className="center">No classes available</p>
                )
            )}
        </div>
    )
}

export default ClassesDashboard