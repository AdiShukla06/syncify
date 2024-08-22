// src/pages/KanbanView.jsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getFirestore, collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { setTasks, updateTask } from '../redux/tasksSlice';

const KanbanView = () => {
  const dispatch = useDispatch();
  const tasks = useSelector((state) => state.tasks.allTasks);
  const projectId = useSelector((state) => state.project.currentProject.id);
  const firestore = getFirestore();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const tasksSnapshot = await getDocs(collection(firestore, 'projects', projectId, 'tasks'));
        const tasksList = tasksSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt.toDate().toISOString(),
        }));
        dispatch(setTasks(tasksList));
      } catch (err) {
        console.error('Error fetching tasks:', err);
      }
    };

    fetchTasks();
  }, [projectId, firestore, dispatch]);

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const taskRef = doc(firestore, 'projects', projectId, 'tasks', taskId);
      await updateDoc(taskRef, { status: newStatus });
      dispatch(updateTask({ id: taskId, updates: { status: newStatus } }));
    } catch (err) {
      console.error('Error updating task status:', err);
    }
  };

  const renderTasks = (status) => {
    return tasks
      .filter((task) => task.status === status)
      .map((task) => (
        <div key={task.id} className="task-card">
          <h3>{task.name}</h3>
          <p>{task.description}</p>
          <p>Deadline: {task.deadline}</p>
          <p>Status: {task.status}</p>
          <select
            value={task.status}
            onChange={(e) => handleStatusChange(task.id, e.target.value)}
          >
            <option value="To Do">To Do</option>
            <option value="On Going">On Going</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      ));
  };

  return (
    <div className="kanban-board">
      <div className="kanban-column">
        <h2>To Do</h2>
        {renderTasks('To Do')}
      </div>
      <div className="kanban-column">
        <h2>On Going</h2>
        {renderTasks('On Going')}
      </div>
      <div className="kanban-column">
        <h2>Completed</h2>
        {renderTasks('Completed')}
      </div>
    </div>
  );
};

export default KanbanView;
