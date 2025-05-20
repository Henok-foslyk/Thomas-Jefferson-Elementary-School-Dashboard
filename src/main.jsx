import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import App from './App'
import ClassesDashboard from './routes/ClassesDashboard';
import ErrorFallBack from './components/ErrorFallBack';
import Class from './routes/Class'

const router = createBrowserRouter([
  {path: "/", element: <App />, errorElement: <ErrorFallBack />},
  {path: "/classes", element: <ClassesDashboard />, errorElement: <ErrorFallBack />},
  {path: "/class/:id", element: <Class id='id'/>}
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);


