import React from 'react';
import { useState, useEffect } from 'react';
import { Link, useParams } from "react-router-dom";

import Navbar from '../components/Navbar'
import './Class.css'

function Class() {
    const { id } = useParams();
    const [classInfo, setClassInfo] = useState(null);
    const [students, setStudents] = useState(null);
    const [averageGrade, setAverageGrade] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
    const fetchClasses = async () => {
        try {
            // const response = await fetch("link here later");
            // setClass(response.data);
            // setLoading(false);

            // mock data
            setClassInfo(
                { "id": 0, "class": "Math 101", "teacher": "Mr. Smith", "rosterCount": 30, "location": "Room 1" },
            )
            setLoading(false);

        } catch (err) {
            setError("Failed to fetch classes: " + err);
            setLoading(false);
        }
    };
    fetchClasses();
    }, [id]);

    useEffect(() => {
    const fetchStudents = async () => {
        try {
            // const response = await fetch("link here later");
            // setClass(response.data);
            // setLoading(false);

            // mock data
            setClassInfo(
                { "id": 0, "class": "Math 101", "teacher": "Mr. Smith", "rosterCount": 30, "location": "Room 1" },
            )
            setLoading(false);

        } catch (err) {
            setError("Failed to fetch students: " + err);
            setLoading(false);
        }
    };
    fetchStudents();
    }, [id]);

    useEffect(() => {
    const fetchAverageGrade = async () => {
        try {
            // const response = await fetch("link here later");
            // setClass(response.data);
            // setLoading(false);

            // mock data
            setClassInfo(
                { "id": 0, "class": "Math 101", "teacher": "Mr. Smith", "rosterCount": 30, "location": "Room 1" },
            )
            setLoading(false);

        } catch (err) {
            setError("Failed to fetch students: " + err);
            setLoading(false);
        }
    };
    fetchAverageGrade();
    }, [students]);

    return (
        <div>
            <Navbar/>
            <h1 className="center">Classes</h1>
            {loading ? (
                <p className="center">Loading classes...</p>
            ) : error ? (
                <p className="center">{error}</p>
            ) : (
                classInfo ? (
                    <div className="center">
                        <div className="classInfo">
                            <div>
                                <h3>Teacher: {classInfo.teacher}</h3>
                                <h3>Roster Count: {classInfo.rosterCount}</h3>
                                <h3>Location: {classInfo.location}</h3>
                                <h3>Average Grade: {averageGrade}</h3>
                            </div>
                        </div>
                    </div>
                ) : (
                <p className="center">Invalid class</p>
                )
            )}

            <div className="header">
                <p className="center">First</p>
                <p className="center">Last</p>
                <p className="center">Year</p>
                <p className="center">Email</p>
                <p className="center">Grade</p>
            </div>

            {loading ? (
                <p className="center">Loading classes...</p>
            ) : error ? (
                <p className="center">{error}</p>
            ) : (
                students ? (
                    <div className="center">
                        <div className="">
                            <div>
                                <h3>Teacher: {classInfo.teacher}</h3>
                                <h3>Roster Count: {classInfo.rosterCount}</h3>
                                <h3>Location: {classInfo.location}</h3>
                                <h3>Average Grade: {averageGrade}</h3>
                            </div>
                        </div>
                    </div>
                ) : (
                <p className="center">Invalid class</p>
                )
            )}
        </div>
    );
}

export default Class;
