import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { deleteUser } from 'firebase/auth';
import { auth } from '../firebase-config'; 
import { setTheme } from '../redux/authSlice'; 
import { doc, deleteDoc, arrayRemove, updateDoc, getDoc} from "firebase/firestore";
import {clearUser} from '../redux/authSlice';
import {firestore} from '../firebase-config';

const SettingsPage = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const currentTheme = useSelector((state) => state.auth.theme);
  const [theme, setThemeState] = useState(currentTheme);
  const navigate = useNavigate();

  const currentProject = useSelector((state) => state.project.currentProject);

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme') || 'light';
    setThemeState(storedTheme);
    dispatch(setTheme(storedTheme)); // Initialize theme in Redux state
  }, [dispatch]);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setThemeState(newTheme);
    localStorage.setItem('theme', newTheme);
    dispatch(setTheme(newTheme)); // Update theme in the Redux state
  };

  const deleteAccount = async () => {
    try {
      if (user && currentProject) {
        // Reference to the project document where the member needs to be removed
        const projectDocRef = doc(firestore, 'projects', currentProject.id);
  
        // Get the project document to check the number of members
        const projectDoc = await getDoc(projectDocRef);
  
        if (projectDoc.exists()) {
          const projectData = projectDoc.data();
          const members = projectData.members || [];
  
          if (members.length === 1) {
            // If only one member, delete the entire project
            await deleteDoc(projectDocRef);
          } else {
            // If more than one member, just remove the user from the 'members' array
            await updateDoc(projectDocRef, {
              members: arrayRemove(user.uid),
            });
          }
        }
  
        // Delete the current user from Firebase Authentication
        await deleteUser(auth.currentUser);
  
        // Clear user in Redux
        dispatch(clearUser());
  
        // Delete user document from Firestore
        await deleteDoc(doc(firestore, 'users', user.uid));
  
        // Redirect to the login page
        navigate('/login');
      }
    } catch (error) {
      console.error('Error deleting account:', error);
    }
  };
  

  return (
    <div className="settings-page">
      <h2>Settings</h2>
      
      <div className="theme-toggle">
        <h3>Toggle Theme</h3>
        <button onClick={toggleTheme}>
          Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
        </button>
      </div>
      
      <div className="account-deletion">
        <h3>Delete Account</h3>
        <p>Warning: This action cannot be undone.</p>
        <button onClick={deleteAccount} className="delete-button">
          Delete Account
        </button>
      </div>
    </div>
  );
};

export default SettingsPage;
