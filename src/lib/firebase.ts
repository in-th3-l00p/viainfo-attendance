import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyC0P4WvFALzZaN267DmoaK3_AGK5qXu9H4",
  authDomain: "viainfo-657bf.firebaseapp.com",
  projectId: "viainfo-657bf",
  storageBucket: "viainfo-657bf.firebasestorage.app",
  messagingSenderId: "674118957306",
  appId: "1:674118957306:web:a475e38ed465070a2ab143"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);