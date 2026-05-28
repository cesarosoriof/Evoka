import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyA4FtbUp3tBqOpscO_9nyugp67uebPKQvE",
  authDomain: "evoka-cf503.firebaseapp.com",
  projectId: "evoka-cf503",
  storageBucket: "evoka-cf503.firebasestorage.app",
  messagingSenderId: "108791990454",
  appId: "1:108791990454:web:49ed63886d35fa84f0fe17"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
