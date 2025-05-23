import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";

import { collection, query, doc, getDocs, getDoc, addDoc, orderBy } from "firebase/firestore";
import { Button } from "@mui/material";
import { db } from "../firebase";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import Navbar from "../components/Navbar";
import "../styles/Grade.css";

function Grade() {
  const { class_id, student_id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [grades, setGrades] = useState(null);
  const [averageGrade, setAverageGrade] = useState(0);
  const [className, setClassName] = useState(null);
  const [studentName, setStudentName] = useState(null);
  const [newName, setNewName] = useState("");
  const [newGrade, setNewGrade] = useState("");

  useEffect(() => {
    const fetchGrades = async () => {
      try {
        const gradesSnapshot = await getDocs(query(collection(db, "assignments"), orderBy("name")));
        const gradesData = gradesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const studentGrades = gradesData.filter(
          (grade) => grade.class_id == class_id && grade.student_id == student_id
        );

        setGrades(studentGrades);

        let avgGrade = 0.0;
        let gradeCount = 0;
        studentGrades.forEach((item) => {
          avgGrade += item.grade;
          gradeCount += 1;
        });

        setAverageGrade(avgGrade / gradeCount);

        const classSnapshot = await getDoc(doc(db, "classes", class_id));
        const classData = classSnapshot.data();

        setClassName(classData.name);

        const studentSnapshot = await getDoc(doc(db, "students", student_id));
        const studentData = studentSnapshot.data();
        setStudentName(studentData.first + " " + studentData.last);

        setLoading(false);
      } catch (e) {
        setError("Error fetching grades: ", e);
        setLoading(false);
      }
    };
    fetchGrades();
  }, [class_id, student_id]);

  const handleAddGrade = async (e) => {
    e.preventDefault();
    try {
      if (!newName || !newGrade) {
        alert("Please fill in both fields.");
        return;
      }

      await addDoc(collection(db, "assignments"), {
        name: newName,
        grade: parseFloat(newGrade),
        class_id: class_id,
        student_id: student_id,
      });

      setNewName("");
      setNewGrade("");

      window.location.reload();
    } catch (err) {
      console.error("Error adding grade: ", err);
      alert("Failed to add grade.");
    }
  };

  return (
    <div>
      <Navbar />
      {loading ? (
        <p className="gradeCenter">Loading classes...</p>
      ) : error ? (
        <p className="gradeCenter">{error}</p>
      ) : grades ? (
        <>
          <div className="gradeCenter">
            <div className="gradeTitleContainer">
              <Link to={`/class/${class_id}`}>
                <Button
                  variant="contained"
                  sx={{ position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)" }}
                >
                  <ArrowBackIcon fontSize="small" sx={{ mr: 1, mb: 0.3 }} />
                  Back
                </Button>
              </Link>
              <h1>
                {className} - {studentName}
              </h1>
            </div>
          </div>
          <div className="gradeHeader">
            <p className="gradeCenter">Assignment</p>
            <p className="gradeCenter">Grade</p>
          </div>
          {grades ? (
            <>
              {grades.map((item) => (
                <Link to={`/grades/edit/${item.id}`}>
                  <div key={item.id} className="gradeRow">
                    <p className="gradeCenter">{item.name}</p>
                    <p className="gradeCenter">{item.grade}</p>
                  </div>
                </Link>
              ))}
              <div className="gradeDivider" />
              <div className="gradeRow">
                <p className="gradeCenter">Total</p>
                <p className="gradeCenter">{averageGrade.toFixed(2)}</p>
              </div>
            </>
          ) : (
            <p className="classesCenter">No grades available</p>
          )}
        </>
      ) : (
        <p className="gradeCenter">No grades available</p>
      )}
      <h1 className="gradeCenter">Add Grade</h1>
      <form onSubmit={handleAddGrade} className="gradeCenter">
        <div className="gradeCenter">
          <input
            className="gradeInput"
            type="text"
            placeholder="Assignment Name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          <input
            className="gradeInput"
            type="number"
            placeholder="Grade"
            value={newGrade}
            onChange={(e) => setNewGrade(e.target.value)}
          />
          <button className="gradeButton" type="submit">
            Add
          </button>
        </div>
      </form>
    </div>
  );
}

export default Grade;
