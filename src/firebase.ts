// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCGheFO-nu8tqPzech1ur8aY0Bjk2dVEtQ",
  authDomain: "recipes-test-task.firebaseapp.com",
  projectId: "recipes-test-task",
  storageBucket: "recipes-test-task.appspot.com",
  messagingSenderId: "742810094450",
  appId: "1:742810094450:web:31da04d7bcb8fcb03b6beb"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export default app;