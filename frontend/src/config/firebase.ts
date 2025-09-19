import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC-AGc6z5lHQ1uG5WoBj2TmdjePOcgCO7U",
  authDomain: "hackmate-7488c.firebaseapp.com",
  projectId: "hackmate-7488c",
  storageBucket: "hackmate-7488c.firebasestorage.app",
  messagingSenderId: "338785429760",
  appId: "1:338785429760:web:af2123437b9105a9226be5",
  measurementId: "G-YXH3Y1PV05"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();

// Google Login Function
export const loginWithGoogle = () => signInWithPopup(auth, provider);