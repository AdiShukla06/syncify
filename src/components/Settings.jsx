import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { deleteUser } from 'firebase/auth';
import { auth } from '../firebase-config'; 
import { setTheme, clearUser } from '../redux/authSlice'; 
import { doc, deleteDoc, arrayRemove, updateDoc, getDoc } from "firebase/firestore";
import { firestore } from '../firebase-config';
import { motion } from 'framer-motion';

const SettingsPage = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const theme = useSelector((state) => state.auth.theme); 
  const currentProject = useSelector((state) => state.project.currentProject);
  const [isLeader, setIsLeader] = useState(false); 
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false); 
  const [passkey, setPasskey] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (currentProject && user) {
      const checkLeader = async () => {
        const projectDocRef = doc(firestore, 'projects', currentProject.id);
        const projectDoc = await getDoc(projectDocRef);

        if (projectDoc.exists()) {
          const projectData = projectDoc.data();
          if (projectData.members[0] === user.uid) {
            setIsLeader(true); 
            setPasskey(projectData.passkey || ''); 
          }
        }
      };

      checkLeader();
    }
  }, [dispatch, currentProject, user]);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    dispatch(setTheme(newTheme)); 
  };

  const confirmDeleteAccount = async () => {
    try {
      if (user && currentProject) {
        const projectDocRef = doc(firestore, 'projects', currentProject.id);
        const projectDoc = await getDoc(projectDocRef);

        if (projectDoc.exists()) {
          const projectData = projectDoc.data();
          const members = projectData.members || [];

          if (members.length === 1) {
            await deleteDoc(projectDocRef);
          } else {
            await updateDoc(projectDocRef, {
              members: arrayRemove(user.uid),
            });
          }
        }

        await deleteUser(auth.currentUser);
        dispatch(clearUser());
        await deleteDoc(doc(firestore, 'users', user.uid));
        navigate('/login');
      }
    } catch (error) {
      console.error('Error deleting account:', error);
    }
  };

  const deleteProject = async () => {
    try {
      if (currentProject) {
        const projectDocRef = doc(firestore, 'projects', currentProject.id);
        await deleteDoc(projectDocRef);
        navigate('/chooseprojectpage'); 
      }
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  return (
    <motion.div 
      className={`settings-page p-6 min-h-screen ${theme === 'light' ? 'bg-gray-100 text-gray-900' : 'bg-gray-900 text-gray-100'}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h2 
        className="text-4xl font-bold mb-8 text-center"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        Settings
      </motion.h2>
      
      <motion.div 
        className="theme-toggle mb-8"
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        <h3 className="text-2xl font-semibold mb-4">Toggle Theme</h3>
        <button 
          onClick={toggleTheme} 
          className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600 transition duration-300 ease-in-out"
        >
          Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
        </button>
      </motion.div>
      
      <motion.div 
        className="account-deletion mb-8"
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.6 }}
      >
        <h3 className="text-2xl font-semibold mb-4">Delete Account</h3>
        <p className="mb-4 text-gray-400">Warning: This action cannot be undone.</p>
        <button 
          onClick={() => setShowDeleteConfirm(true)} 
          className="px-6 py-3 bg-red-500 text-white rounded-lg shadow-lg hover:bg-red-600 transition duration-300 ease-in-out"
        >
          Delete Account
        </button>
      </motion.div>

      {isLeader && (
        <>
          <motion.div 
            className="project-info mb-8"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 1.0, duration: 0.6 }}
          >
            <h3 className="text-2xl font-semibold mb-4">Project Information</h3>
            <p className="mb-2 text-gray-400">Project ID: <span className="font-medium text-gray-100">{currentProject.id}</span></p>
            <p className="mb-4 text-gray-400">Passkey: <span className="font-medium text-gray-100">{passkey}</span></p>
          </motion.div>
          
          <motion.div 
            className="project-deletion"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <h3 className="text-2xl font-semibold mb-4">Delete Project</h3>
            <p className="mb-4 text-gray-400">Warning: This will delete the entire project and cannot be undone.</p>
            <button 
              onClick={deleteProject} 
              className="px-6 py-3 bg-red-500 text-white rounded-lg shadow-lg hover:bg-red-600 transition duration-300 ease-in-out"
            >
              Delete Project
            </button>
          </motion.div>
        </>
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className={`p-6 rounded-lg shadow-lg  ${theme == 'light' ? 'bg-white text-black' : 'bg-black text-white'}`}>
            <h3 className="text-xl font-semibold mb-4">Are you sure you want to delete your account?</h3>
            <div className="flex justify-end">
              <button 
                onClick={() => setShowDeleteConfirm(false)} 
                className="px-4 py-2 mr-2 bg-gray-300 text-gray-800 rounded-lg shadow hover:bg-gray-400 transition duration-300 ease-in-out"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDeleteAccount} 
                className="px-4 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 transition duration-300 ease-in-out"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default SettingsPage;
