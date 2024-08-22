// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { clearUser } from '../redux/authSlice'; // Redux slice action
import { useAuth } from '../context/AuthContext'; // Context for auth
import Home from '../components/Home';
import TaskView from '../components/TaskView';
import KanbanView from '../components/KanbanView';
import TeamChat from '../components/TeamChat';
import Settings from '../components/Settings';
import Help from '../components/Help';

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState('home');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useAuth(); // Using AuthContext
  const project = useSelector((state) => state.project.currentProject); // Get current project from Redux

  useEffect(() => {
    if (!user) {
      navigate('/login'); // Redirect to login if not authenticated
    }
  }, [user, navigate]);

  const handleLogout = () => {
    dispatch(clearUser()); // Clear user in Redux
    navigate('/login'); // Redirect to login page after logout
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white min-h-screen p-4">
        <h2 className="text-xl font-bold mb-4">Dashboard</h2>
        <nav>
          <ul>
            <li
              onClick={() => setActiveSection('home')}
              className={`cursor-pointer mb-2 p-2 rounded ${activeSection === 'home' ? 'bg-gray-600' : 'hover:bg-gray-600'}`}
            >
              Home
            </li>
            <li
              onClick={() => setActiveSection('taskView')}
              className={`cursor-pointer mb-2 p-2 rounded ${activeSection === 'taskView' ? 'bg-gray-600' : 'hover:bg-gray-600'}`}
            >
              Task View
            </li>
            <li
              onClick={() => setActiveSection('kanbanView')}
              className={`cursor-pointer mb-2 p-2 rounded ${activeSection === 'kanbanView' ? 'bg-gray-600' : 'hover:bg-gray-600'}`}
            >
              Kanban View
            </li>
            <li
              onClick={() => setActiveSection('teamChat')}
              className={`cursor-pointer mb-2 p-2 rounded ${activeSection === 'teamChat' ? 'bg-gray-600' : 'hover:bg-gray-600'}`}
            >
              Team Chat
            </li>
            <li
              onClick={() => setActiveSection('settings')}
              className={`cursor-pointer mb-2 p-2 rounded ${activeSection === 'settings' ? 'bg-gray-600' : 'hover:bg-gray-600'}`}
            >
              Settings
            </li>
            <li
              onClick={() => setActiveSection('help')}
              className={`cursor-pointer mb-2 p-2 rounded ${activeSection === 'help' ? 'bg-gray-600' : 'hover:bg-gray-600'}`}
            >
              Help
            </li>
            <li
              onClick={handleLogout}
              className="cursor-pointer mt-4 p-2 rounded hover:bg-gray-600"
            >
              Logout
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        {activeSection === 'home' && <Home />}
        {activeSection === 'taskView' && <TaskView />}
        {activeSection === 'kanbanView' && <KanbanView />}
        {activeSection === 'teamChat' && <TeamChat />}
        {activeSection === 'settings' && <Settings />}
        {activeSection === 'help' && <Help />}
      </div>
    </div>
  );
};

export default Dashboard;
