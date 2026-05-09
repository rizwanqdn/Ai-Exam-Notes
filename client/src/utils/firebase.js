// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "interviewiq-d9b20.firebaseapp.com",
  projectId: "interviewiq-d9b20",
  storageBucket: "interviewiq-d9b20.firebasestorage.app",
  messagingSenderId: "109501912209",
  appId: "1:109501912209:web:3873df1ea47194dd5f9b30",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const provider = new GoogleAuthProvider();
export { auth, provider };
