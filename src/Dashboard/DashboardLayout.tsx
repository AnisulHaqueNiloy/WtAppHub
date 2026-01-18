// import   { useState, useEffect, useContext } from "react";
// import { Outlet, Link, useLocation } from "react-router-dom";
// import {
//   LayoutDashboard,
//   History,
//   BarChart3,
//   LogOut,
//   MessageSquare,
//   Menu,
//   X,
// } from "lucide-react";
// import { authContext } from "../AuthContext/AuthProvider";

// const DashboardLayout = () => {
//   const location = useLocation();
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const authCtx = useContext(authContext);
//   const logout = authCtx?.logout || (() => {});
//   const user = authCtx?.user
//   console.log(user)

//   // Path change hole auto sidebar bondho hoye jabe (Mobile view-r jonno)
//   useEffect(() => {
//     setIsSidebarOpen(false);
//   }, [location.pathname]);

//   const menuItems = [
//     {
//       name: "Dashboard",
//       path: "/dashboard",
//       icon: <LayoutDashboard size={20} />,
//     },
//     {
//       name: "History",
//       path: "/dashboard/history",
//       icon: <History size={20} />,
//     },
//     {
//       name: "Analytics",
//       path: "/dashboard/analytics",
//       icon: <BarChart3 size={20} />,
//     },
//     {
//       name: "Setting",
//       path: "/dashboard/setting",
//       icon: <BarChart3 size={20} />,
//     },
//   ];

//   return (
//     <div className="flex min-h-screen bg-[#F1F5F9]">
//       {/* --- Mobile Header Bar (Only visible on Mobile) --- */}
//       <header className="lg:hidden fixed top-0 left-0 right-0 bg-[#0F172A] text-white p-4 flex justify-between items-center z-50 shadow-md">
//         <div className="flex items-center gap-2">
//           <div className="bg-blue-600 p-1.5 rounded-lg">
//             <MessageSquare size={18} />
//           </div>
//           <span className="font-bold tracking-tight">WtAppHub</span>
//         </div>
//         <button
//           onClick={() => setIsSidebarOpen(!isSidebarOpen)}
//           className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
//         >
//           {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
//         </button>
//       </header>

//       {/* --- Mobile Overlay (Click to close) --- */}
//       {isSidebarOpen && (
//         <div
//           className="lg:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm transition-opacity"
//           onClick={() => setIsSidebarOpen(false)}
//         />
//       )}

//       {/* --- Sidebar (Responsive) --- */}
//       <aside
//         className={`
//         fixed h-full w-72 bg-[#0F172A] text-slate-300 p-6 flex flex-col z-[45]
//         shadow-2xl transition-transform duration-300 ease-in-out
//         ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
//         lg:translate-x-0 lg:z-30
//       `}
//       >
//         {/* Logo Section */}
//         <div className="hidden lg:flex items-center gap-3 px-2 mb-12">
//           <div className="bg-blue-600 p-2 rounded-lg text-white">
//             <MessageSquare size={24} />
//           </div>
//           <h2 className="text-xl font-bold text-white tracking-tight">
//             WtAppHub
//           </h2>
//         </div>

//         {/* Navigation Links */}
//         <nav className="flex-1 space-y-2 mt-16 lg:mt-0">
//           {menuItems.map((item) => (
//             <Link
//               key={item.path}
//               to={item.path}
//               className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 group ${
//                 location.pathname === item.path
//                   ? "bg-blue-600 text-white shadow-lg shadow-blue-900/50 font-semibold"
//                   : "hover:bg-slate-800 hover:text-white"
//               }`}
//             >
//               {item.icon}
//               <span className="font-medium tracking-wide">{item.name}</span>
//             </Link>
//           ))}
//         </nav>

