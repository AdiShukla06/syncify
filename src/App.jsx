// src/App.jsx or src/Routes.jsx
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import ChooseProjectPage from './pages/ChooseProjectPage'; // Assuming you will create this
import Dashboard from './pages/Dashboard';

const App = () => (
  <Router>
    <Routes>
      <Route path="/signup" element={<SignUp />} />
      <Route path="/login" element={<Login />} />
      <Route path="/chooseprojectpage" element={<ChooseProjectPage />} />
      <Route path="/dashboard" element={<Dashboard/>} />
      {/* Add other routes here */}
    </Routes>
  </Router>
);

export default App;
