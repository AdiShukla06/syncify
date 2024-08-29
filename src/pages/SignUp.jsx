import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setUser } from '../redux/authSlice';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { motion } from 'framer-motion';
import BackgroundImage from '../assets/landingpageimages/bg2.jpg'; // Replace with your background image path
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const SignUp = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const auth = getAuth();
  const firestore = getFirestore();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await updateProfile(user, { displayName: name });

      await setDoc(doc(firestore, 'users', user.uid), {
        uid: user.uid,
        name: user.displayName,
        email: user.email,
      });

      dispatch(setUser({ uid: user.uid, email: user.email, name: user.displayName }));

      navigate('/chooseprojectpage');
    } catch (err) {
      setError(err.message);
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
        className="bg-white bg-opacity-80 p-5 rounded-lg shadow-lg max-w-md w-full"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
            <Input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full"
              required
            />
          </div>
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
            <p className="mt-2 text-sm text-gray-600">Password must be at least 6 characters long</p>
          </div>
          {error && <p className="text-red-500">{error}</p>}
          <Button
            type="submit"
            className={`w-full py-2 px-4 text-white rounded-md ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={loading}
          >
            {loading ? 'Signing Up...' : 'Sign Up'}
          </Button>
        </form>
        <motion.div
          className="text-center mt-3"
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.3 }}
        >
          <p className="text-gray-700">
            Already have an account?{' '}
            <span
              onClick={() => navigate('/login')}
              className="text-blue-500 cursor-pointer"
            >
              Log in
            </span>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default SignUp;
