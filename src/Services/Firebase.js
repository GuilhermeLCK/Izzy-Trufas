import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDEqZD1KEVWrHgCwHaxTsjATgpLUNy_zy4",
  authDomain: "midjourney-herbert.firebaseapp.com",
  projectId: "midjourney-herbert",
  storageBucket: "midjourney-herbert.appspot.com",
  messagingSenderId: "604950399632",
  appId: "1:604950399632:web:0b839013e1f5959553e615",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
