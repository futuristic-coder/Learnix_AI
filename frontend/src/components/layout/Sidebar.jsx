import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContent";
import {
  LayoutDashboard,
  FileText,
  User,
  LogOut,
  BookOpen,
  X,
} from "lucide-react";

const Sidebar = ({ isSidebarOpen, toggleSidebar }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navLinks = [
    { to: "/dashboard", icon: LayoutDashboard, text: "Dashboard" },
    { to: "/documents", icon: FileText, text: "Documents" },
    { to: "/flashcards", icon: BookOpen, text: "Flashcards" },
    { to: "/profile", icon: User, text: "Profile" },
  ];
  
  return (
    <>
      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 bg-slate-900/50 backdrop-blur-sm lg:hidden z-40 transition-opacity duration-300 ${isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={toggleSidebar}
        aria-hidden="true"
      />
      
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white/90 dark:bg-slate-900/90 backdrop-blur border-r border-slate-200 dark:border-slate-700 shadow-xl transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 transition-transform duration-300 ease-in-out z-50`}
      >
        <div className="flex flex-col h-full">
          {/* Profile */}
          <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-600/30">
                <User size={20} strokeWidth={2} />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                  {user?.username || "User"}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {user?.email || "user@example.com"}
                </p>
              </div>
            </div>
            <button
              onClick={toggleSidebar}
              className="lg:hidden p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <X className="h-5 w-5 text-slate-600 dark:text-slate-400" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={toggleSidebar}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-600/30" : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"}`
                }
              >
                {({ isActive }) => (
                  <>
                    <link.icon
                      size={20}
                      strokeWidth={2}
                      className="transition-transform duration-200"
                    />
                    <span className={`font-medium text-sm ${isActive ? "" : ""}`}>
                      {link.text}
                    </span>
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-slate-200 dark:border-slate-700">
            <button 
              onClick={handleLogout} 
              className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-slate-700 dark:text-slate-300 hover:bg-red-50 dark:hover:bg-slate-800 hover:text-red-600 dark:hover:text-red-400 transition-all duration-200"
            >
              <LogOut size={20} strokeWidth={2} />
              <span className="font-medium text-sm">Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
