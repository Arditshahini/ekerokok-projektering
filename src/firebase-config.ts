// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAdYX_FdL3pF-CvHusRX1pSxSPXiJ3TA0U",
    authDomain: "iths-crossplatform-23c47.firebaseapp.com",
    projectId: "iths-crossplatform-23c47",
    storageBucket: "iths-crossplatform-23c47.appspot.com",
    messagingSenderId: "798905296625",
    appId: "1:798905296625:web:2f3dbb9dc5891263fe6b50"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore()
export const storage = getStorage(app);
