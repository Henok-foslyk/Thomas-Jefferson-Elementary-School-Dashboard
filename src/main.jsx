import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import App from './App'
import ClassesDashboard from './routes/ClassesDashboard';
import Calendar from "./routes/CalendarDashboard";
import Students from "./routes/StudentDirectory";
import Teachers from "./routes/TeacherDirectory";
import Class from './routes/Class'
import Grade from './routes/Grade'

import ErrorFallBack from "./components/ErrorFallBack";

const router = createBrowserRouter([
  { path: "/", element: <App />, errorElement: <ErrorFallBack /> },
  { path: "/classes", element: <ClassesDashboard />, errorElement: <ErrorFallBack /> },
  { path: "/class/:id", element: <Class />, errorElement: <ErrorFallBack /> },
  { path: "/grades/:class_id/:student_id", element: <Grade />, errorElement: <ErrorFallBack /> },
  { path: "/calendar", element: <Calendar />, errorElement: <ErrorFallBack /> },
  { path: "/students", element: <Students />, errorElement: <ErrorFallBack /> },
  { path: "/teachers", element: <Teachers />, errorElement: <ErrorFallBack /> },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
