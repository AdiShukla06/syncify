import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { Button } from '@/components/ui/button';

// Import your SVG illustrations
import Illustration1 from '../assets/landingpageimages/team.svg';
import Illustration2 from '../assets/landingpageimages/users.svg';
import Illustration3 from '../assets/landingpageimages/scrum.svg';
import Illustration4 from '../assets/landingpageimages/realtime.svg';

// Import your background images
import BackgroundImage from '../assets/landingpageimages/bg2.jpg';
import AboutMeBackground from '../assets/landingpageimages/texture.jpg';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <>
      {/* Hero Section */}
      <div
        className="relative min-h-screen clash"
        style={{
          backgroundImage: `url(${BackgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
        }}
      >
        <Header />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center relative">
            <motion.h1
              className="relative z-10 text-8xl font-bold text-gray-100 mt-16"
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              whileHover={{ scale: 1.05 }}
            >
              Ideas into Action,
              <br />
              <span className="text-9xl lufga">Together.</span>
            </motion.h1>
            <motion.div
              className="mt-8 relative z-10"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              <Button
                size="lg"
                onClick={() => navigate('/login')}
                className="px-8 py-4 my-2 text-xl font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                Get Started
              </Button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="relative bg-black text-white py-32">
        <motion.div
          className="container mx-auto text-center"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex flex-col md:flex-row justify-around items-center md:space-x-8">
            <motion.div
              className="feature-card"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="text-3xl font-semibold mb-4">Real-Time Collaboration</h3>
              <p className="text-lg">Work with your team in real-time with seamless updates and synchronization.</p>
            </motion.div>
            <motion.div
              className="feature-card"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="text-3xl font-semibold mb-4">Task Management</h3>
              <p className="text-lg">Keep track of all your tasks with a powerful and easy-to-use task management system.</p>
            </motion.div>
            <motion.div
              className="feature-card"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="text-3xl font-semibold mb-4">Team Chat</h3>
              <p className="text-lg">Communicate with your team instantly with our integrated team chat feature.</p>
            </motion.div>
          </div>

          <div className="mt-20 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
            <motion.img 
              src={Illustration2} 
              alt="Real-Time Collaboration Illustration" 
              className="mx-auto w-40 h-40"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.5 }}
            />
            <motion.img 
              src={Illustration3} 
              alt="Team Collaboration Illustration" 
              className="mx-auto w-40 h-40"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.5 }}
            />
            <motion.img 
              src={Illustration4} 
              alt="Scrum Board Illustration" 
              className="mx-auto w-40 h-40"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </motion.div>
      </div>

      {/* About Me Section */}
      <div
        id='about'
        className="relative min-h-screen flex items-center justify-center text-center text-white"
        style={{
          backgroundImage: `url(${AboutMeBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="bg-black bg-opacity-50 p-8 rounded-lg">
          <motion.h2
            className="text-6xl font-bold"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            I am Aditya Shukla
          </motion.h2>
          <motion.p
            className="mt-6 text-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            I am from Noida, India. I am 21 years old, and I am a developer. 
            I am passionate about clean code, user-friendly design, <br /> and continuous learning. Open to new opportunities to contribute to
            innovative projects.

          </motion.p>
        </div>
      </div>
    </>
  );
};

export default LandingPage;
