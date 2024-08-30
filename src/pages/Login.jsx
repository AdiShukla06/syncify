import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setUser } from '../redux/authSlice';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { motion } from 'framer-motion';
import BackgroundImage from '../assets/landingpageimages/bg2.jpg'; 
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const auth = getAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      dispatch(setUser({ uid: user.uid, email: user.email }));
      navigate('/chooseprojectpage');
    } catch (err) {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center roboto-regular"
      style={{ backgroundImage: `url(${BackgroundImage})` }}
    >
      <motion.div
        className="bg-white bg-opacity-80 p-8 rounded-lg shadow-lg max-w-md w-full"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-3xl font-bold text-center mb-8 roboto-bold">Login to Syncify</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
            <Input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <Input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full"
              required
            />
          </div>
          {error && <p className="text-red-500">{error}</p>}
          <Button
            type="submit"
            className={`w-full py-2 px-4 text-white rounded-md ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={loading}
          >
            {loading ? 'Logging In...' : 'Login'}
          </Button>
        </form>
        <motion.div
          className="text-center mt-3"
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.3 }}
        >
          <p className="text-gray-700">
            Don't have an account?{' '}
            <span
              onClick={() => navigate('/signup')}
              className="text-blue-500 cursor-pointer"
            >
              Sign up
            </span>
          </p>
        </motion.div>
        
      </motion.div>
      
    </div>
  );
};

export default Login;