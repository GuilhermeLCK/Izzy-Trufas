import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCPAfE2HscGk_bm200Za-Mfg8a8e3aMOvs",
  authDomain: "trufasdapaty-a1943.firebaseapp.com",
  projectId: "trufasdapaty-a1943",
  storageBucket: "trufasdapaty-a1943.appspot.com",
  messagingSenderId: "665234248657",
  appId: "1:665234248657:web:a7acfc9406ef6bc10dc6f0",
  measurementId: "G-TQ5GKLGQNS",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
