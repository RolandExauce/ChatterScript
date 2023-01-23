// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

// TODO: Add SDKs for Firebase products that you want to use
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

import {
  firebaseConfig
} from "./keys";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

// //.env variables
// import 'dotenv/config'

// Some issues with Dotenv, feel free to help me 
const firebase_App_Config = {
  apiKey: firebaseConfig.apiKey,
  authDomain: firebaseConfig.authDomain,
  projectId: firebaseConfig.projectId,
  storageBucket: firebaseConfig.storageBucket,
  messagingSenderId: firebaseConfig.messagingSenderId,
  appId: firebaseConfig.appId,
  measurementId: firebaseConfig.measurementId
};


// Initialize Firebase
const app = initializeApp(firebase_App_Config);

//getAuth for register and login, storage, to store credentials inclusive
//profile pic, getFirestore is database
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
