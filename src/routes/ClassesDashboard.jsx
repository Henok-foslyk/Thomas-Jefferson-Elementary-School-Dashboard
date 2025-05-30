import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { collection, doc, getDocs, addDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

import Navbar from "../components/Navbar";
import "../styles/ClassesDashboard.css";

function ClassesDashboard() {
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState({});
  const [filteredTeachers, setFilteredTeachers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newClassName, setNewClassName] = useState("");
  const [newLocation, setNewLocation] = useState("");
  const [newTeacherId, setNewTeacherId] = useState("");

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const classSnapshot = await getDocs(collection(db, "classes"));
        const classData = classSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const teacherSnapshot = await getDocs(collection(db, "teachers"));
        const teacherData = {};
        teacherSnapshot.docs.forEach((doc) => {
          teacherData[doc.id] = doc.data().first + " " + doc.data().last;
        });

        const filteredTeachersData = {};
        teacherSnapshot.docs.forEach((doc) => {
          if (doc.data().class == null) {
            filteredTeachersData[doc.id] = doc.data().first + " " + doc.data().last;
          }
        });

        setFilteredTeachers(filteredTeachersData);
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

  const handleAddClass = async (e) => {
    e.preventDefault();
    if (!newClassName || !newLocation || !newTeacherId) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      const class_id = await addDoc(collection(db, "classes"), {
        name: newClassName,
        location: newLocation,
        teacher_id: newTeacherId,
        student_ids: [],
      });

      await updateDoc(doc(db, "teachers", newTeacherId), {
        class: class_id.id,
      });

      setNewClassName("");
      setNewLocation("");
      setNewTeacherId("");

      window.location.reload();
    } catch (err) {
      console.error("Error adding class:", err);
      alert("Failed to add class.");
    }
  };

  return (
    <div>
      <Navbar />
      <h5>Classes</h5>
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
      ) : classes.length > 0 ? (
        classes.map((item) => (
          <Link key={item.id} to={`/class/${item.id}`}>
            <div className="classesRow">
              <p className="classesCenter">{item.name}</p>
              <p className="classesCenter">{teachers[item.teacher_id]}</p>
              <p className="classesCenter">{item.student_ids.length}</p>
              <p className="classesCenter">{item.location}</p>
            </div>
          </Link>
        ))
      ) : (
        <p className="classesCenter">No classes available</p>
      )}
      <h1 className="classesCenter">Add New Class</h1>
      <form onSubmit={handleAddClass} className="classesCenter">
        <div className="classesForm">
          <input
            className="classesTextField"
            type="text"
            placeholder="Class Name"
            value={newClassName}
            onChange={(e) => setNewClassName(e.target.value)}
          />
          <input
            className="classesTextField"
            type="text"
            placeholder="Location"
            value={newLocation}
            onChange={(e) => setNewLocation(e.target.value)}
          />
          <select
            className="classesSelect"
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
          <button className="classesButton" type="submit">
            Add Class
          </button>
        </div>
      </form>
    </div>
  );
}

export default ClassesDashboard;
