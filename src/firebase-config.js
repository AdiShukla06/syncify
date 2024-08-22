// src/firebase-config.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'; // if you use Firestore

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBjv9XCtTT4P8QuU3HgyWBfj7JRwzqn_0Q",
    authDomain: "syncify00.firebaseapp.com",
    databaseURL: "https://syncify00-default-rtdb.firebaseio.com",
    projectId: "syncify00",
    storageBucket: "syncify00.appspot.com",
    messagingSenderId: "320413432998",
    appId: "1:320413432998:web:aa7d5a1804049aa8964867",
    measurementId: "G-0MP119R8YW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and Firestore
const auth = getAuth(app);
const firestore = getFirestore(app); // if you use Firestore

export { auth, firestore };
