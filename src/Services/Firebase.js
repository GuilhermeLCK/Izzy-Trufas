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

const firebaseConfigPREQA = {
  apiKey: "AIzaSyAvaqbSQqtSTpE4vs1jiF4anMnV3GKNiwo",
  authDomain: "trabalhe-conosco-b5cd9.firebaseapp.com",
  projectId: "trabalhe-conosco-b5cd9",
  storageBucket: "trabalhe-conosco-b5cd9.appspot.com",
  messagingSenderId: "21481935154",
  appId: "1:21481935154:web:25a2ba66cbcd1e38ff872b",
  measurementId: "G-8Y7G9TSMX3",
};

// Initialize Firebase
const app = initializeApp(firebaseConfigPREQA);
const db = getFirestore(app);

export { db };

//apiKey: "AIzaSyAvaqbSQqtSTpE4vs1jiF4anMnV3GKNiwo",
//authDomain: "trabalhe-conosco-b5cd9.firebaseapp.com",
//projectId: "trabalhe-conosco-b5cd9",
//storageBucket: "trabalhe-conosco-b5cd9.appspot.com",
//messagingSenderId: "21481935154",
//appId: "1:21481935154:web:25a2ba66cbcd1e38ff872b",
//measurementId: "G-8Y7G9TSMX3"
