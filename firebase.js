// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAhbc0M0lJuj8vjnqikznxCEFofChiOwmQ",
  authDomain: "linkage-287ee.firebaseapp.com",
  projectId: "linkage-287ee",
  storageBucket: "linkage-287ee.appspot.com",
  messagingSenderId: "767475252275",
  appId: "1:767475252275:web:e3e0226ad8f3666ce93746",
  measurementId: "G-6P03WS4SQB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);