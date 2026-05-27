// src/environments/environment.ts

// Objeto constante que armazena as variáveis de configuração para a fase de desenvolvimento
export const environment = {
  // Indica se a aplicação está a ser executada no ambiente final de produção
  production: false,
  
  // Credenciais e parâmetros de configuração para a ligação aos serviços remotos do Firebase
  firebaseConfig: {
    apiKey: "AIzaSyA7aNwKyQMPB6b7ioKlOE--xZ0pzV18g2s",
    authDomain: "eugaranto-d22f1.firebaseapp.com",
    projectId: "eugaranto-d22f1",
    storageBucket: "eugaranto-d22f1.firebasestorage.app",
    messagingSenderId: "946789353532",
    appId: "1:946789353532:web:361078fc4e359231bc5b39"
  }
};