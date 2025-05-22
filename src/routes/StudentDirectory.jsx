import { Box, Container, Typography, Pagination } from "@mui/material";
import { useEffect, useState, useMemo } from "react";
import { db } from "../firebase";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";

import "../styles/StudentDirectory.css";
import "../styles/global.css";
import Navbar from "../components/Navbar.jsx";
import SearchBar from "../components/SearchBar";
import StudentTable from "../components/student_directory/StudentTable.jsx";
import NewStudent from "../components/student_directory/NewStudent.jsx";
import EditStudent from "../components/student_directory/EditStudent.jsx";
import DeleteStudent from "../components/student_directory/DeleteStudent.jsx";

export default function StudentDirectory() {
  const [studentsData, setStudentsData] = useState([]);
  const [assignmentsData, setAssignmentsData] = useState([]);
  const [classesData, setClassesData] = useState([]);
  const [teachersData, setTeachersData] = useState([]);

  const [sortConfig, setSortConfig] = useState({ key: "last", direction: "asc" });

  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);

  const [toEdit, setEditStudent] = useState(null);
  const [toDelete, setToDelete] = useState(null);

  const rowsPerPage = 20;

  // Fetch students data from database
  useEffect(() => {
    async function fetchData() {
      // Fetch students, assignments, classes, and teachers data from database
      const [studSnap, assignSnap, classSnap, teachSnap] = await Promise.all([
        getDocs(collection(db, "students")),
        getDocs(collection(db, "assignments")),
        getDocs(collection(db, "classes")),
        getDocs(collection(db, "teachers")),
      ]);

      setStudentsData(studSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      setAssignmentsData(assignSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      setClassesData(classSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      setTeachersData(teachSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    }
    fetchData();
  }, []);

  // Memoized students with final grades
  const gradedStudents = useMemo(() => {
    return studentsData.map((student) => {
      // Grab all that student's assignments
      const studentAssign = assignmentsData.filter((a) => a.student_id === student.id);

      // Group by class_id
      const byClass = studentAssign.reduce((acc, a) => {
        const cls = a.class_id;
        acc[cls] = acc[cls] || [];
        acc[cls].push(a.grade);
        return acc;
      }, {});

      // Compute each class's avg
      const classAverages = Object.entries(byClass).map(([cid, grades]) => ({
        classId: cid,
        avg: grades.reduce((s, g) => s + g, 0) / grades.length,
      }));

      // Calculate finalGrade
      const finalGrade =
        classAverages.length > 0
          ? classAverages.reduce((s, c) => s + c.avg, 0) / classAverages.length
          : null;

      // Find the classes this student is in
      const studentClasses = classesData
        .filter((c) => Array.isArray(c.student_ids) && c.student_ids.includes(student.id))
        .map((c) => {
          const classAvg = classAverages.find((x) => x.classId === c.id);
          const teacher = teachersData.find((t) => t.id === c.teacher_id);
          const teacherFullName = teacher ? `${teacher.last}, ${teacher.first}` : "—";

          return {
            className: c.name,
            teacherFullName,
            avgGrade: classAvg?.avg ?? null,
          };
        })
        // Sort by teacher’s last name
        .sort((a, b) => a.teacherFullName.localeCompare(b.teacherFullName));

      return {
        ...student,
        finalGrade,
        classes: studentClasses,
      };
    });
  }, [studentsData, assignmentsData, classesData, teachersData]);

  // Update finalGrade in database when it changes
  useEffect(() => {
    gradedStudents.forEach(({ id, finalGrade }) => {
      // Find the original student data
      const original = studentsData.find((s) => s.id === id);
      if (!original) return;

      // Only update if finalGrade really changed
      if (original.finalGrade !== finalGrade) {
        const ref = doc(db, "students", id);
        // UpdateDoc will set finalGrade to number or null
        updateDoc(ref, { finalGrade }).catch((err) =>
          console.error("Failed to update finalGrade for", id, err)
        );
      }
    });
  }, [gradedStudents, studentsData]);

  // Memoized sorted students
  const sortedStudents = useMemo(() => {
    const sorted = [...gradedStudents];

    sorted.sort((a, b) => {
      let aKey = a[sortConfig.key];
      let bKey = b[sortConfig.key];

      // Sort by birthdate
      if (sortConfig.key === "dateOfBirth") {
        aKey = aKey ? new Date(aKey).getTime() : 0;
        bKey = bKey ? new Date(bKey).getTime() : 0;
      }

      // Numeric-sort for year and finalGrade
      if (sortConfig.key === "year" || sortConfig.key === "finalGrade") {
        // When sorting, treat year === 0 or "K" as 0 so Kindergarten comes first
        const parseVal = (v) => (v === "K" || v === 0 ? 0 : Number(v));

        aKey = parseVal(aKey);
        bKey = parseVal(bKey);
      }

      if (aKey < bKey) return sortConfig.direction === "asc" ? -1 : 1;
      if (aKey > bKey) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [sortConfig, gradedStudents]);

  // Memoized filtered students
  const filteredStudents = useMemo(() => {
    if (!searchQuery) return sortedStudents;
    const q = searchQuery.toLowerCase();

    return sortedStudents.filter((s) =>
      Object.values(s).some((val) => String(val).toLowerCase().includes(q))
    );
  }, [searchQuery, sortedStudents]);

  // Memoized paginated students
  const paginatedStudents = useMemo(() => {
    const start = (page - 1) * rowsPerPage;

    return filteredStudents.slice(start, start + rowsPerPage);
  }, [page, filteredStudents]);

  // Sorting handler
  function handleSort(key) {
    setSortConfig((prev) => {
      if (key !== "dateOfBirth") {
        return {
          key,
          direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
        };
      }

      // Sort by dateOfBirth or birthdayUpcoming
      if (prev.key !== "dateOfBirth") {
        return { key: "dateOfBirth", direction: "asc" };
      }
      if (prev.direction === "asc") {
        return { key: "dateOfBirth", direction: "desc" };
      }

      // If already sorted by dateOfBirth, sort by birthdayUpcoming
      return { key: "birthdayUpcoming", direction: "asc" };
    });
  }

  return (
    <>
      <Navbar />

      <Container maxWidth="lg">
        <Typography variant="h5" align="center" gutterBottom>
          Students
        </Typography>

        <Box className="search-bar-container">
          <SearchBar
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
          />
        </Box>

        <NewStudent setStudents={setStudentsData} />

        <StudentTable
          rows={paginatedStudents}
          sortConfig={sortConfig}
          onSort={handleSort}
          onEdit={(student) => setEditStudent(student)}
          onDelete={(student) => setToDelete(student)}
        />

        <EditStudent
          student={toEdit}
          onClose={() => setEditStudent(null)}
          setStudents={setStudentsData}
        />

        <DeleteStudent
          student={toDelete}
          open={Boolean(toDelete)}
          onClose={() => setToDelete(null)}
          onDeleted={(id) => {
            setStudentsData((prev) => prev.filter((s) => s.id !== id));
          }}
        />

        <Box className="pagination-container">
          <Pagination
            count={Math.ceil(filteredStudents.length / rowsPerPage)}
            page={page}
            onChange={(_, value) => setPage(value)}
            showFirstButton
            showLastButton
            size="small"
          />
        </Box>
      </Container>
    </>
  );
}
