import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // Added this for your database
import { getAuth } from "firebase/auth";           // Added this for user login

// Your web app's Firebase configuration (Matched to your RizzRefined project)
const firebaseConfig = {
  apiKey: "AIzaSyAmaMFJ4yjTljZqJDVI1KVT2mFTf2a_tj4",
  authDomain: "rizzrefined.firebaseapp.com",
  projectId: "rizzrefined",
  storageBucket: "rizzrefined.firebasestorage.app",
  messagingSenderId: "753808230556",
  appId: "1:753808230556:web:78ace6272a5edab34e4559"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize and Export services so your other files can use them
export const db = getFirestore(app); // This lets you save orders
export const auth = getAuth(app);    // This handles logins
export default app;