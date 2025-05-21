import { Box, Container, Typography, Pagination } from "@mui/material";
import { useEffect, useState, useMemo } from "react";
import { db } from "../firebase";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";

import Navbar from "../components/Navbar.jsx";
import SearchBar from "../components/SearchBar";
import StudentTable from "../components/StudentTable.jsx";
import NewStudentDirectory from "../components/NewStudentDirectory.jsx";
import DeleteStudentDirectory from "../components/DeleteStudentDirectory.jsx";

export default function StudentDirectory() {
  const [studentsData, setStudentsData] = useState([]);
  const [assignmentsData, setAssignmentsData] = useState([]);

  const [sortConfig, setSortConfig] = useState({ key: "last", direction: "asc" });

  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);

  const [toDelete, setToDelete] = useState(null);

  const rowsPerPage = 20;

  // Fetch students data from database
  useEffect(() => {
    async function fetchData() {
      // Fetch students data from database
      const studentSnapshot = await getDocs(collection(db, "students"));
      const students = studentSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setStudentsData(students);

      // Fetch assignments data from database
      const assignmentsSnapshot = await getDocs(collection(db, "assignments"));
      const assignments = assignmentsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAssignmentsData(assignments);
    }
    fetchData();
  }, []);

  const gradedStudents = useMemo(() => {
    return studentsData.map((student) => {
      // Grab all that student's assignments
      const theirs = assignmentsData.filter((a) => a.student_id === student.id);

      // Group by class_id
      const byClass = theirs.reduce((acc, a) => {
        const cls = a.class_id;
        acc[cls] = acc[cls] || [];
        acc[cls].push(a.grade);
        return acc;
      }, {});

      // Compute each class's avg
      const classAverages = Object.values(byClass).map((grades) => {
        return grades.reduce((sum, g) => sum + g, 0) / grades.length;
      });

      // Calculate finalGrade
      const finalGrade =
        classAverages.length > 0
          ? classAverages.reduce((s, a) => s + a, 0) / classAverages.length
          : null;

      return { ...student, finalGrade };
    });
  }, [studentsData, assignmentsData]);

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

      // Numeric-sort for year & enrollmentYear
      if (
        sortConfig.key === "year" ||
        sortConfig.key === "enrollmentYear" ||
        sortConfig.key === "finalGrade"
      ) {
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
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  }

  return (
    <>
      <Navbar />

      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Students
        </Typography>

        <SearchBar
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setPage(1);
          }}
        />

        <NewStudentDirectory students={studentsData} setStudents={setStudentsData} />

        <StudentTable
          rows={paginatedStudents}
          sortConfig={sortConfig}
          onSort={handleSort}
          onDelete={(student) => setToDelete(student)}
        />

        <DeleteStudentDirectory
          student={toDelete}
          open={Boolean(toDelete)}
          onClose={() => setToDelete(null)}
          onDeleted={(id) => {
            setStudentsData((prev) => prev.filter((s) => s.id !== id));
          }}
        />

        <Box display="flex" justifyContent="flex-end" p={2}>
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
