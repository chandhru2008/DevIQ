// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-analytics.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAAsXvl9FI8Ci-08cX5TUhdU2Hp8RoYYjs",
    authDomain: "quiz-craft-project-1.firebaseapp.com",
    databaseURL: "https://quiz-craft-project-1-default-rtdb.firebaseio.com",
    projectId: "quiz-craft-project-1",
    storageBucket: "quiz-craft-project-1.firebasestorage.app",
    messagingSenderId: "697108968119",
    appId: "1:697108968119:web:4c46c0d71b4c81a6a99332",
    measurementId: "G-VS42VKYXG8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
//============================================= Login and Sign up section ======================================================//
const loginButton = document.getElementById('login-button');
const loginDiv = document.getElementById('login-div');
const main = document.getElementById('main');
const header = document.getElementById('header');
loginButton.addEventListener('click', () => {
main.style.filter='blur(5px)';
header.style.filter='blur(5px)';
loginDiv.style.top='120px';
});
const loginDivCloseButton = document.getElementById('login-div-close-button');
loginDivCloseButton.addEventListener('click',()=>{
    main.style.filter='blur(0px)';
    header.style.filter='blur(0px)';
    loginDiv.style.display='block';
    loginDiv.style.top='-400px';  
 
});
const SignUpDivShow = document.getElementById('sign-up-div-show');
const signUpDiv = document.getElementById('sign-up-div');
SignUpDivShow.addEventListener('click',()=>{
signUpDiv.style.display='block';
});
const signUpDivCloseButton = document.getElementById('sign-up-div-close-button');
signUpDivCloseButton.addEventListener('click',()=>{
    signUpDiv.style.display='none';
    loginDiv.style.top='-400px'; 
    header.style.filter='blur(0px)';
    main.style.filter='blur(0px)';
});
const loginDivShow = document.getElementById('login-div-show');
loginDivShow.addEventListener('click',()=>{
    signUpDiv.style.display='none';
});
//=============================================== Form validation =========================================================//
 const loginEmail = document.getElementById('email').value;