import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage"

const firebaseConfig = {
  apiKey: "AIzaSyBSEGoxQpfFKnq1o_655fX3NmlAU3v8rAk",
  authDomain: "linkhedin-2b334.firebaseapp.com",
  projectId: "linkhedin-2b334",
  storageBucket: "linkhedin-2b334.appspot.com",
  messagingSenderId: "418787531462",
  appId: "1:418787531462:web:14bd29a8103e6ffaacd5c7"
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export default app