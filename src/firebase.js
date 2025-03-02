// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// Adicione outros serviços que planeies usar no futuro
// import { getAuth } from "firebase/auth"; // Para autenticação
// import { getFirestore } from "firebase/firestore"; // Para banco de dados

// Configuração do Firebase fornecida por ti
const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
    measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
  };

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Inicializa os serviços que vais usar
const analytics = getAnalytics(app);

// Exporta os serviços para uso em outros arquivos
export { app, analytics };
// Adicione mais exports conforme necessário, e.g.:
// export const auth = getAuth(app);
// export const db = getFirestore(app);