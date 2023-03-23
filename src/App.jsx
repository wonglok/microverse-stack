import {
  createBrowserRouter,
  RouterProvider,
  // Route,
  Link,
} from "react-router-dom";
import { MetaApp } from "./components/canvas/MetaApp/MetaApp";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MetaApp></MetaApp>,
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
  let error = useRouteError();
  console.error(error);
  // Uncaught ReferenceError: path is not defined
  return <div>Dang! {JSON.stringify(error)}</div>;
}

export default function App() {
  return (
    <>
      <RouterProvider fallbackElement={<div>Error</div>} router={router} />
    </>
  );
}
