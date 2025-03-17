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
const container = document.getElementById('container');
let userId = null;
onAuthStateChanged(auth,async(user)=>{
    userId = user.uid;
    console.log(userId)
})
setTimeout(()=>{
    getUserSolvedQuestionsDetails()
},3000);

async function getUserSolvedQuestionsDetails(){
    let userAnswerDeatails = [];
    let dataArray = [];
    const userSolvedQuestionsRef = ref(database, 'users/' + userId + '/solvedTopics/' + `${language}`);
    const questionsRef = ref(database,'questions/' + '/question');
    try{
        const questions = await get(questionsRef);
        questions.forEach(data => {
          let value = data.val();
          if(value.language == language){
            dataArray.push(value);
          }
        });
        console.log(dataArray)
        const data = await get(userSolvedQuestionsRef);
        console.log(data);
        const dataValue = data.val();
        console.log('This is userDoc', dataValue)
       
        for(let key in dataValue){
            userAnswerDeatails.push(dataValue[key]);
        }

        console.log(userAnswerDeatails)
    }catch(e){
        console.log('Error', e.code);
    }

    console.log(typeof(userAnswerDeatails[0].correctOption));
    console.log(dataArray[0].options[userAnswerDeatails[0].correctOption])
    for(let i = 0; i < userAnswerDeatails.length; i++){

const answer = document.getElementById('title');
        if(userAnswerDeatails[i].isUserAnswerCorrect){
        //     childOfTheContainer.style.backgroundColor='green';
        container.innerHTML+=`
<div class="card">
<div class="card-fornd">
<p>${userAnswerDeatails[i].topic}</p>
  <img src="../../assets/images/right-answer-image.png" width="100" height="100px">

  </div>
  <div class="card__content">
     <div>${userAnswerDeatails[i].question}</div>
    <p class="card__title">Your answer</p>
    <p class="card__description">${dataArray[i].options[userAnswerDeatails[i].correctOption]}</p>
     <p class="card__title">Correct answer</p>
    <p class="card__description">${dataArray[i].options[userAnswerDeatails[i].userSelectedOption]}</p>
  </div>
</div>
`;
        }else{
        //     childOfTheContainer.style.backgroundColor='red';
        container.innerHTML+=`
<div class="card">
  <div class="card-fornd">
<p>${userAnswerDeatails[i].topic}</p>
  <img src="../../assets/images/wrong-answer-image.png" width="100" height="100px">

  </div>
  <div class="card__content">
    <div>${userAnswerDeatails[i].question}</div>
    <p class="card__title">Your answer</p>
   <p class="card__description">${dataArray[i].options[userAnswerDeatails[i].correctOption]}</p>
        <p class="card__title">Correct answer</p>
    <p class="card__description">${dataArray[i].options[userAnswerDeatails[i].userSelectedOption]}</p>
  </div>
</div>
`;
        }

        // container.appendChild(childOfTheContainer);
      }
}
setTimeout(()=>{
    
},3000)
