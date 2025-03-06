// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCl4vEpEYylcpxIXlK79M4WEDOLs54qCKk",
  authDomain: "gurt-systems.firebaseapp.com",
  projectId: "gurt-systems",
  storageBucket: "gurt-systems.firebasestorage.app",
  messagingSenderId: "1031482812367",
  appId: "1:1031482812367:web:bba97fcacd9a49e4ff14ba"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const signInWithGoogle = async () => {
  try {
    await signInWithPopup(auth, provider);
  } catch (error) {
    console.error("Помилка входу:", error);
  }
};

const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Помилка виходу:", error);
  }
};

export { auth, signInWithGoogle, logout, onAuthStateChanged };
