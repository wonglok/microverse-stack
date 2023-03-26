import {
  createBrowserRouter,
  RouterProvider,
  // Route,
  Link,
  useRouteError,
} from "react-router-dom";
import { MetaApp } from "./components/canvas/MetaApp/MetaApp";
import { AdminLogin } from "./components/html/AdminLogin/AdminLogin.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MetaApp></MetaApp>,
    errorElement: <ErrorBoundary></ErrorBoundary>,
  },
  {
    path: "/admin",
    element: <AdminLogin></AdminLogin>,
    errorElement: <ErrorBoundary></ErrorBoundary>,
  },
  // {
  //   path: "/smooth",
  //   element: <MetaApp></MetaApp>,
  //   errorElement: <ErrorBoundary></ErrorBoundary>,
  // },
  // {
  //   path: "/quality",
  //   element: <MetaApp mode="quality"></MetaApp>,
  //   errorElement: <ErrorBoundary></ErrorBoundary>,
  // },
]);

function ErrorBoundary() {
  return <div>Dang!</div>;
}

export default function App() {
  return (
    <>
      <RouterProvider fallbackElement={<div>Error</div>} router={router} />
    </>
  );
}
