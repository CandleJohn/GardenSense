import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore'

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDOcEo6WBrv1w4sAY5VZwQf9osR7sdubls",
  authDomain: "home-garden-sense.firebaseapp.com",
  projectId: "home-garden-sense",
  storageBucket: "home-garden-sense.appspot.com",
  messagingSenderId: "1065767578450",
  appId: "1:1065767578450:web:0b74d9c70bea98da35e88b",
  measurementId: "G-BVZQQF3TE9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app); 