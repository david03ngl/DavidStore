// Import the required functions from the Firebase SDKs
import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCl0TXa3YeL9AbvX3PLFkQNtNxT9ztviz8",
    authDomain: "davidstore-71d32.firebaseapp.com",
    projectId: "davidstore-71d32",
    storageBucket: "davidstore-71d32.appspot.com",
    messagingSenderId: "416232567729",
    appId: "1:416232567729:web:63a4aff4af87d493dd8390",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Storage and get a reference to the service
export const storage = getStorage(app);