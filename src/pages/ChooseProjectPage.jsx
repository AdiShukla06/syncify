// src/pages/ChooseProjectPage.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addProject, setCurrentProject, setProjects } from '../redux/projectSlice';
import { getFirestore, doc, setDoc, getDoc, updateDoc, getDocs, collection, query, where, arrayUnion } from 'firebase/firestore';
import { auth } from '../firebase-config';

const ChooseProjectPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [hasProjects, setHasProjects] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showJoinForm, setShowJoinForm] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [joinProjectId, setJoinProjectId] = useState('');
  const [joinProjectPasskey, setJoinProjectPasskey] = useState('');
  const [error, setError] = useState('');
  const [projects, setProjectsState] = useState([]);

  const firestore = getFirestore();

  // Fetch user projects
  useEffect(() => {
    const fetchProjects = async () => {
      if (!auth.currentUser) return; // Ensure user is logged in

      const userId = auth.currentUser.uid;
      const projectsQuery = query(collection(firestore, 'projects'), where('members', 'array-contains', userId));
      const querySnapshot = await getDocs(projectsQuery);
      const projectsList = querySnapshot.docs.map(doc => doc.data());
      setProjectsState(projectsList);
      setHasProjects(projectsList.length > 0);

      // Dispatch the list of projects to Redux
      dispatch(setProjects(projectsList));
    };

    fetchProjects();
  }, [firestore, dispatch]);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      const projectId = Date.now().toString();
      const passkey = Math.random().toString(36).slice(2);

      await setDoc(doc(firestore, 'projects', projectId), {
        name: projectName,
        description: projectDescription,
        id: projectId,
        passkey: passkey,
        members: [auth.currentUser.uid],
      });

      // Dispatch the new project to Redux
      dispatch(addProject({ id: projectId, name: projectName }));
      dispatch(setCurrentProject({ id: projectId }));

      // Fetch the updated list of projects
      const userId = auth.currentUser.uid;
      const projectsQuery = query(collection(firestore, 'projects'), where('members', 'array-contains', userId));
      const querySnapshot = await getDocs(projectsQuery);
      const projectsList = querySnapshot.docs.map(doc => doc.data());
      dispatch(setProjects(projectsList));  // Update the project list in Redux

      navigate('/dashboard');
    } catch (err) {
      setError('Error creating project');
    }
  };

  const handleJoinProject = async (e) => {
    e.preventDefault();
    try {
      const projectRef = doc(firestore, 'projects', joinProjectId);
      const projectDoc = await getDoc(projectRef);

      if (!projectDoc.exists()) {
        setError('Project ID not found');
        return;
      }

      if (projectDoc.data().passkey !== joinProjectPasskey) {
        setError('Invalid passkey');
        return;
      }

      await updateDoc(projectRef, {
        members: arrayUnion(auth.currentUser.uid)
      });

      dispatch(setCurrentProject(projectDoc.data()));
      navigate('/dashboard');
    } catch (err) {
      console.error('Error joining project:', err);
      setError('Error joining project');
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Choose Project</h1>
      
      {hasProjects && (
        <>
          <button onClick={() => (setShowCreateForm((prev) => !prev))} className="btn">Create New Project</button>
          <button onClick={() => setShowJoinForm((prev) => !prev)} className="btn">Join Existing Project</button>
        </>
      )}

      {showCreateForm && (
        
        <form onSubmit={handleCreateProject} className="space-y-4">
          <h2 className="text-xl font-semibold">Create New Project</h2>
          <div>
            <label htmlFor="projectName" className="block text-sm font-medium text-gray-700">Project Name</label>
            <input
              type="text"
              id="projectName"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="projectDescription" className="block text-sm font-medium text-gray-700">Project Description</label>
            <textarea
              id="projectDescription"
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              required
            />
          </div>
          <button type="submit" className="btn">Create Project</button>
          {error && <p className="text-red-500">{error}</p>}
        </form>
      )}

      {showJoinForm && (
        <form onSubmit={handleJoinProject} className="space-y-4">
          <h2 className="text-xl font-semibold">Join Existing Project</h2>
          <div>
            <label htmlFor="joinProjectId" className="block text-sm font-medium text-gray-700">Project ID</label>
            <input
              type="text"
              id="joinProjectId"
              value={joinProjectId}
              onChange={(e) => setJoinProjectId(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="joinProjectPasskey" className="block text-sm font-medium text-gray-700">Passkey</label>
            <input
              type="password"
              id="joinProjectPasskey"
              value={joinProjectPasskey}
              onChange={(e) => setJoinProjectPasskey(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              required
            />
          </div>
          <button type="submit" className="btn">Join Project</button>
          {error && <p className="text-red-500">{error}</p>}
        </form>
      )}

      {hasProjects && (
        <div>
          <h2 className="text-xl font-semibold">Your Projects</h2>
          <ul className="space-y-2">
            {projects.map(project => (
              <li key={project.id} className="border p-4 rounded">
                <h3 className="text-lg font-bold">{project.name}</h3>
                <p>{project.description}</p>
                <button
                  onClick={() => {
                    dispatch(setCurrentProject(project));
                    navigate('/dashboard');
                  }}
                  className="btn mt-2"
                >
                  Open Project
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ChooseProjectPage;
