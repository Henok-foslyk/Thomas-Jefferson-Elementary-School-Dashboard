import React from 'react'
import { useState, useEffect} from 'react'
import { Link, useParams, useNavigate } from "react-router-dom";

import { collection, query, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc, increment, orderBy, where } from "firebase/firestore";
import { db } from "../firebase";

import Navbar from '../components/Navbar'
import '../styles/EditClass.css'

function editClass() {
    const { class_id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [classDetails, setClassDetails] = useState(null);
    const [teachers, setTeachers] = useState({});
    const [filteredTeachers, setFilteredTeachers] = useState({});
    const [students, setStudents] = useState({});
    const [newName, setNewName] = useState("");
    const [newLocation, setNewLocation] = useState("");
    const [newStudents, setNewStudents] = useState(null);
    const [newTeacherId, setNewTeacherId] = useState(null);

    useEffect(() => {
        const fetchClass = async () => {
            try {
                const classSnapshot = await getDoc(doc(db, "classes", class_id));
                const classData = classSnapshot.data();

                const teacherSnapshot = await getDocs(collection(db, "teachers"));
                const teacherData = {};
                const filteredTeachersData = {};
                teacherSnapshot.docs.forEach(doc => {
                    teacherData[doc.id] = doc.data().first + " " + doc.data().last;
                    if (doc.data().class == class_id) {
                        filteredTeachersData[doc.id] = doc.data().first + " " + doc.data().last;
                    }
                });

                teacherSnapshot.docs.forEach(doc => {
                    if (doc.data().class == null) {
                        filteredTeachersData[doc.id] = doc.data().first + " " + doc.data().last;
                    }
                });

                const studentSnapshot = await getDocs(collection(db, "students"));
                const studentData = studentSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));

                setFilteredTeachers(filteredTeachersData);
                setStudents(studentData);
                setTeachers(teacherData);
                setNewName(classData.name);
                setNewLocation(classData.location);
                setNewStudents(classData.student_ids);
                setNewTeacherId(classData.teacher_id);
                setClassDetails(classData);
                setLoading(false);
            } catch (e) {
                console.log("Error loading assginment: ", e);
                setError(true);
            }
            
        }
        fetchClass();
    }, [class_id])

    const handleEditClass = async (e) => {
        e.preventDefault();
        try {
            await updateDoc(doc(db, "classes", class_id), {
                name: newName,
                location: newLocation,
                student_ids: newStudents,
                teacher_id: newTeacherId
            });

            await updateDoc(doc(db, "teachers", newTeacherId), {
                class: class_id
            });

            navigate(`/class/${class_id}`);
        } catch (e) {
            console.error("Error updating class:", e);
            alert("Failed to update class.");
        }
    }

    const handleDeleteClass = async (e) => {
        e.preventDefault();
        try {
            await deleteDoc(doc(db, "classes", class_id))
            
            const teacherSnapshot = await getDocs(query(collection(db, "teachers"), where("class", "==", class_id)));

            const updates = teacherSnapshot.docs.map((teacherDoc) =>
                updateDoc(doc(db, "teachers", teacherDoc.id), { class: null })
            );

            await Promise.all(updates);

            navigate(`/classes`)
        } catch (e) {
            console.error("Error deleting class: ", e);
            alert ("Failed to delete class.")
        }
    }

    return (
        <>
            <Navbar/>
            {loading ? (
                <p className="editClassCenter">Loading assignment...</p>
            ) : error ? (
                <p className="editClassCenter">{error}</p>
            ) : (
                <div className="editClassContainer">
                    <h1>Edit Class</h1>
                    <form onSubmit={handleEditClass} className="editClassForm">
                        <p className="formLabel">Name</p>
                        <input
                            className="editClassInput"
                            type="text"
                            placeholder="Class Name"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                        />
                        <p className="formLabel">Location</p>
                        <input
                            className="editClassInput"
                            type="text"
                            placeholder="Location"
                            value={newLocation}
                            onChange={(e) => setNewLocation(e.target.value)}
                        />
                        <p className="formLabel">Teacher</p>
                        <select
                        className="editClassSelect"
                        value={newTeacherId}
                        onChange={(e) => setNewTeacherId(e.target.value)}
                        >
                            <option value="">Select a teacher</option>
                            {Object.entries(filteredTeachers).map(([id, name]) => (
                                <option key={id} value={id}>
                                    {name}
                                </option>
                            ))}
                        </select>
                        <p className="formLabel">Students</p>
                        <select
                            className="editClassSelect"
                            multiple
                            value={newStudents}
                            onChange={(e) => {
                                const selected = Array.from(e.target.selectedOptions, option => option.value);
                                setNewStudents(selected);
                            }}
                            >
                            {students.map((student) => (
                                <option key={student.id} value={student.id}>
                                {student.first} {student.last}
                                </option>
                            ))}
                        </select>
                        <button className="editClassButton" type="submit">Update Class</button>
                        <button className="deleteClassButton" type="button" onClick={handleDeleteClass}>Delete Class</button>
                    </form>
                </div>
                )
            }
        </>
    )
}

export default editClass