// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
// import { getFirestore, collection, doc, getDoc, getDocs, setDoc, addDoc, deleteDoc, updateDoc } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js";

import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";

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

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
//============================================= Login and Sign up section ======================================================//
const loginButton = document.getElementById('login-button');
const loginDiv = document.getElementById('login-div');
const main = document.getElementById('main');
const header = document.getElementById('header');
loginButton.addEventListener('click', () => {
    main.style.filter = 'blur(5px)';
    header.style.filter = 'blur(5px)';
    loginDiv.style.top = '120px';
});
const loginDivCloseButton = document.getElementById('login-div-close-button');
loginDivCloseButton.addEventListener('click', () => {
    main.style.filter = 'blur(0px)';
    header.style.filter = 'blur(0px)';
    loginDiv.style.display = 'block';
    loginDiv.style.top = '-400px';

});
const SignUpDivShow = document.getElementById('sign-up-div-show');
const signUpDiv = document.getElementById('sign-up-div');
SignUpDivShow.addEventListener('click', () => {
    signUpDiv.style.display = 'block';
});
const signUpDivCloseButton = document.getElementById('sign-up-div-close-button');
signUpDivCloseButton.addEventListener('click', () => {
    signUpDiv.style.display = 'none';
    loginDiv.style.top = '-400px';
    header.style.filter = 'blur(0px)';
    main.style.filter = 'blur(0px)';
});
const loginDivShow = document.getElementById('login-div-show');
loginDivShow.addEventListener('click', () => {
    signUpDiv.style.display = 'none';
});
//=============================================== Form validation =========================================================//
const signUpEmail = document.getElementById('sign-up-email');
const signUpButton = document.getElementById('sign-up');
const signUpPassword = document.getElementById('sign-up-password');

signUpButton.addEventListener('click', (e) => {
    e.preventDefault();

    const signUpEmailValue = signUpEmail.value;
    const signUpPasswordValue = signUpPassword.value;
    const signUpEmailError = document.getElementById('sign-up-email-error');
    const signUpPasswordError = document.getElementById('sign-up-password-error');
    signUpPasswordError.textContent = '';
    signUpPasswordError.textContent = '';
    let validEamil = true;
    let valid = true;
    if (!signUpEmailValue) {
        signUpEmailError.textContent = "Email should not be empty.";
        setTimeout(() => {
            signUpEmailError.textContent = '';
        }, 2000)
        validEamil = false;
        valid = false;
    }
    else if (/\s/.test(signUpEmailValue)) {
        signUpEmailError.textContent = "Email should not contain spaces.";
        setTimeout(() => {
            signUpEmailError.textContent = '';
        }, 2000)

        validEamil = false;
        valid = false;
    }
    else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(signUpEmailValue)) {
        signUpEmailError.textContent = 'Enter a valid eamil'
        setTimeout(() => {
            signUpEmailError.textContent = ''
        }, 2000)
        validEamil = false;
        valid = false;
    }
    if (validEamil) {
        if (signUpPasswordValue.length < 8) {
            signUpPasswordError.textContent = 'Length atleast 8 charcters';
            setTimeout(() => {
                signUpPasswordError.textContent = '';
            }, 3000);
            valid = false;
        }
        else if (!(/(?=.*[a-z])/).test(signUpPasswordValue)) {
            signUpPasswordError.textContent = 'At least one lowercase letter';
            setTimeout(() => {
                signUpPasswordError.textContent = '';
            }, 3000);
            valid = false;
        } else if (!/(?=.*[A-Z])/.test(signUpPasswordValue)) {
            signUpPasswordError.textContent = ' At least one uppercase letter';
            setTimeout(() => {
                signUpPasswordError.textContent = '';
            }, 3000);
            valid = false;
        } else if (!/(?=.*\d)/.test(signUpPasswordValue)) {
            signUpPasswordError.textContent = 'At least one digit';
            setTimeout(() => {
                signUpPasswordError.textContent = '';
            }, 3000);
            valid = false;
        } else if (!/(?=.*[@$!%*?&])/.test(signUpPasswordValue)) {
            signUpPasswordError.textContent = ' At least one special character';
            setTimeout(() => {
                signUpPasswordError.textContent = '';
            }, 3000);
            valid = false;
        }
    }
//============================================ Sign Up ===================================================//
    if (valid) {
        createUserWithEmailAndPassword(auth, signUpEmailValue, signUpEmailValue)
            .then((userCredential) => {
                // Signed up 
                alert("login aagitu")
                const user = userCredential.user;
                // ...
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                if (errorMessage.includes('auth/email-already-in-use')) {
                    signUpEmailError.textContent = 'Email Already in use';
                    setTimeout(() => {
                        signUpEmailError.textContent = '';
                    }, 3000);
                }
            });

    }
});
//============================================ Login ===================================================//

// signInWithEmailAndPassword(auth, signUpEmailValue, signUpEmailValue)
//   .then((userCredential) => {
//     // Signed in 
//     const user = userCredential.user;
//     // ...
//   })
//   .catch((error) => {
//     const errorCode = error.code;
//     const errorMessage = error.message;
//   });