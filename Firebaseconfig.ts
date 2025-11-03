// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth"; // 
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDodvka-7F8FRBn50neoYRnCj8vLtdRJbI",
  authDomain: "todoepn.firebaseapp.com",
  projectId: "todoepn",
  storageBucket: "todoepn.firebasestorage.app",
  messagingSenderId: "861062713833",
  appId: "1:861062713833:web:17262e9c071dccd7e8fb78",
  measurementId: "G-L1P7Q9S659"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);