// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyApHWVVIzNuQAf4chk2V0_Ezhaxr49mluU",
  authDomain: "inventory-manager-5cf6c.firebaseapp.com",
  projectId: "inventory-manager-5cf6c",
  storageBucket: "inventory-manager-5cf6c.appspot.com",
  messagingSenderId: "1003424916221",
  appId: "1:1003424916221:web:c423f14edda23c20191494",
  measurementId: "G-2RBNKNC1MX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export { firestore };