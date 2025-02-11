// Import Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getDatabase, ref, set, get, update } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-database.js";
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged, signOut, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";

// Your Firebase config
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
const auth = getAuth();
const database = getDatabase(app);
const questionContainer = document.getElementById('question');
const logo = document.getElementsByClassName('logo')[0];
onAuthStateChanged(auth, async (user) => {
    if (user) {
        console.log(user.uid);
    }
})
const param = new URLSearchParams(window.location.search);
const id = param.get('id');
console.log(id)
logo.addEventListener('click', () => {
    window.location = '../../index.html'
})
async function uploadJSONToFirebase() {
    try {
        const response = await fetch("../../sources/data/questions.json");
        const jsonData = await response.json();

        const dbRef = ref(database, "questions/");

        await set(dbRef, jsonData);
        console.log("JSON uploaded successfully to Firebase Realtime Database!");
    } catch (error) {
        console.error("Error uploading JSON:", error);
    }
}
const nextButton = document.getElementById('next-button');
const preButton = document.getElementById('pre-button');
const optionOneDiv = document.getElementById('option-1');
const optionTwoDiv = document.getElementById('option-2');
const optionThreeDiv = document.getElementById('option-3');
uploadJSONToFirebase();
async function fetchJSONFromFirebase() {
    let userId;
    setTimeout(() => {
        const user = auth.currentUser;
        userId = user.uid;
    }, 3000)
    console.log('this is current user', userId)

    const dbRef = ref(database, "questions/");
    const snapshot = await get(dbRef);
    let count = 0;
    let result = [];

    if (snapshot.exists()) {
        const data = snapshot.val();
        data.question.forEach(element => {
            if (element.language == id) {
                result.push(element)
            }
        });
        console.log(result[count])
        let alreadyAnswered = true;
        questionContainer.innerHTML = `<p>${result[count].question}</p>`;
        optionOneDiv.innerHTML = `<p>${result[count].options[0]}</p>`
        optionTwoDiv.innerHTML = `<p>${result[count].options[1]}</p>`
        optionThreeDiv.innerHTML = `<p>${result[count].options[2]}</p>`
        nextButton.addEventListener('click', () => {
            alreadyAnswered = true;
            optionOneDiv.style.backgroundColor = 'transparent';
            optionTwoDiv.style.backgroundColor = 'transparent';
            optionThreeDiv.style.backgroundColor = 'transparent';

            if (count != result.length - 1) {
                count++
                questionContainer.innerHTML = `<p>${result[count].question}</p>`;
                optionOneDiv.innerHTML = `<p>${result[count].options[0]}</p>`
                optionTwoDiv.innerHTML = `<p>${result[count].options[1]}</p>`
                optionThreeDiv.innerHTML = `<p>${result[count].options[2]}</p>`

                console.log(count)
            }
            else {
                count = result.length - 1;
                console.log(count)
            }

        });

        preButton.addEventListener('click', () => {
            optionOneDiv.style.backgroundColor = 'transparent';
            optionTwoDiv.style.backgroundColor = 'transparent';
            optionThreeDiv.style.backgroundColor = 'transparent';
            if (count > 0) {
                count--
                questionContainer.innerHTML = `<p>${result[count].question}</p>`;
                optionOneDiv.innerHTML = `<p>${result[count].options[0]}</p>`
                optionTwoDiv.innerHTML = `<p>${result[count].options[1]}</p>`
                optionThreeDiv.innerHTML = `<p>${result[count].options[2]}</p>`

            }
            else {
                count = 0
            }
        })

        optionOneDiv.addEventListener('click', async (e) => {
            if (alreadyAnswered) {
                const selectedOption = e.currentTarget.getAttribute('option-one');
                selectedOption == result[count].answer ? optionOneDiv.style.backgroundColor = 'green' : optionOneDiv.style.backgroundColor = 'red'
                alreadyAnswered = false;
                try{
                    const userRef = ref(database, "users/",userId);

                    // Push a new hobby
    
                    await update(userRef, {
                        [`solvedQuestion/${result[count].question}`]: selectedOption
                      });
    
                      console.log('upadate suceessfulyy')
                }catch(e){
                    console.log(e)
                }
                
            }
        })
        optionTwoDiv.addEventListener('click', (e) => {
            if (alreadyAnswered) {
                const selectedOption = e.currentTarget.getAttribute('option-two');
                selectedOption == result[count].answer ? optionTwoDiv.style.backgroundColor = 'green' : optionTwoDiv.style.backgroundColor = 'red'
                alreadyAnswered = false;
            }
        })
        optionThreeDiv.addEventListener('click', (e) => {
            if (alreadyAnswered) {
                const selectedOption = e.currentTarget.getAttribute('option-three');
                selectedOption == result[count].answer ? optionThreeDiv.style.backgroundColor = 'green' : optionThreeDiv.style.backgroundColor = 'red'
                alreadyAnswered = false;
            }
        })
    } else {
        console.log("No data found!");

    }
}

fetchJSONFromFirebase();
