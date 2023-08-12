const {initializeApp,getApps,getApp} = require("firebase/app")
const { getFirestore } = require("firebase/firestore");
const {getStorage} = require('firebase/storage')
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCzy31c7O5g7igzhR_HHr4dR6Jco_pydW4",
    authDomain: "instagram-clone-616fb.firebaseapp.com",
    databaseURL: "https://instagram-clone-616fb-default-rtdb.firebaseio.com",
    projectId: "instagram-clone-616fb",
    storageBucket: "instagram-clone-616fb.appspot.com",
    messagingSenderId: "611303041252",
    appId: "1:611303041252:web:38df9308c4a381304464f1",
    measurementId: "G-LZYE0FJ5EG"
  };

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const storage = getStorage(app);

module.export = {db,storage};