import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import logo from '../assets/syncifybg.png';
import { Button } from "@/components/ui/button";
import { clearUser } from '../redux/authSlice';
import '@/index.css';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    dispatch(clearUser());
    navigate('/login');
  };

  const handleNavigation = (section) => {
    if (location.pathname !== '/') {
      navigate('/', { state: { scrollTo: section } });
      
    } else {
      document.getElementById(section)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`w-full fixed top-0 left-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white bg-opacity-10 backdrop-blur-lg shadow-md' : ''
      }`}
    >
      <nav className="container mx-auto flex justify-between items-center nunito">
        <motion.div
          whileHover={{ scale: 1.3 }}
          whileTap={{ scale: 0.9 }}
          className="cursor-pointer"
          onClick={() => navigate('/')}
        >
          <img src={logo} alt="Syncify Logo" className="h-24" />
        </motion.div>
        <div className="flex space-x-12">
          <motion.a
            whileHover={{ scale: 1.3 }}
            onClick={() => handleNavigation('features')}
            className="text-sm bold text-gray-400 hover:text-gray-300 cursor-pointer"
          >
            Features
          </motion.a>
          <motion.a
            whileHover={{ scale: 1.3 }}
            onClick={() => handleNavigation('about')}
            className="text-sm bold text-gray-400 hover:text-gray-300 cursor-pointer"
          >
            About Me
          </motion.a>
          <motion.a
            whileHover={{ scale: 1.3 }}
            onClick={() => handleNavigation('contact')}
            className="text-sm bold text-gray-400 hover:text-gray-300 cursor-pointer"
          >
            Contact
          </motion.a>
        </div>
        <div className="flex space-x-4">
          {user ? (
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="w-20 px-3 py-1 text-sm bold text-gray-400"
            >
              Logout
            </Button>
          ) : (
            <Button
              variant="ghost"
              onClick={() => navigate('/login')}
              className="w-20 px-3 py-1 text-sm bold text-gray-400"
            >
              Login
            </Button>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
