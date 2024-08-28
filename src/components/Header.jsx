import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import logo from '../assets/syncifybg.png';
import { Button } from "@/components/ui/button";
import '@/index.css';

const Header = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      if (scrollTop > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`w-full  fixed top-0 left-0 z-50 transition-all duration-300 ${
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
            href="#features"
            className="text-sm bold text-gray-400 hover:text-gray-300"
          >
            Features
          </motion.a>
          <motion.a
            whileHover={{ scale: 1.3 }}
            href="#about"
            className="text-sm bold text-gray-400 hover:text-gray-300"
          >
            About Me
          </motion.a>
          <motion.a
            whileHover={{ scale: 1.3 }}
            href="#contact"
            className="text-sm bold text-gray-400 hover:text-gray-300"
          >
            Contact
          </motion.a>
        </div>
        <div className="flex space-x-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/login')}
            className="w-20 px-3 py-1 text-sm bold text-gray-400"
          >
            Login
          </Button>
        </div>
      </nav>
    </header>
  );
};

export default Header;
