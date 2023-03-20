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
  },
  {
    path: "/smooth",
    element: <MetaApp></MetaApp>,
  },
  {
    path: "/quality",
    element: <MetaApp mode="quality"></MetaApp>,
  },
]);

export default function App() {
  return (
    <>
      <RouterProvider fallbackElement={<div>Error</div>} router={router} />
    </>
  );
}
