import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { firestore } from '../firebase-config';
import { getAuth } from 'firebase/auth';
import { Bar } from 'react-chartjs-2';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { setCurrentProject } from '../redux/projectSlice'; 
import BackgroundImage from '../assets/dashboardimages/boxbg.jpg'; 
import BackgroundImage2 from '../assets/dashboardimages/boxbg2.jpg'; 
import BackgroundImage3 from '../assets/dashboardimages/boxbg3.jpg'; 
import BackgroundImage4 from '../assets/dashboardimages/boxbg4.jpg'; 
import { color } from 'framer-motion';

ChartJS.register(CategoryScale, ArcElement, LinearScale, BarElement, Title, Tooltip, Legend);

const Home = () => {
  const dispatch = useDispatch();
  const project = useSelector((state) => state.project.currentProject); // Get current project from Redux
  const tasks = useSelector((state) => state.tasks.allTasks); // Get tasks from Redux
  const user = useSelector((state) => state.auth.user); // Get current user from Redux
  const [leaderName, setLeaderName] = useState('');
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [newDeadline, setNewDeadline] = useState(''); // State for new deadline input
  const auth = getAuth();
  const firebaseUser = auth.currentUser;

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

  // Update the date and time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Handle setting a new deadline
  const handleSetDeadline = async () => {
    if (project && newDeadline) {
      const projectDocRef = doc(firestore, 'projects', project.id);

      // Update the deadline in Firestore
      await updateDoc(projectDocRef, {
        deadline: newDeadline,
      });

      // Update the project in Redux
      const updatedProject = {
        ...project,
        deadline: newDeadline,
      };

      dispatch(setCurrentProject(updatedProject));

      // Clear the input field
      setNewDeadline('');
    }
  };

  // Ensure project is defined before accessing its properties
  if (!project) {
    return <div>Loading project data...</div>;
  }

  // Calculate task counts
  const totalTasks = tasks.length;
  const remainingTasks = tasks.filter((task) => task.status !== 'Completed').length;

  // Data for the chart
  const chartData = {
    labels: ['Total Tasks', 'Remaining Tasks'],
    datasets: [
      {
        label: 'Tasks',
        data: [totalTasks, remainingTasks],
        backgroundColor: ['#e31ccf', '#2e66c8'],
        borderColor: ['#d130cb', '#22478b'],
        borderWidth: 1,
      },
    ],
  };

  // Options for the chart
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels:{
          color: 'white',
          font: {
            size: 12, // Set the legend label font size
          },
        }
      },
      title: {
        display: false,
        text: 'Project Task Overview',
        color: 'white',
        font: {
          size: 16, // Set the legend label font size
        },

      },
    },
    scales: {
      x: {
        ticks: {
          color: '#b8adad', // Set x-axis tick font color
        },
        grid: {
          color: '#444444', // Set grid line color (optional)
        },
      },
      y: {
        ticks: {
          color: '#b8adad', // Set y-axis tick font color
        },
        grid: {
          color: '#444444', // Set grid line color (optional)
        },
      },
    },
  };


  const pieChartData = {
    labels: ['Total Tasks', 'Remaining Tasks'],
    datasets: [
      {
        label: 'Tasks',
        data: [totalTasks, remainingTasks],
        backgroundColor: ['#e31ccf', '#2e66c8'],
        borderColor: ['#d130cb', '#22478b'],
        borderWidth: 1,
      },
    ],
  };
  
  const pieChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#ffffff', // Set the legend font color
          font: {
            size: 14, // Set the legend label font size
          },
        },
      },
      title: {
        display: true,
        text: 'Project Task Overview',
        color: '#ffffff', // Set the title font color
        font: {
          size: 18, // Set the title font size
        },
      },
    },
  };





const selectedDeadline = project.deadline;
  return (
    <div className="p-4 bg-gray-950 text-gray-100 min-h-screen lato-regular">
      {/* Greeting and Date/Time */}
      <div className="mb-6">
        <h1 className="text-3xl font-semibold">Hey, {firebaseUser?.displayName || 'User'}!</h1>
        <p className="text-gray-400">{currentDateTime.toLocaleString()}</p>
      </div>

      {/* Project Info Boxes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 " >
        {/* Project Details */}
        <div className="bg-gray-800 p-4 rounded shadow bg-cover bg-center" style={{ backgroundImage: `url(${BackgroundImage})` }}>
          <h2 className="text-xl lato-bold text-gray-900">Project Details</h2>
          <p className="mt-2 text-gray-900 lato-bold">
           <span className='text-gray-800'> Project Name: </span>{project.name}
          </p>
          <p className="mt-2 text-gray-900 lato-bold">
            <span className='text-gray-800' >Description: </span>{project.description}
          </p>
          <p className="mt-2 text-gray-900 lato-bold">
            <span className='text-gray-800'>Leader: </span>{leaderName || 'Unknown Leader'}
          </p>
        </div>

        {/* Project Deadline */}
        <div className="bg-gray-800 p-4 rounded shadow bg-cover bg-center " style={{ backgroundImage: `url(${BackgroundImage2})` }}>
          <h2 className="text-xl font-semibold text-gray-900">Deadline</h2>
          <p className="mt-2 text-gray-900 lato-bold">{selectedDeadline ? selectedDeadline : 'Not set'}</p>
          <input
            type="date"
            className="mt-2 p-2 rounded bg-gray-900 text-gray-100"
            value={newDeadline}
            onChange={(e) => setNewDeadline(e.target.value)}
          />
          <button
            className="mt-2 p-2 ml-2 bg-blue-600 rounded hover:bg-blue-700"
            onClick={handleSetDeadline}
          >
            Set Deadline
          </button>
        </div>

        {/* Task Overview */}
        <div className="bg-gray-800 p-4 rounded shadow ">
          <Bar data={chartData} options={chartOptions} />
        </div>
      </div>

      {/* Calendar */}
      {/* <div className="mt-6 bg-gray-800 p-4 rounded shadow">
        <div className="mt-2 text-gray-300">
          <Calendar
            value={calendarDate}
            onChange={setCalendarDate}
            className="bg-gray-800 text-gray-100"
          />
        </div>
      </div> */}

      <div className="bg-gray-800 p-4 rounded shadow mt-5 bg-cover" style={{ width: '300px', height: '300px', backgroundImage: `url(${BackgroundImage4})` }}>
        <Pie data={pieChartData} options={pieChartOptions} />
      </div>
    </div>
  );
};

export default Home;
