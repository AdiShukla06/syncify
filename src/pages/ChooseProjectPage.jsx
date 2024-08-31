import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addProject, setCurrentProject, setProjects } from '../redux/projectSlice';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  getDocs,
  collection,
  query,
  where,
  arrayUnion
} from 'firebase/firestore';
import { auth } from '../firebase-config';
import BackgroundImage from '../assets/landingpageimages/bg2.jpg';

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
  const [deadline, setDeadline] = useState(null)

  const firestore = getFirestore();

  useEffect(() => {
    const fetchProjects = async () => {
      if (!auth.currentUser) return;

      const userId = auth.currentUser.uid;
      const projectsQuery = query(collection(firestore, 'projects'), where('members', 'array-contains', userId));
      const querySnapshot = await getDocs(projectsQuery);
      const projectsList = querySnapshot.docs.map((doc) => doc.data());
      setProjectsState(projectsList);
      setHasProjects(projectsList.length > 0);

      dispatch(setProjects(projectsList));
    };

    fetchProjects();
  }, [firestore, dispatch]);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      const projectId = Date.now().toString();
      const passkey = Math.random().toString(36).slice(2);

      const newProject = {
        name: projectName,
        description: projectDescription,
        id: projectId,
        passkey: passkey,
        members: [auth.currentUser.uid],
        leader: auth.currentUser.displayName,
        deadline: deadline
      };

      await setDoc(doc(firestore, 'projects', projectId), newProject);

      dispatch(addProject(newProject));
      dispatch(setCurrentProject(newProject));

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
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center pt-20 "
      style={{ backgroundImage: `url(${BackgroundImage})` }}
    >
      <div className="bg-white bg-opacity-80 p-8 rounded-lg shadow-lg max-w-md mx-auto mt-12 mb-16">
        <h1 className="text-3xl font-bold mb-6 text-center">Choose Project</h1>

        {!hasProjects && (
          <div className="flex flex-col space-y-4">
            <button
              onClick={() => {
                setShowCreateForm((prev) => !prev);
                setShowJoinForm(false);
              }}
              className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300"
            >
              Create New Project
            </button>
            <button
              onClick={() => {
                setShowJoinForm((prev) => !prev);
                setShowCreateForm(false);
              }}
              className="bg-green-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-green-700 transition duration-300"
            >
              Join Existing Project
            </button>
          </div>
        )}

        {showCreateForm && (
          <form onSubmit={handleCreateProject} className="space-y-4 mt-6">
            <h2 className="text-xl font-semibold">Create New Project</h2>
            <div>
              <label htmlFor="projectName" className="block text-sm font-medium text-gray-700">
                Project Name
              </label>
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
              <label htmlFor="projectDescription" className="block text-sm font-medium text-gray-700">
                Project Description
              </label>
              <textarea
                id="projectDescription"
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                required
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300"
            >
              Create Project
            </button>
            {error && <p className="text-red-500">{error}</p>}
          </form>
        )}

        {showJoinForm && (
          <form onSubmit={handleJoinProject} className="space-y-4 mt-6">
            <h2 className="text-xl font-semibold">Join Existing Project</h2>
            <div>
              <label htmlFor="joinProjectId" className="block text-sm font-medium text-gray-700">
                Project ID
              </label>
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
              <label htmlFor="joinProjectPasskey" className="block text-sm font-medium text-gray-700">
                Passkey
              </label>
              <input
                type="password"
                id="joinProjectPasskey"
                value={joinProjectPasskey}
                onChange={(e) => setJoinProjectPasskey(e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                required
              />
            </div>
            <button
              type="submit"
              className="bg-green-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-green-700 transition duration-300"
            >
              Join Project
            </button>
            {error && <p className="text-red-500">{error}</p>}
          </form>
        )}

        {hasProjects && (
          <div className="mt-6">
            <button
              onClick={() => {
                setShowCreateForm((prev) => !prev);
                setShowJoinForm(false);
              }}
              className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300 w-full mb-4"
            >
              Create New Project
            </button>
            <button
              onClick={() => {
                setShowJoinForm((prev) => !prev);
                setShowCreateForm(false);
              }}
              className="bg-green-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-green-700 transition duration-300 w-full mb-4"
            >
              Join Existing Project
            </button>
            <h2 className="text-xl font-semibold mb-4">Your Projects</h2>
            <ul className="space-y-4">
              {projects.map((project) => (
                <li key={project.id} className="border p-4 rounded-lg shadow-sm bg-white bg-opacity-90">
                  <h3 className="text-lg font-bold">{project.name}</h3>
                  <p>{project.description}</p>
                  <button
                    onClick={() => {
                      dispatch(setCurrentProject(project));
                      navigate('/dashboard');
                    }}
                    className="bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-indigo-700 transition duration-300 mt-2"
                  >
                    Go to Project
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChooseProjectPage;
