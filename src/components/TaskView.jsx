import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getFirestore, collection, addDoc, getDocs } from 'firebase/firestore';
import { setTasks, addTask } from '../redux/tasksSlice';
import { Timestamp } from 'firebase/firestore';

const TaskView = () => {
  const [taskName, setTaskName] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskDeadline, setTaskDeadline] = useState('');
  const [taskStatus, setTaskStatus] = useState('To Do'); // New state for task status
  const tasks = useSelector((state) => state.tasks.allTasks); // Get tasks from Redux store
  const projectId = useSelector((state) => state.project.currentProject.id);
  const firestore = getFirestore();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const tasksSnapshot = await getDocs(collection(firestore, 'projects', projectId, 'tasks'));
        const tasksList = tasksSnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            createdAt: data.createdAt ? data.createdAt.toDate().toISOString() : null,
          };
        });
        dispatch(setTasks(tasksList));  // Update Redux store with serialized tasks
      } catch (err) {
        console.error('Error fetching tasks:', err);
      }
    };

    fetchTasks();
  }, [projectId, firestore, dispatch]);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      const newTask = {
        name: taskName,
        description: taskDescription,
        deadline: taskDeadline,
        status: taskStatus, // Include status in the task object
        createdAt: Timestamp.now(),
      };
      const docRef = await addDoc(collection(firestore, 'projects', projectId, 'tasks'), newTask);
      dispatch(addTask({ id: docRef.id, ...newTask, createdAt: newTask.createdAt.toDate().toISOString() }));
    } catch (err) {
      console.error('Error adding task:', err);
    }
  };

  return (
    <>
      <form onSubmit={handleCreateTask}>
        <input
          type="text"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
          placeholder="Task Name"
          required
        />
        <textarea
          value={taskDescription}
          onChange={(e) => setTaskDescription(e.target.value)}
          placeholder="Task Description"
          required
        />
        <input
          type="date"
          value={taskDeadline}
          onChange={(e) => setTaskDeadline(e.target.value)}
        />
        <select
          value={taskStatus}
          onChange={(e) => setTaskStatus(e.target.value)}
        >
          <option value="To Do">To Do</option>
          <option value="On Going">On Going</option>
          <option value="Completed">Completed</option>
        </select>
        <button type="submit">Create Task</button>
      </form>

      {/* Task List */}
      <div>
        <h3>Tasks</h3>
        <ul>
          {tasks.map((task) => (
            <li key={task.id}>
              <h4>{task.name}</h4>
              <p>{task.description}</p>
              <p>Deadline: {task.deadline}</p>
              <p>Status: {task.status}</p>
              <p>Created At: {task.createdAt}</p>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default TaskView;
