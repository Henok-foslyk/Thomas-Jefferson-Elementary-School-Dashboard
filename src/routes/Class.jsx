import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";

import { collection, doc, getDocs, getDoc } from "firebase/firestore";
import { Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import { db } from "../firebase";

import Navbar from "../components/Navbar";
import "../styles/Class.css";

function Class() {
  const { id } = useParams();
  const [classInfo, setClassInfo] = useState(null);
  const [teachers, setTeachers] = useState(null);
  const [students, setStudents] = useState(null);
  const [averageGrade, setAverageGrade] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const classSnapshot = await getDoc(doc(db, "classes", id));
        const classData = classSnapshot.data();

        const teacherSnapshot = await getDocs(collection(db, "teachers"));
        const teacherData = {};
        teacherSnapshot.docs.forEach((doc) => {
          teacherData[doc.id] = doc.data().first + " " + doc.data().last;
        });

        setClassInfo(classData);
        setTeachers(teacherData);

        const studentSnapshot = await getDocs(collection(db, "students"));
        const studentData = studentSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const filteredStudents = studentData.filter((student) =>
          classData.student_ids.map(String).includes(String(student.id))
        );

        const gradesSnapshot = await getDocs(collection(db, "assignments"));
        const gradesData = gradesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        let avgGrade = 0.0;
        let gradeCount = 0;
        gradesData.forEach((item) => {
          if (
            item.class_id == id &&
            classData.student_ids.map(String).includes(String(item.student_id))
          ) {
            avgGrade += item.grade;
            gradeCount += 1;
          }
        });

        setAverageGrade((avgGrade / gradeCount).toFixed(2));

        const studentsWithGrades = filteredStudents.map((student) => {
          const studentGrades = gradesData.filter(
            (grade) => grade.class_id == id && grade.student_id == student.id
          );

          let avgGrade = 0.0;
          let gradeCount = 0;
          studentGrades.forEach((item) => {
            avgGrade += item.grade;
            gradeCount += 1;
          });

          return {
            ...student,
            grade: gradeCount !== 0 ? (avgGrade / gradeCount).toFixed(2) : "N/A",
          };
        });

        setStudents(studentsWithGrades);

        setLoading(false);
      } catch (err) {
        setError("Failed to fetch data: " + err);
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  return (
    <div>
      <Navbar />
      {loading ? (
        <p className="classCenter">Loading classes...</p>
      ) : error ? (
        <p className="classCenter">{error}</p>
      ) : classInfo ? (
        <>
          <div className="classCenter">
            <div className="classTitleContainer">
              <Link to={`/classes`}>
                <Button
                  variant="contained"
                  sx={{ position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)" }}
                >
                  <ArrowBackIcon fontSize="small" sx={{ mr: 1, mb: 0.3 }} />
                  Back
                </Button>
              </Link>
              <h1>{classInfo.name}</h1>
            </div>
          </div>
          <div className="classCenter">
            <div className="classInfo">
              <div>
                <h3 className="noTop">Teacher: {teachers[classInfo.teacher_id]}</h3>
                <h3>Roster Count: {classInfo.student_ids.length}</h3>
                <h3>Location: {classInfo.location}</h3>
                <h3>Average Grade: {averageGrade}</h3>
                <Link to={`/class/edit/${id}`}>
                  <Button variant="contained">
                    <EditIcon fontSize="small" sx={{ mr: 1, mb: 0.3 }} />
                    Edit
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </>
      ) : (
        <p className="classCenter">Invalid class</p>
      )}
      <h1 className="classCenter">Students</h1>
      <div className="classHeader">
        <p className="classCenter">First</p>
        <p className="classCenter">Last</p>
        <p className="classCenter">Year</p>
        <p className="classCenter">Email</p>
        <p className="classCenter">Grade</p>
      </div>

      {loading ? (
        <p className="classCenter">Loading classes...</p>
      ) : error ? (
        <p className="classCenter">{error}</p>
      ) : students.length > 0 ? (
        students.map((item) => (
          <Link to={`/grades/${id}/${item.id}`} key={item.id}>
            <div className="classRow">
              <p className="classCenter">{item.first}</p>
              <p className="classCenter">{item.last}</p>
              <p className="classCenter">{item.year}</p>
              <p className="classCenter">{item.email}</p>
              <p className="classCenter">{item.grade}</p>
            </div>
          </Link>
        ))
      ) : (
        <p className="classesCenter">No students available</p>
      )}
    </div>
  );
}

export default Class;
