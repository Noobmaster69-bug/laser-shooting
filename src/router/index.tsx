import StartUp from "pages/Startup";
import { createHashRouter, Outlet, RouterProvider } from "react-router-dom";

const router = createHashRouter([
  {
    path: "",
    element: <Outlet />,
    children: [
      {
        path: "",
        index: true,
        element: <StartUp />,
      },
    ],
  },
]);

export default function RouterWrapper() {
  return <RouterProvider router={router} />;
}
