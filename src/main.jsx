import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import App from './App'
import ClassesDashboard from './routes/ClassesDashboard';
import Calendar from "./routes/CalendarDashboard";
import Students from "./routes/StudentDirectory";
import Class from './routes/Class'

import ErrorFallBack from "./components/ErrorFallBack";

const router = createBrowserRouter([
  {path: "/", element: <App />, errorElement: <ErrorFallBack />},
  {path: "/classes", element: <ClassesDashboard />, errorElement: <ErrorFallBack />},
  {path: "/class/:id", element: <Class id='id'/>, errorElement: <ErrorFallBack />},
  { path: "/calendar", element: <Calendar />, errorElement: <ErrorFallBack /> },
  { path: "/students", element: <Students />, errorElement: <ErrorFallBack /> },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
