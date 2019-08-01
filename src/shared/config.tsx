import firebase from "firebase";

const DB_CONFIG = {
  apiKey: "AIzaSyAV9yXqKCH-iu15t41ExuySTvZxtjOW7hw",
  authDomain: "sapp-92c9f.firebaseapp.com",
  databaseURL: "https://sapp-92c9f.firebaseio.com",
  projectId: "sapp-92c9f",
  storageBucket: "",
  messagingSenderId: "176221571558",
  appId: "1:176221571558:web:034c9e35f77d3d5c"
};

export const firebaseDB = firebase.initializeApp(DB_CONFIG);
