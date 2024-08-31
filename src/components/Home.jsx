import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  getDocs,
} from "firebase/firestore";
import { firestore } from "../firebase-config";
import { getAuth } from "firebase/auth";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { setCurrentProject } from "../redux/projectSlice";
import BackgroundImage from "../assets/dashboardimages/boxbg.jpg";
import BackgroundImage2 from "../assets/dashboardimages/boxbg2.jpg";
import BackgroundImage3 from "../assets/dashboardimages/boxbg3.jpg";
import BackgroundImage4 from "../assets/dashboardimages/boxbg4.jpg";
import { setTasks } from "../redux/tasksSlice"; // Import the setTasks action

ChartJS.register(
  CategoryScale,
  ArcElement,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Home = () => {
  const dispatch = useDispatch();
  const project = useSelector((state) => state.project.currentProject);
  const tasks = useSelector((state) => state.tasks.allTasks);
  const user = useSelector((state) => state.auth.user);
  const [leaderName, setLeaderName] = useState("");
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [newDeadline, setNewDeadline] = useState("");
  const [teamMembers, setTeamMembers] = useState([]); // State for team members
  const auth = getAuth();
  const firebaseUser = auth.currentUser;
  const theme = useSelector((state) => state.auth.theme);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      if (project) {
        const leaderDocRef = doc(firestore, "projects", project.id);
        const leaderDoc = await getDoc(leaderDocRef);

        if (leaderDoc.exists()) {
          const leaderData = leaderDoc.data();
          setLeaderName(leaderData.leader || "Unknown Leader");

          // Fetch team members
          const members = leaderData.team || [];
          setTeamMembers(members.map((member) => member));
        }
      }
    };

    fetchProjectDetails();
  }, [project]);

  useEffect(() => {
    const fetchTasks = async () => {
      if (project) {
        const tasksCollectionRef = collection(
          firestore,
          "projects",
          project.id,
          "tasks"
        );
        const tasksSnapshot = await getDocs(tasksCollectionRef);
        const tasksList = tasksSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        dispatch(setTasks(tasksList)); // Update the Redux store with the fetched tasks
      }
    };

    fetchTasks();
  }, [project, dispatch]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleSetDeadline = async () => {
    if (project && newDeadline) {
      const projectDocRef = doc(firestore, "projects", project.id);

      await updateDoc(projectDocRef, {
        deadline: newDeadline,
      });

      const updatedProject = {
        ...project,
        deadline: newDeadline,
      };

      dispatch(setCurrentProject(updatedProject));
      setNewDeadline("");
    }
  };

  if (!project) {
    return <div>Loading project data...</div>;
  }

  const totalTasks = tasks.length;
  const remainingTasks = tasks.filter(
    (task) => task.status !== "Completed"
  ).length;

  const chartData = {
    labels: ["Total Tasks", "Remaining Tasks"],
    datasets: [
      {
        label: "Tasks",
        data: [totalTasks, remainingTasks],
        backgroundColor: ["#e31ccf", "#2e66c8"],
        borderColor: ["#d130cb", "#22478b"],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "white",
          font: {
            size: 12,
          },
        },
      },
      title: {
        display: false,
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#b8adad",
        },
        grid: {
          color: "#444444",
        },
      },
      y: {
        ticks: {
          color: "#b8adad",
        },
        grid: {
          color: "#444444",
        },
      },
    },
  };

  const pieChartData = {
    labels: ["Total Tasks", "Remaining Tasks"],
    datasets: [
      {
        label: "Tasks",
        data: [totalTasks, remainingTasks],
        backgroundColor: ["#e31ccf", "#2e66c8"],
        borderColor: ["#d130cb", "#22478b"],
        borderWidth: 1,
      },
    ],
  };

  const pieChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "#ffffff",
          font: {
            size: 14,
          },
        },
      },
      title: {
        display: true,
        text: "Project Task Overview",
        color: "#ffffff",
        font: {
          size: 18,
        },
      },
    },
  };

  const selectedDeadline = project.deadline;
  return (
    <div
      className={`p-4 min-h-screen lato-regular ${
        theme === "light"
          ? "bg-gray-100 text-gray-900"
          : "bg-gray-900 text-gray-100"
      }`}
    >
      <div className="mb-6">
        <h1 className="text-3xl font-semibold">
          Hey, {firebaseUser?.displayName || "User"}!
        </h1>
        <p className="text-gray-400">{currentDateTime.toLocaleString()}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 ">
        <div
          className="bg-gray-800 p-4 rounded shadow bg-cover bg-center"
          style={{ backgroundImage: `url(${BackgroundImage})` }}
        >
          <h2 className="text-xl lato-bold text-gray-900">Project Details</h2>
          <p className="mt-2 text-gray-900 lato-bold">
            <span className="text-gray-800"> Project Name: </span>
            {project.name}
          </p>
          <p className="mt-2 text-gray-900 lato-bold">
            <span className="text-gray-800">Description: </span>
            {project.description}
          </p>
          <p className="mt-2 text-gray-900 lato-bold">
            <span className="text-gray-800">Leader: </span>
            {leaderName || "Unknown Leader"}
          </p>
        </div>

        <div
          className="bg-gray-800 p-4 rounded shadow bg-cover bg-center "
          style={{ backgroundImage: `url(${BackgroundImage2})` }}
        >
          <h2 className="text-xl font-semibold text-gray-900">Deadline</h2>
          <p className="mt-2 text-gray-900 lato-bold">
            {selectedDeadline ? selectedDeadline : "Not set"}
          </p>
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

        <div className="bg-gray-800 p-4 rounded shadow ">
          <Bar data={chartData} options={chartOptions} />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div
          className="bg-gray-800 p-4 rounded shadow mt-5 bg-cover"
          style={{
            width: "300px",
            height: "300px",
            backgroundImage: `url(${BackgroundImage4})`,
          }}
        >
          <Pie data={pieChartData} options={pieChartOptions} />
        </div>

        <div
          className="p-4 rounded shadow mt-5 relative bg-cover bg-center"
          style={{ backgroundImage: `url(${BackgroundImage})` }}
        >
         
            <h2 className="text-2xl font-bold text-black lato-medium mb-3">
              Team Members
            </h2>
            <ul className="text-white lato-medium space-y-2">
              {teamMembers.length > 0 ? (
                teamMembers.map((member, index) => (
                  <li
                    key={index}
                    className={`p-2 bg-black rounded-lg shadow-md hover:bg-white hover:text-black hover:cursor-pointer transition-colors duration-300 ${theme == 'light' ? 'bg-white text-black' : 'bg-black text-white'}`}
                  >
                    {member}
                  </li>
                ))
              ) : (
                <p className="text-white">No team members found.</p>
              )}
            </ul>
          
        </div>
      </div>
    </div>
  );
};

export default Home;
