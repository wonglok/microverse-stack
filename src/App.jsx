import {
  createBrowserRouter,
  RouterProvider,
  // Route,
  Link,
  useRouteError,
} from "react-router-dom";
// import { MetaApp } from "./components/canvas/MetaApp/MetaApp";
// import { Admin } from "./components/html/Admin/Admin.jsx";
import { LazyLoad } from "./components/html/LazyLoad/LazyLoad.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <LazyLoad
        lazy={() =>
          import("./components/canvas/MetaApp/MetaApp").then((r) => r.MetaApp)
        }
      ></LazyLoad>
    ),
    errorElement: <ErrorBoundary></ErrorBoundary>,
  },
  {
    path: "/admin",
    element: (
      <LazyLoad
        lazy={() =>
          import("./components/html/Admin/Admin.jsx").then((r) => r.Admin)
        }
      ></LazyLoad>
    ),
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
