import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyB--eXqDXvNydfKNEOI9p_-XQeDXSV460A",
    authDomain: "driveapp-a8dd0.firebaseapp.com",
    projectId: "driveapp-a8dd0",
    storageBucket: "driveapp-a8dd0.appspot.com",
    messagingSenderId: "304410298589",
    appId: "1:304410298589:web:ae45c1ed808ccefa91f334",
    measurementId: "G-5E1YQMXLT6"
  };

  const app = initializeApp(firebaseConfig);
  
  export const auth = getAuth(app);
  export const firestore = getFirestore(app);