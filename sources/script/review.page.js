import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getDatabase, ref, set, get } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-database.js";
import { getAuth,  onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";

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

const urlParams = new URLSearchParams(window.location.search);
const language = urlParams.get('language');
const userId = urlParams.get('userId');
const container = document.getElementById('container');
console.log(language,userId)

getUserSolvedQuestionsDetails()
async function getUserSolvedQuestionsDetails(){
    let result = [];
    const userSolvedQuestionsRef = ref(database, 'users/' + userId + '/solvedTopics/' + `${language}`);
    try{
        const data = await get(userSolvedQuestionsRef);
        const dataValue = data.val();
       
        for(let key in dataValue){
            result.push(dataValue[key]);
        }

        console.log(result)
    }catch(e){
        console.log('Error', e.errorMessage);
    }
    for(let i = 0; i < result.length; i++){
        const childOfTheContainer =   document.createElement('div');
        childOfTheContainer.classList.add('child-of-the-container')
        childOfTheContainer.innerHTML=`<p>${result[i].topic}</p>`;

        if(result[i].isUserAnswerCorrect){
            childOfTheContainer.style.backgroundColor='green';
        }else{
            childOfTheContainer.style.backgroundColor='red';
        }

        container.appendChild(childOfTheContainer);
      }
}
setTimeout(()=>{
    
},3000)
