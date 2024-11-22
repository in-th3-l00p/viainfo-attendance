import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDsTYsmxlXIWOyE4VShGrTh7QvT6_sCHWY",
  authDomain: "viainfo2-5ce64.firebaseapp.com",
  projectId: "viainfo2-5ce64",
  storageBucket: "viainfo2-5ce64.firebasestorage.app",
  messagingSenderId: "876154912959",
  appId: "1:876154912959:web:073d4a6051488354a1060a"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);