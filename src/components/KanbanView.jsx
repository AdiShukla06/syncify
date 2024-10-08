import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getFirestore, collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { setTasks, updateTask } from '../redux/tasksSlice';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import './KanbanView.css';
import BackgroundImage from '../assets/dashboardimages/boxbg.jpg'; 
import BackgroundImage2 from '../assets/dashboardimages/boxbg2.jpg'; 
import BackgroundImage3 from '../assets/dashboardimages/boxbg3.jpg'; 
import BackgroundImage4 from '../assets/dashboardimages/boxbg4.jpg'; 
import { setTheme, clearUser } from '../redux/authSlice'; 

const KanbanView = () => {
  const dispatch = useDispatch();
  const tasks = useSelector((state) => state.tasks.allTasks);
  const projectId = useSelector((state) => state.project.currentProject.id);
  const firestore = getFirestore();
  const theme = useSelector((state) => state.auth.theme);
  const [showInstruction, setShowInstruction] = useState(true);

  useEffect(() => {
    // Fetch tasks from Firestore
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

  useEffect(() => {
    // Show instruction overlay only the first time component is loaded
    const hasVisited = localStorage.getItem('kanbanViewVisited');
    if (!hasVisited) {
      localStorage.setItem('kanbanViewVisited', 'true');
    } else {
      setShowInstruction(false);
    }
  }, []);

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const taskRef = doc(firestore, 'projects', projectId, 'tasks', taskId);
      await updateDoc(taskRef, { status: newStatus });
      dispatch(updateTask({ id: taskId, updates: { status: newStatus } }));
    } catch (err) {
      console.error('Error updating task status:', err);
    }
  };

  const onDragEnd = async (result) => {
    if (!result.destination) return;

    const { source, destination } = result;

    if (source.droppableId !== destination.droppableId) {
      const taskId = result.draggableId;
      const newStatus = destination.droppableId;
      handleStatusChange(taskId, newStatus);
    }
  };

  const renderTasks = (status) => {
    return tasks
      .filter((task) => task.status === status)
      .map((task, index) => (
        <Draggable key={task.id} draggableId={task.id} index={index}>
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              className={`${theme === 'light' ? 'task-card-light' : 'task-card-dark'}`}
            >
              <h3 className={`${theme === 'light' ? 'task-title-light' : 'task-title-dark'}`}>{task.name}</h3>
              <p className={`${theme === 'light' ? 'task-description-light' : 'task-description-dark'}`}>{task.description}</p>
              <p className="task-deadline">Deadline: {task.deadline}</p>
              <div className="task-status-container">
                <label htmlFor={`status-select-${task.id}`} className={`${theme === 'light' ? 'task-status-label-light' : 'task-status-label-dark'}`}>Status:</label>
                <select
                  id={`status-select-${task.id}`}
                  value={task.status}
                  onChange={(e) => handleStatusChange(task.id, e.target.value)}
                  className="task-status-select"
                >
                  <option value="To Do">To Do</option>
                  <option value="On Going">On Going</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </div>
          )}
        </Draggable>
      ));
  };

  return (
    <div>
      {showInstruction && (
        <div className="instruction-overlay" onClick={() => setShowInstruction(false)}>
          <div className="instruction-content">
            <p>YOU CAN DRAG AND DROP TASKS</p>
          </div>
        </div>
      )}

      <DragDropContext onDragEnd={onDragEnd}>
        <div className={` ${theme == 'light' ? 'kanban-board-light' : 'kanban-board-dark'}`}>
          <Droppable droppableId="To Do">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="kanban-column"
              >
                <h2 className="kanban-column-title lato-bold text-white text-2xl">To Do</h2>
                {renderTasks('To Do')}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
          <Droppable droppableId="On Going">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="kanban-column"
              >
                <h2 className="kanban-column-title lato-bold text-white text-2xl">On Going</h2>
                {renderTasks('On Going')}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
          <Droppable droppableId="Completed">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="kanban-column"
              >
                <h2 className="kanban-column-title lato-bold text-white text-2xl">Completed</h2>
                {renderTasks('Completed')}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      </DragDropContext>
    </div>
  );
};

export default KanbanView;
