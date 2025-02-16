// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";
import { getDatabase, ref, set, get } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-database.js";
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged, signOut, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";
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
const provider = new GoogleAuthProvider();
const db = getFirestore(app);
const database = getDatabase(app);
//============================================= Login and Sign up section ======================================================//
const loginButton = document.getElementById('login-button');
const loginDiv = document.getElementById('login-div');
const main = document.getElementById('main');
const header = document.getElementById('header');
const container = document.getElementById('container');
loginButton.addEventListener('click', () => {
    container.style.filter = 'blur(5px)';
    loginDiv.style.top = '120px';
});
const loginDivCloseButton = document.getElementById('login-div-close-button');
loginDivCloseButton.addEventListener('click', () => {
    container.style.filter = 'blur(0px)';
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
    container.style.filter = 'blur(0px)';
});
const loginDivShow = document.getElementById('login-div-show');
loginDivShow.addEventListener('click', () => {
    signUpDiv.style.display = 'none';
});
//=============================================== Form validation =========================================================//
const name = document.getElementById('name');
const nameError = document.getElementById('name-error')
const signUpEmail = document.getElementById('sign-up-email');
const signUpButton = document.getElementById('sign-up');
const signUpPassword = document.getElementById('sign-up-password');
const signUpEmailError = document.getElementById('sign-up-email-error');
const signUpPasswordError = document.getElementById('sign-up-password-error');

signUpButton.addEventListener('click', (e) => {
    e.preventDefault();
    const nameValue = name.value;
    const signUpEmailValue = signUpEmail.value;
    const signUpPasswordValue = signUpPassword.value;
    signUpPasswordError.textContent = '';
    signUpPasswordError.textContent = '';
    let validEamil = true;
    let valid = true;

    if (nameValue.length == 0) {
        const nameError = document.getElementById('name-error')
            .textContent = "";
        setTimeout(() => {
            nameError.textContent = '';
        }, 2000)
        validEamil = false;
        valid = false;
    }
    else if (!signUpEmailValue) {
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
    // create a user only if valid
    if (valid) {
        createUser(signUpEmailValue, signUpPasswordValue, nameValue) // passing the value as a argumnet to the the function
    }

});
//============================================ Sign Up ===================================================//

const signUpLoginSuccessDiv = document.getElementById('sign-up-login-success-div');
const signUpLoginSuccessDivMessage = document.getElementById('sign-up-login-success-div-message');
async function createUser(email, password, nameValue) {
    signUpLoginSuccessDivMessage.innerHTML = '<p>Sign up successfully<span style="color: yellow; padding-left: 10px; font-weight: 500;">:)</span> </p>'
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);

        // Use user UID instead of email for database reference
        const dbRef = ref(database, "users/" + userCredential.user.uid);

        await set(dbRef, {
            name: nameValue,
            email: email,  // Store email inside the object, not as a key
            solvedTopics: { "placeholder": true },
            mark: 0
        });
        setTimeout(() => {
            signUpLoginSuccessDiv.style.top = '-90px';
            window.location.href = '../../index.html'
        }, 2000);

        signUpLoginSuccessDiv.style.top = '40px';

    } catch (error) {
        const errorCode = error.code;
        console.log(errorCode);
        if (errorCode.includes('auth/email-already-in-use')) {
            signUpEmailError.innerHTML = 'email-already-in-use';
        } else {
            alert(errorCode + ' - Try after some time');
        }
    }
}

