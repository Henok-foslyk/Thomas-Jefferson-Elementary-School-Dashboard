import React from 'react'
import { useState, useEffect } from 'react'
import { Link } from "react-router-dom";

import { collection, query, doc, getDocs, addDoc, updateDoc, increment, orderBy } from "firebase/firestore";
import { db } from "../firebase";

import Navbar from '../components/Navbar'
import './ClassesDashboard.css'

function ClassesDashboard() {
    const [classes, setClasses] = useState([]);
    const [teachers, setTeachers] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const classSnapshot = await getDocs(collection(db, "classes"));
                const classData = classSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));

                const teacherSnapshot = await getDocs(collection(db, "teachers"));
                const teacherData = {};
                teacherSnapshot.docs.forEach(doc => {
                    teacherData[doc.id] = doc.data().first + " " + doc.data().last;
                });

                setClasses(classData);
                setTeachers(teacherData);
                setLoading(false);
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
            <h1 className="classesCenter">Classes</h1>
            <div className="classesHeader">
                <p className="classesCenter">Class</p>
                <p className="classesCenter">Teacher</p>
                <p className="classesCenter">Roster Count</p>
                <p className="classesCenter">Location</p>
            </div>

            {loading ? (
                <p className="classesCenter">Loading classes...</p>
            ) : error ? (
                <p className="classesCenter">{error}</p>
            ) : (
                classes.length > 0 ? (
                classes.map((item, index) => (
                    <div key={item.id} className="classesRow">
                        <p className="classesCenter">
                            <Link to={`/class/${item.id}`}>
                                {item.name}
                            </Link>
                        </p>
                        <p className="classesCenter">{teachers[item.teacher_id]}</p>
                        <p className="classesCenter">{item.student_ids.length}</p>
                        <p className="classesCenter">{item.location}</p>
                    </div>
                ))
                ) : (
                <p className="classesCenter">No classes available</p>
                )
            )}
        </div>
    )
}

export default ClassesDashboard