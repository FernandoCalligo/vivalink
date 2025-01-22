// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBSdMPPhgQCJnXnKVB9MraBxAZ49eNX0po",
  authDomain: "vivalinksrank.firebaseapp.com",
  projectId: "vivalinksrank",
  storageBucket: "vivalinksrank.firebasestorage.app",
  messagingSenderId: "830737513515",
  appId: "1:830737513515:web:5820c605f2cbb2f8947e6e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export {db};