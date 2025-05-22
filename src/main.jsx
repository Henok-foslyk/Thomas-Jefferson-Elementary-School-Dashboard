import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import App from "./App";
import ClassesDashboard from "./routes/ClassesDashboard";
import Calendar from "./routes/CalendarDashboard";
import StudentDirectory from "./routes/StudentDirectory";
import Teachers from "./routes/TeacherDirectory";
import Grades from "./routes/Grades";
import EditClass from "./routes/EditClass";

import ErrorFallBack from "./components/ErrorFallBack";

const router = createBrowserRouter([
  { path: "/", element: <App />, errorElement: <ErrorFallBack /> },
  { path: "/classes", element: <ClassesDashboard />, errorElement: <ErrorFallBack /> },
  { path: "/calendar", element: <Calendar />, errorElement: <ErrorFallBack /> },
  { path: "/students", element: <StudentDirectory />, errorElement: <ErrorFallBack /> },
  { path: "/teachers", element: <Teachers />, errorElement: <ErrorFallBack /> },
  { path: "/grades", element: <Grades />, errorElement: <ErrorFallBack /> },
  { path: "/editclass", element: <EditClass />, errorElement: <ErrorFallBack /> }
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