//============================================ Login ===================================================//
const login = document.getElementById('login');
login.addEventListener('click', (e) => {
    e.preventDefault();
    const loginEmail = document.getElementById('login-email');
    const loginPassword = document.getElementById('login-password');
    const emailErrorLogin = document.getElementById('email-error');
    const passwordErrorLogin = document.getElementById('password-error');
    if (loginEmail.value.length == 0) {
        emailErrorLogin.textContent = "Please enter email";
        setTimeout(() => {
            emailErrorLogin.textContent = "";
        }, 3000);
        e.preventDefault();
    }
    if (loginPassword.value.length == 0) {
        passwordErrorLogin.textContent = "Please enter password";
        setTimeout(() => {
            passwordErrorLogin.textContent = "";
        }, 3000);
        e.preventDefault();
    }


    signInWithEmailAndPassword(auth, loginEmail, loginPassword)
        .then((userCredential) => {
            const user = userCredential.user;
            console.log(user);
        })
        .catch((error) => {
            //  ======================Check for valid user ============================//
            const errorCode = error.code;
            if (errorCode === 'auth/invalid-email') {
                emailErrorLogin.textContent = "Please enter a valid email address.";
            } else if (errorCode === 'auth/user-disabled') {
                emailErrorLogin.textContent = "This account has been disabled.";
            } else if (errorCode === 'auth/user-not-found') {
                emailErrorLogin.textContent = "No user found with this email.";
            } else if (errorCode === 'auth/wrong-password') {
                passwordErrorLogin.textContent = "Incorrect password. Please try again.";
            } else {
                passwordErrorLogin.textContent = "Entered Email or password is wrong";
            }
        });
})
//============================================ Google login ==============================================//

const googleLogin = document.getElementById('google-loging');
const googleSignUp = document.getElementById('google-sign-up');
googleLogin.addEventListener("click", handleGoogleAuth);
googleSignUp.addEventListener("click", handleGoogleAuth);
async function handleGoogleAuth() {
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        const userRef = ref(database, "users/" + user.uid);


        get(userRef).then((snapshot) => {
            if (!snapshot.exists()) {  // if newly a user created set their details in real time data base
                set(userRef, {
                    name: user.displayName,
                    email: user.email,
                    profilePic: user.photoURL,
                    solvedTopics: { "placeholder": true },
                    mark: 0
                }).then(() => {
                    console.log("New user added to database!");
                }).catch((error) => {
                    console.error("Error storing new user:", error);
                });
            } else {
                console.log("Existing user logged in!");  // else we can get the logined user
            }

            window.location.reload();
        });

    } catch (error) {
        console.error("Google Auth Error:", error);
        alert("Login failed: " + error.message);
    }
}


//============================================= Function to check user is exit or not ==================================================//
const logOutButton = document.getElementById('logout-button'); // This button is for showing log out and login accurding to user exit or not intially there in display:none 
function checkUserExit() {
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            logOutButton.style.display = 'flex';


        } else {
            console.log('No user found')
            loginButton.style.display = 'flex'

        }
    })
}
checkUserExit();
//=========================================== Logout confirmation  ==============================================
const conformDiv = document.getElementsByClassName('logout-confirmation-card')[0];
logOutButton.addEventListener('click', () => {
    main.style.filter = 'blur(5px)'
    header.style.filter = 'blur(5px)'
    conformDiv.style.display = 'flex'
})
const acceptButton = document.getElementsByClassName('accept')[0];
const rejectButton = document.getElementsByClassName('reject')[0];
acceptButton.addEventListener('click', () => {
    signOut(auth).then(() => { // actuall sing out happening here 
        window.location.reload();
    }).catch((error) => {
        console.log('Error-->', error)
    });
});
rejectButton.addEventListener('click', () => {
    main.style.filter = 'blur(0px)'
    header.style.filter = 'blur(0px)'
    conformDiv.style.display = 'none'
});
//=========================================== Pages redirects ====================================================

const startQuizButton = document.getElementsByClassName('start-quiz-button');
const loginAlert = document.getElementById('login-alert');
const startQuizButtonArray = Array.from(startQuizButton);
startQuizButtonArray.forEach(button => {
    button.addEventListener('click', async (e) => {
        const selectedQuiz = e.target.getAttribute('language-name');

        console.log(selectedQuiz)
        const user = await auth.currentUser;
        console.log(user)
        if (!user) {
            loginAlert.style.opacity = '1'
            setTimeout(() => {
                loginAlert.style.opacity = '0'
            }, 3000)
        } else {
            window.location.href = `../../pages/quiz-questions-page.html?id=${selectedQuiz}`
        }


    })
});