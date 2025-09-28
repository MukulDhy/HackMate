import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithRedirect, 
  getRedirectResult 
} from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC-AGc6z5lHQ1uG5WoBj2TmdjePOcgCO7U",
  authDomain: "hackmate-7488c.firebaseapp.com",
  projectId: "hackmate-7488c",
  storageBucket: "hackmate-7488c.firebasestorage.app",
  messagingSenderId: "338785429760",
  appId: "1:338785429760:web:af2123437b9105a9226be5",
  measurementId: "G-YXH3Y1PV05"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();

// Google Login Function
export const loginWithGoogle = async () => {
  try {
    if (/Mobi|Android|iPhone/i.test(navigator.userAgent)) {
      // Mobile → Redirect flow
      await signInWithRedirect(auth, provider);
      const result = await getRedirectResult(auth);
      console.log("Google login success (redirect):", result);
      return result;
    } else {
      // Desktop → Popup flow
      const result = await signInWithPopup(auth, provider);
      console.log("Google login success (popup):", result);
      return result;
    }
  } catch (error) {
    console.error("Google login error:", error);
    throw error; // re-throw if you want to handle it outside
  }
};
