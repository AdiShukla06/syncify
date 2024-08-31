import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";
import { setTasks, addTask, updateTask } from "../redux/tasksSlice";
import { Timestamp } from "firebase/firestore";
import BackgroundImage from "../assets/dashboardimages/boxbg.jpg";
import BackgroundImage2 from "../assets/dashboardimages/boxbg2.jpg";
import BackgroundImage3 from "../assets/dashboardimages/boxbg3.jpg";
import BackgroundImage4 from "../assets/dashboardimages/boxbg4.jpg";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { setTheme, clearUser } from '../redux/authSlice'; 


const TaskView = () => {
  const [taskName, setTaskName] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskDeadline, setTaskDeadline] = useState("");
  const [taskStatus, setTaskStatus] = useState("To Do");
  const [editingTask, setEditingTask] = useState(null);
  const tasks = useSelector((state) => state.tasks.allTasks);
  const projectId = useSelector((state) => state.project.currentProject.id);
  const firestore = getFirestore();
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.auth.theme); 


  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const tasksSnapshot = await getDocs(
          collection(firestore, "projects", projectId, "tasks")
        );
        const tasksList = tasksSnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            createdAt: data.createdAt
              ? data.createdAt.toDate().toISOString()
              : null,
          };
        });
        dispatch(setTasks(tasksList));
      } catch (err) {
        console.error("Error fetching tasks:", err);
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
        status: taskStatus,
        createdAt: Timestamp.now(),
      };
      const docRef = await addDoc(
        collection(firestore, "projects", projectId, "tasks"),
        newTask
      );
      dispatch(
        addTask({
          id: docRef.id,
          ...newTask,
          createdAt: newTask.createdAt.toDate().toISOString(),
        })
      );
      resetForm();
    } catch (err) {
      console.error("Error adding task:", err);
    }
  };

  const handleUpdateTask = async (e) => {
    e.preventDefault();
    if (!editingTask) return;

    try {
      const updatedTask = {
        name: taskName,
        description: taskDescription,
        deadline: taskDeadline,
        status: taskStatus,
      };
      const taskRef = doc(
        firestore,
        "projects",
        projectId,
        "tasks",
        editingTask.id
      );
      await updateDoc(taskRef, updatedTask);
      dispatch(updateTask({ id: editingTask.id, updates: updatedTask }));
      resetForm();
    } catch (err) {
      console.error("Error updating task:", err);
    }
  };

  const resetForm = () => {
    setTaskName("");
    setTaskDescription("");
    setTaskDeadline("");
    setTaskStatus("To Do");
    setEditingTask(null);
  };

  const handleEditClick = (task) => {
    setTaskName(task.name);
    setTaskDescription(task.description);
    setTaskDeadline(task.deadline);
    setTaskStatus(task.status);
    setEditingTask(task);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const year = String(date.getFullYear()).slice(-2); // Get last two digits of the year
    return `${day}/${month}/${year}`;
  };

  return (
    <div className={` min-h-screen p-6 ${theme === 'light' ? 'bg-gray-100 text-gray-900' : 'bg-gray-950 text-gray-100'}`}>


      <div className={`max-w-lg mx-auto p-4 rounded-lg shadow-lg border border-gray-700 ${theme === 'light' ? 'bg-gray-200 text-gray-900' : 'bg-black text-gray-100'}`}>
        <h2 className={`text-xl font-semibold  mb-3 lato-bold ${theme === 'light' ? 'bg-gray-200 text-gray-900' : 'bg-black text-gray-100'}` }>
          {editingTask ? "Edit Task" : "Create Task"}
        </h2>
        <form
          onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
          className="space-y-3"
        >
          <input
            type="text"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            placeholder="Task Name"
            required
            className={`w-full p-3 border rounded-lg border-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 transition ${theme === 'light' ? 'bg-gray-100 text-gray-900' : 'bg-gray-900 text-gray-100'}`}
          />
          <textarea
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
            placeholder="Task Description"
            required
            className={`w-full p-3 border rounded-lg border-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 transition ${theme === 'light' ? 'bg-gray-100 text-gray-900' : 'bg-gray-900 text-gray-100'}`}
            rows="3"
          />
          <input
            type="date"
            value={taskDeadline}
            onChange={(e) => setTaskDeadline(e.target.value)}
            className={`w-full p-3 border rounded-lg border-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 transition ${theme === 'light' ? 'bg-gray-100 text-gray-900' : 'bg-gray-900 text-gray-100'}`}
          />
          <select
            value={taskStatus}
            onChange={(e) => setTaskStatus(e.target.value)}
            className={`w-full p-3 border rounded-lg border-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 transition ${theme === 'light' ? 'bg-gray-100 text-gray-900' : 'bg-gray-900 text-gray-100'}`}
          >
            <option value="To Do">To Do</option>
            <option value="On Going">On Going</option>
            <option value="Completed">Completed</option>
          </select>
          <div className="flex gap-3">
            <button
              type="submit"
              className="w-full px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              {editingTask ? "Update Task" : "Create Task"}
            </button>
            {editingTask && (
              <button
                type="button"
                onClick={resetForm}
                className="w-full px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="max-w-6xl mx-auto mt-8">
        <h3 className="text-2xl font-semibold text-white mb-4">Tasks</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="bg-gray-800 p-4 rounded-lg shadow-lg bg-cover bg-center"
              style={{ backgroundImage: `url(${BackgroundImage})` }}
            >
              <h4 className="text-lg font-semibold text-black lato-bold">
                {task.name}
              </h4>
              <p className="text-gray-800 lato-regular">{task.description}</p>
              <p className="text-gray-900 lato-medium">
                Deadline: {formatDate(task.deadline)}
              </p>
              <p className="text-gray-900 lato-medium">Status: {task.status}</p>
              <p className="text-gray-900 lato-medium">
                Created At: {formatDate(task.createdAt)}
              </p>
              <button
                onClick={() => handleEditClick(task)}
                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Edit
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TaskView;