//         {/* Footer Info & Sign Out */}
//         <div className="mt-auto border-t border-slate-800 pt-6">
//           <div className="px-4 py-4 bg-slate-800/40 rounded-2xl mb-4 border border-slate-800/50 backdrop-blur-md">
//             <p className="text-[10px] uppercase font-black text-slate-500 mb-1 tracking-widest">
//               Active Account
//             </p>
//             <p className="text-sm font-bold text-blue-400">01631484734</p>
//           </div>
//           <button onClick={() => logout()} className="flex items-center gap-4 px-4 py-3 w-full rounded-xl hover:bg-red-500/10 hover:text-red-500 transition-all text-slate-400 group">
//             <LogOut
//               size={20}
//               className="group-hover:translate-x-1 transition-transform"
//             />
//             <span className="font-bold">Sign Out</span>
//           </button>
//         </div>
//       </aside>

//       {/* --- Main Content Area (Responsive Margin) --- */}
//       <main
//         className={`
//         flex-1 transition-all duration-300
//         mt-16 lg:mt-0 
//         lg:ml-72 p-4 md:p-8 lg:p-10
//       `}
//       >
//         <div className="max-w-7xl mx-auto">
//           <Outlet />
//         </div>
//       </main>
//     </div>
//   );
// };

// export default DashboardLayout;
import { useState, useEffect, useContext } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  History,
  BarChart3,
  LogOut,
  MessageSquare,
  Menu,
  X,
  Smartphone,
} from "lucide-react";
import { authContext } from "../AuthContext/AuthProvider";
import { useGetSessionStatusQuery } from "../redux/features/settings/settingApi";


const DashboardLayout = () => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const authCtx = useContext(authContext);
  const logout = authCtx?.logout || (() => {});
  
  // API Call
  const { data: session } = useGetSessionStatusQuery();

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: <LayoutDashboard size={20} /> },
    { name: "History", path: "/dashboard/history", icon: <History size={20} /> },
    { name: "Analytics", path: "/dashboard/analytics", icon: <BarChart3 size={20} /> },
    { name: "Setting", path: "/dashboard/setting", icon: <BarChart3 size={20} /> },
  ];

  return (
    <div className="flex min-h-screen bg-[#F1F5F9]">
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 bg-[#0F172A] text-white p-4 flex justify-between items-center z-50 shadow-md">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-1.5 rounded-lg">
            <MessageSquare size={18} />
          </div>
          <span className="font-bold tracking-tight">WtAppHub</span>
        </div>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-slate-800 rounded-lg transition-colors">
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm transition-opacity" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed h-full w-72 bg-[#0F172A] text-slate-300 p-6 flex flex-col z-[45] shadow-2xl transition-transform duration-300 ease-in-out ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:z-30`}>
        {/* Logo Section */}
        <div className="hidden lg:flex items-center gap-3 px-2 mb-12">
          <div className="bg-blue-600 p-2 rounded-lg text-white">
            <MessageSquare size={24} />
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">WtAppHub</h2>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 space-y-2 mt-16 lg:mt-0">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 group ${
                location.pathname === item.path
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-900/50 font-semibold"
                  : "hover:bg-slate-800 hover:text-white"
              }`}
            >
              {item.icon}
              <span className="font-medium tracking-wide">{item.name}</span>
            </Link>
          ))}
        </nav>

        {/* Footer Info & Sign Out (Active Account Box) */}
        <div className="mt-auto border-t border-slate-800 pt-6">
          <div className="px-4 py-4 bg-slate-800/40 rounded-2xl mb-4 border border-slate-800/50 backdrop-blur-md">
            <div className="flex items-center justify-between mb-1">
              <p className="text-[10px] uppercase font-black text-slate-500 tracking-widest">
                Active Account
              </p>
              {/* Dot Status Indicator */}
              <div className={`h-1.5 w-1.5 rounded-full ${session?.status === 'connected' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
            </div>
            
            <p className={`text-sm font-bold ${session?.status === 'connected' ? 'text-blue-400' : 'text-slate-500'}`}>
              {session?.number || "Disconnected"}
            </p>
          </div>

          <button onClick={() => logout()} className="flex items-center gap-4 px-4 py-3 w-full rounded-xl hover:bg-red-500/10 hover:text-red-500 transition-all text-slate-400 group">
            <LogOut size={20} className="group-hover:translate-x-1 transition-transform" />
            <span className="font-bold">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 transition-all duration-300 mt-16 lg:mt-0 lg:ml-72 p-4 md:p-8 lg:p-10">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;