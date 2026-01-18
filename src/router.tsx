import { createBrowserRouter, } from "react-router-dom";
import Signup from "./Signup";
import Login from "./Login";
import ParentLayout from "./ParentLayout";
import Dashboard from "./Dashboard/Dashboard";
import DashboardLayout from "./Dashboard/DashboardLayout";
import Analytics from "./Dashboard/Analytics";
import History from "./Dashboard/History";
import PrivateRoute from "./PrivateRoute";
import AuthProvider from "./AuthContext/AuthProvider";
import Setting from "./Dashboard/Setting";

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <AuthProvider>
        <ParentLayout />
      </AuthProvider>
    ),
    children: [
      // ১. পাবলিক রুটস (সরাসরি দেখা যাবে)
      {
        index: true, // "/" পাথে থাকলে Signup দেখাবে
        element: <Signup />,
      },
      {
        path: "login",
        element: <Login />,
      },

      // ২. ড্যাশবোর্ড বা প্রাইভেট রুটস
      {
        element: <PrivateRoute />, // এখানে চেক হবে ইউজার লগইন আছে কি না
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
              {
                path: "setting",
                element: <Setting />,
              },
            ],
          },
        ],
      },
    ],
  },
]);