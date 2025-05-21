import React from 'react'
import { useState, useEffect} from 'react'
import { Link, useParams, useNavigate } from "react-router-dom";

import { collection, query, doc, getDocs, getDoc, addDoc, updateDoc, increment, orderBy } from "firebase/firestore";
import { db } from "../firebase";

import Navbar from '../components/Navbar'
import '../styles/EditGrade.css'

function EditGrade() {
    const { assignment_id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [assignment, setAssignment] = useState(null);
    const [newName, setNewName] = useState("");
    const [newGrade, setNewGrade] = useState("");

    useEffect(() => {
        const fetchAssignment = async () => {
            try {
                const assignmentSnapshot = await getDoc(doc(db, "assignments", assignment_id));
                const assignmentData = assignmentSnapshot.data();

                setNewName(assignmentData.name);
                setNewGrade(assignmentData.grade);
                setAssignment(assignmentData);
                setLoading(false);
            } catch (e) {
                console.log("Error loading assginment: ", e);
                setError(true);
            }
            
        }
        fetchAssignment();
    }, [])

    const handleEditGrade = async (e) => {
        e.preventDefault();
        try {
            await updateDoc(doc(db, "assignments", assignment_id), {
                name: newName,
                grade: parseFloat(newGrade)
            });
            navigate(`/grades/${assignment.class_id}/${assignment.student_id}`);
        } catch (err) {
            console.error("Error updating grade:", err);
            alert("Failed to update grade.");
        }
    }

    return (
        <>
            <Navbar/>
            {loading ? (
                <p className="editGradeCenter">Loading assignment...</p>
            ) : error ? (
                <p className="editGradeCenter">{error}</p>
            ) : (
                <div className="editGradeContainer">
                    <h1>Edit Grade</h1>
                    <form onSubmit={handleEditGrade} className="editGradeForm">
                        <p className="formLabel">Assignment Name</p>
                        <input
                            className="editGradeInput"
                            type="text"
                            placeholder="Name"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                        />
                        <p className="formLabel">Grade</p>
                        <input
                            className="editGradeInput"
                            type="number"
                            placeholder="Grade"
                            value={newGrade}
                            onChange={(e) => setNewGrade(e.target.value)}
                        />
                        <button className="editGradeButton" type="submit">Update Grade</button>
                    </form>
                </div>
                )
            }
        </>
    )
}

export default EditGrade