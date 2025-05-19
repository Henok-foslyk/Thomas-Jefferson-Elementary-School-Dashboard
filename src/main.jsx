import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import App from "./App";
import ClassesDashboard from "./routes/ClassesDashboard";
import StudentDirectory from "./routes/StudentDirectory";

const router = createBrowserRouter([
  { path: "/", element: <App /> },
  { path: "/classes", element: <ClassesDashboard /> },
  { path: "/students", element: <StudentDirectory /> },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
