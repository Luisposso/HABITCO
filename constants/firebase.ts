import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBy4ey6PQfbL3WFqKKxbmjyXn9MzYp9Dvg",
  authDomain: "habito-b171d.firebaseapp.com",
  projectId: "habito-b171d",
  storageBucket: "habito-b171d.firebasestorage.app",
  messagingSenderId: "350747866963",
  appId: "1:350747866963:web:d8299319f8a533a082d3a6"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);