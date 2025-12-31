import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyATiHGggM_M9g34x2fem7wzkjUq5cH4Ai0',
  authDomain: 'pulse-app-e361f.firebaseapp.com',
  projectId: 'pulse-app-e361f',
  storageBucket: 'pulse-app-e361f.firebasestorage.app',
  messagingSenderId: '460854588172',
  appId: '1:460854588172:web:cd1f3e66df258e717fcf29',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth
export const auth = getAuth(app);

// Initialize Firestore
export const db = getFirestore(app);

export default app;
