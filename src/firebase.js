import firebase from "firebase/compat/app";
import 'firebase/compat/auth'
import 'firebase/compat/firestore'
import "firebase/storage"

const firebaseConfig = {
    apiKey: "AIzaSyDUzic1XdxQksqoyWU1_60LADk0uGuT3CY",
    authDomain: "proyectofinal-web-15dd5.firebaseapp.com",
    projectId: "proyectofinal-web-15dd5",
    storageBucket: "proyectofinal-web-15dd5.appspot.com",
    messagingSenderId: "1095210003210",
    appId: "1:1095210003210:web:14d15b483b463510d828f3"
  };
const storage = firebase.initializeApp(firebaseConfig);

export {storage, firebase as default}