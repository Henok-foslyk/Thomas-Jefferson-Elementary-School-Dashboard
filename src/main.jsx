import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import App from "./App";
import ClassesDashboard from "./routes/ClassesDashboard";
import ErrorFallBack from "./components/ErrorFallBack";
import StudentDirectory from "./routes/StudentDirectory";

const router = createBrowserRouter([
  { path: "/", element: <App />, errorElement: <ErrorFallBack /> },
  { path: "/classes", element: <ClassesDashboard />, errorElement: <ErrorFallBack /> },
  { path: "/students", element: <StudentDirectory />, errorElement: <ErrorFallBack /> },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
