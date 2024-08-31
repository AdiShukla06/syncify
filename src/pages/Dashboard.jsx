import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearUser } from "../redux/authSlice"; // Redux slice action
import { useAuth } from "../context/AuthContext"; // Context for auth
import Home from "../components/Home";
import TaskView from "../components/TaskView";
import KanbanView from "../components/KanbanView";
import TeamChat from "../components/TeamChat";
import Settings from "../components/Settings";
import Help from "../components/Help";
import logo from "../assets/syncifybg.png";

// Import Lucide icons
import {
  HomeIcon as Homeicon,
  List as TaskIcon,
  Kanban,
  MessageSquare as ChatIcon,
  Settings as SettingsIcon,
  HelpCircle as HelpIcon,
  LogOut as LogoutIcon,
} from "lucide-react";

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState("home");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useAuth(); // Using AuthContext
  const project = useSelector((state) => state.project.currentProject);
  const theme = useSelector((state) => state.auth.theme);

  useEffect(() => {
    if (!user) {
      navigate("/login"); // Redirect to login if not authenticated
    }
  }, [user, navigate]);

  const handleLogout = () => {
    dispatch(clearUser()); // Clear user in Redux
    navigate("/login"); // Redirect to login page after logout
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <div
        className={`w-56    min-h-screen p-4 shadow-lg h-screen sticky top-0  ${
          theme === "light"
            ? "bg-gray-100 text-gray-900"
            : "bg-gray-950 text-gray-100"
        }`}
      >
        {/* Logo */}
        <div className="flex items-center justify-center">
          <img src={logo} alt="Syncify Logo" className="w-20 h-20" />
        </div>
        <nav>
          <ul className="space-y-2">
            <li
              onClick={() => setActiveSection("home")}
              className={`cursor-pointer p-3 rounded-md flex items-center space-x-3 transition-colors duration-200 ${
                activeSection === "home"
                  ? theme === "light"
                    ? "bg-gray-300 text-gray-900"
                    : "bg-gray-800 text-gray-100"
                  : theme === "light"
                  ? "hover:bg-gray-300 hover:text-gray-900"
                  : "hover:bg-gray-800 hover:text-gray-100"
              }`}
            >
              <Homeicon className="w-5 h-5" />
              <span>Home</span>
            </li>
            <li
              onClick={() => setActiveSection("taskView")}
              className={`cursor-pointer p-3 rounded-md flex items-center space-x-3 transition-colors duration-200 ${
                activeSection === "taskView"
                  ? theme === "light"
                    ? "bg-gray-300 text-gray-900"
                    : "bg-gray-800 text-gray-100"
                  : theme === "light"
                  ? "hover:bg-gray-300 hover:text-gray-900"
                  : "hover:bg-gray-800 hover:text-gray-100"
              }`}
            >
              <TaskIcon className="w-5 h-5" />
              <span>Task View</span>
            </li>
            <li
              onClick={() => setActiveSection("kanbanView")}
              className={`cursor-pointer p-3 rounded-md flex items-center space-x-3 transition-colors duration-200 ${
                activeSection === "kanbanView"
                  ? theme === "light"
                    ? "bg-gray-300 text-gray-900"
                    : "bg-gray-800 text-gray-100"
                  : theme === "light"
                  ? "hover:bg-gray-300 hover:text-gray-900"
                  : "hover:bg-gray-800 hover:text-gray-100"
              }`}
            >
              <Kanban className="w-5 h-5" />
              <span>Kanban View</span>
            </li>
            <li
              onClick={() => setActiveSection("teamChat")}
              className={`cursor-pointer p-3 rounded-md flex items-center space-x-3 transition-colors duration-200 ${
                activeSection === "teamChat"
                  ? theme === "light"
                    ? "bg-gray-300 text-gray-900"
                    : "bg-gray-800 text-gray-100"
                  : theme === "light"
                  ? "hover:bg-gray-300 hover:text-gray-900"
                  : "hover:bg-gray-800 hover:text-gray-100"
              }`}
            >
              <ChatIcon className="w-5 h-5" />
              <span>Team Chat</span>
            </li>
            <li
              onClick={() => setActiveSection("settings")}
              className={`cursor-pointer p-3 rounded-md flex items-center space-x-3 transition-colors duration-200 ${
                activeSection === "settings"
                  ? theme === "light"
                    ? "bg-gray-300 text-gray-900"
                    : "bg-gray-800 text-gray-100"
                  : theme === "light"
                  ? "hover:bg-gray-300 hover:text-gray-900"
                  : "hover:bg-gray-800 hover:text-gray-100"
              }`}
            >
              <SettingsIcon className="w-5 h-5" />
              <span>Settings</span>
            </li>
            <li
              onClick={() => setActiveSection("help")}
              className={`cursor-pointer p-3 rounded-md flex items-center space-x-3 transition-colors duration-200 ${
                activeSection === "help"
                  ? theme === "light"
                    ? "bg-gray-300 text-gray-900"
                    : "bg-gray-800 text-gray-100"
                  : theme === "light"
                  ? "hover:bg-gray-300 hover:text-gray-900"
                  : "hover:bg-gray-800 hover:text-gray-100"
              }`}
            >
              <HelpIcon className="w-5 h-5" />
              <span>Help</span>
            </li>
            <li
              onClick={handleLogout}
              className={`cursor-pointer p-3 rounded-md mt-4 flex items-center space-x-3 transition-colors duration-200 ${
                theme === "light"
                  ? "hover:bg-gray-300 hover:text-gray-900"
                  : "hover:bg-gray-800 hover:text-gray-100"
              }`}
            >
              <LogoutIcon className="w-5 h-5" />
              <span>Logout</span>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
        {activeSection === "home" && <Home />}
        {activeSection === "taskView" && <TaskView />}
        {activeSection === "kanbanView" && <KanbanView />}
        {activeSection === "teamChat" && <TeamChat />}
        {activeSection === "settings" && <Settings />}
        {activeSection === "help" && <Help />}
      </div>
    </div>
  );
};

export default Dashboard;
