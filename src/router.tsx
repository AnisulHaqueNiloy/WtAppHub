import { createBrowserRouter } from "react-router-dom";
import Signup from "./Signup";
import Login from "./Login";
import ParentLayout from "./ParentLayout";
import Dashboard from "./Dashboard/Dashboard";
import DashboardLayout from "./Dashboard/DashboardLayout";
import Analytics from "./Dashboard/Analytics";
import History from "./Dashboard/History";
import PrivateRoute from "./PrivateRoute";
import AuthProvider from "./AuthContext/AuthProvider";
export const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthProvider>
      <ParentLayout></ParentLayout>
    </AuthProvider>,
    children: [
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "/",
        element: <Signup />,
      },
      {
        element: <PrivateRoute />, // auth guard
        children: [
          {
            path: "dashboard",
            element: <DashboardLayout />,
            children: [
              {
                index: true,
                element: <Dashboard />,
              },
              {
                path: "analytics",
                element: <Analytics />,
              },
              {
                path: "history",
                element: <History />,
              },
            ],
          },
        ],
      },
    ],
  },
]);
