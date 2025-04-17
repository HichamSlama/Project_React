import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";



const firebaseConfig = {
  apiKey: "AIzaSyA03cO1CZOXdNt1HCAPvl0I94rmTMqmQTg",
  authDomain: "maroc-scolarisation-92a83.firebaseapp.com",
  projectId: "maroc-scolarisation-92a83",
  storageBucket: "maroc-scolarisation-92a83.firebasestorage.app",
  messagingSenderId: "67191201259",
  appId: "1:67191201259:web:d13d3f15042665815d8dae",
  measurementId: "G-BP2T6MRDKL"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);




export { app, auth, db };
