import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { doc, getDoc } from 'firebase/firestore';
import { firestore } from '../firebase-config';

const Home = () => {
  const project = useSelector((state) => state.project.currentProject); // Get current project from Redux
  const tasks = useSelector((state) => state.tasks.allTasks); // Get tasks from Redux
  const [leaderName, setLeaderName] = useState('');

  useEffect(() => {
    const fetchLeaderName = async () => {
      if (project) {
        const leaderDocRef = doc(firestore, 'projects', project.id);
        const leaderDoc = await getDoc(leaderDocRef);

        if (leaderDoc.exists()) {
          const leaderData = leaderDoc.data();
          setLeaderName(leaderData.leader || 'Unknown Leader');
        }
      }
    };

    fetchLeaderName();
  }, [project]);

  // Ensure project is defined before accessing its properties
  if (!project) {
    return <div>Loading project data...</div>;
  }

  // Calculate task counts
  const totalTasks = tasks.length;
  const remainingTasks = tasks.filter(task => task.status !== 'Completed').length;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Project Info</h1>
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold">Project Name: {project.name}</h2>
        <p>Description: {project.description}</p>
        <p>Leader: {leaderName || 'Unknown Leader'}</p> {/* Directly display the leader's name */}
        <p>Deadline: {project.deadline || 'Not set'}</p>
        <div className="mt-4">
          <h3 className="text-lg font-semibold">Task Overview</h3>
          <p>Total Tasks: {totalTasks}</p>
          <p>Remaining Tasks: {remainingTasks}</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
