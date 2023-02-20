import App from "App";
import Camera from "pages/Camera";
import StartUp from "pages/Startup";
import {
  createHashRouter,
  Navigate,
  Outlet,
  RouterProvider,
} from "react-router-dom";

const router = createHashRouter([
  {
    path: "/",
    element: <Outlet />,
    children: [
      {
        path: "",
        element: <Navigate to={"/startup"} />,
      },
      {
        path: "startup",
        index: true,
        element: <StartUp />,
      },
      {
        path: "camera/:id/:distance/:size/:param1/:param2",
        element: <Camera />,
      },
      {
        path: "test",
        element: <App />,
      },
    ],
  },
]);

export default function RouterWrapper() {
  return <RouterProvider router={router} />;
}
