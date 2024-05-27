// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDc1aOm2SXg048cItgxNELiPufpFymhg_A",
  authDomain: "projeto2-frontend.firebaseapp.com",
  projectId: "projeto2-frontend",
  storageBucket: "projeto2-frontend.appspot.com",
  messagingSenderId: "610430289436",
  appId: "1:610430289436:web:e839f9cbec94c819a941d9",
  measurementId: "G-GCCNRXMNWD"
};

// Initialize Firebase
initializeApp(firebaseConfig);
const db = getFirestore();
export default db;