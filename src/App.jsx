// src/App.jsx or src/Routes.jsx
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import SignUp from './pages/Signup';
import Login from './pages/Login';
import ChooseProjectPage from './pages/ChooseProjectPage'; // Assuming you will create this
import Dashboard from './pages/Dashboard';
import LandingPage from './pages/LandingPage';
import Header from './components/Header';
import Footer from './components/Footer';
import { useSelector } from 'react-redux';

const App = () => {
  const location = useLocation();

  // Define paths where Header and Footer should not appear
  const noHeaderFooterPaths = ['/dashboard'];
  const noHeaderPaths = ['/', '/dashboard']
  const theme = useSelector((state) => state.auth.theme); // Get theme from Redux

  return (
    <>

    
      {!noHeaderPaths.includes(location.pathname) && <Header />}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/chooseprojectpage" element={<ChooseProjectPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
      {!noHeaderFooterPaths.includes(location.pathname) && <Footer />}
    </>
  );
};

const AppWrapper = () => (
  <Router>
    <App />
  </Router>
);

export default AppWrapper;
