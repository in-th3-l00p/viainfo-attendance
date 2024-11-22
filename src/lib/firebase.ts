import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyA9zBD9plhhbrq6dyd1CVBVfo8M7I6XrAo",
  authDomain: "viainfo-f1b18.firebaseapp.com",
  projectId: "viainfo-f1b18",
  storageBucket: "viainfo-f1b18.firebasestorage.app",
  messagingSenderId: "282517369332",
  appId: "1:282517369332:web:3a77568ad3bf05d18b09a1"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);