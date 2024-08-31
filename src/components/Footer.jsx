import React from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Mail, Github, Twitter, Linkedin } from 'lucide-react';
import '@/index.css'; 

const Footer = () => {
  return (
    <footer className="w-full bg-gray-800 text-white py-32 nunito">
      <div id='contact' className="container mx-auto flex flex-col items-center">
        
        <div className="flex space-x-6 mb-6">
          <motion.a
            href="mailto:shukladitya06@gmail.com"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Button className="flex items-center space-x-2">
              <Mail className="h-5 w-5" />
              <span>Contact Me</span>
            </Button>
          </motion.a>
          <motion.a
            href="http://github.com/AdiShukla06"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Button className="flex items-center space-x-2">
              <Github className="h-5 w-5" />
              <span>GitHub</span>
            </Button>
          </motion.a>
          <motion.a
            href="https://x.com/_shukladitya_"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Button className="flex items-center space-x-2">
              <Twitter className="h-5 w-5" />
              <span>Twitter</span>
            </Button>
          </motion.a>
          <motion.a
            href="http://linkedin.com/in/aditya-shukla06"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Button className="flex items-center space-x-2">
              <Linkedin className="h-5 w-5" />
              <span>LinkedIn</span>
            </Button>
          </motion.a>
        </div>
        <p className="text-sm text-gray-400">© 2024 Syncify. All rights reserved to me.</p>
      </div>
    </footer>
  );
};

export default Footer;
