// Import Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getDatabase, ref, set, get, update, push } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-database.js";
import { getAuth,  onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";

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

const logo = document.getElementsByClassName('logo')[0];
let userId;
onAuthStateChanged(auth, async (user) => {
    if (user) {
        userId = user.uid;
    }
});
//========================================================= getting the url params using the to show the quizes ==================
const param = new URLSearchParams(window.location.search);
const id = param.get('id');


//================================================================================================================================
logo.addEventListener('click', () => {
    window.location = '../../index.html' // page redirect if user click the logo
});

//======================= function to upload data(json) to real time data base =======================================

async function uploadJSONToFirebase() {
    try {
        const response = await fetch("../../sources/data/questions.json");
        const jsonData = await response.json();

        const dbRef = ref(database, "questions/");

        await set(dbRef, jsonData);
    } catch (error) {
        console.error("Error uploading JSON:", error);
    }
}
uploadJSONToFirebase();

//====================================================================================================================




//========================= Fetching the data from real time data base and handle logic's ==============================
const container = document.getElementById('container'); 
const nextButton = document.getElementById('next-button');
const preButton = document.getElementById('pre-button');
const questionContainer = document.getElementById('question');
const optionOneDiv = document.getElementById('option-1');
const optionTwoDiv = document.getElementById('option-2');
const optionThreeDiv = document.getElementById('option-3');
const answerImageDiv = document.getElementById('answer-image-div');
const loader = document.getElementsByClassName('loader')[0];
const questionAndOptionDetails = document.getElementsByClassName('question-and-option-details')[0];
const selectOptionError = document.getElementById('select-option-error');
const questionExplaination = document.getElementById('explaintion');
const totalQuestion = document.getElementById('total-question');
const currentQuestion = document.getElementById('current-question');
const currentProgress = document.getElementById('current-progress');
const finishQuize = document.getElementById('finish-quize');
const userAnswerToShowInHeading = document.getElementById('user-answer-to-show-in-heading');
const reviewAnswerAndGetScoresDiv = document.getElementsByClassName('get-mark-confirmation-card')[0];

preButton.style.zIndex = '-1'
let dataArray = [];
async function fetchJSONFromFirebase() {  // function for get the data from data base
    const dbRef = ref(database, "questions/");
    const snapshot = await get(dbRef);
  
    console.log("userId", userId)
    const numberOfQuestionUsersolved = ref(database, 'users/' + userId + '/solvedTopics/' + `${id}`);


    const userSolvedQuestions = Object.keys((await get(numberOfQuestionUsersolved)).val());
    let count =   userSolvedQuestions.reduce((accumulator) => {
        return accumulator + 1;
    }, 0);

    let currentTopic = count;

    console.log(currentProgress);
    console.log(currentTopic);

    if (snapshot.exists()) {
        const data = snapshot.val();
        data.question.forEach(element => {
            if (element.language == id) {
                dataArray.push(element);
            }
        });

        console.log(dataArray)
        currentProgress.style.width = `${(100 / dataArray.length) * (currentTopic)}%`;
        if(currentTopic>0){
            console.log(currentTopic);
           preButton.style.zIndex = '1'
        }
        console.log(dataArray.length)
        console.log(currentTopic);
        if(currentTopic >= dataArray.length){
            const body = document.body;
            body.innerHTML = `<p id="redirect-button">See your score</p>`;
            body.style.display = "flex";
            body.style.alignItems = "center";
            body.style.justifyContent = "center";
            body.style.height = "100dvh";
            return ;
        }

        document.getElementById('redirect-button').addEventListener('click',()=>{
            window.location.href=`../../pages/review-page.html?language=${id}`
        })
        console.log((100/dataArray.length) * (currentTopic+1));
        currentQuestion.textContent = `${currentTopic + 1}`
        totalQuestion.textContent = `${dataArray.length}`
        userAnswerToShowInHeading.textContent = 'Pick an option';
        let isOptoinSelected = false;
        let alreadyAnswered = true;
        const correcAnswerRef = dataArray[count].answer;

        const userSelectedQuestionRef = ref(database, 'users/' + userId + '/solvedTopics/' + `/${id}/` + dataArray[count].topic + '/userSelectedOption/');

        const userelectedQuestion = await get(userSelectedQuestionRef);


        if (userelectedQuestion.val() == 1) {
            alreadyAnswered = false;
            isOptoinSelected = true;
            questionExplaination.textContent=`${dataArray[count].explanation}`
            correcAnswerRef == userelectedQuestion.val() ? (optionOneDiv.style.backgroundColor = 'green', optionOneDiv.style.color = 'white', answerImageDiv.innerHTML = `<img src="../../assets/images/right-answer-image.png">`, userAnswerToShowInHeading.textContent = 'Correct') : (optionOneDiv.style.backgroundColor = 'red', optionOneDiv.style.color = 'white', answerImageDiv.innerHTML = `<img src="../../assets/images/wrong-answer-image.png">`, userAnswerToShowInHeading.textContent = 'Incorrect');
        } else if (userelectedQuestion.val() == 2) {
            alreadyAnswered = false;
            isOptoinSelected = true;
             questionExplaination.textContent=`${dataArray[0].explanation}`
            correcAnswerRef == userelectedQuestion.val() ? (optionTwoDiv.style.backgroundColor = 'green', optionTwoDiv.style.color = 'white', answerImageDiv.innerHTML = `<img src="../../assets/images/right-answer-image.png">`, userAnswerToShowInHeading.textContent = 'Correct') : (optionTwoDiv.style.backgroundColor = 'red', optionTwoDiv.style.color = 'white', answerImageDiv.innerHTML = `<img src="../../assets/images/wrong-answer-image.png">`, userAnswerToShowInHeading.textContent = 'Incorrect');
        } else if (userelectedQuestion.val() == 3) {
            alreadyAnswered = false;
            isOptoinSelected = true;
             questionExplaination.textContent=`${dataArray[0].explanation}`
            correcAnswerRef == userelectedQuestion.val() ? (optionThreeDiv.style.backgroundColor = 'green', optionThreeDiv.style.color = 'white', answerImageDiv.innerHTML = `<img src="../../assets/images/right-answer-image.png">`, userAnswerToShowInHeading.textContent = 'Correct') : (optionThreeDiv.style.backgroundColor = 'red',  optionThreeDiv.style.color = 'white', answerImageDiv.innerHTML = `<img src="../../assets/images/wrong-answer-image.png">`, userAnswerToShowInHeading.textContent = 'Incorrect');

        }
        questionContainer.innerHTML = `<p>${dataArray[count].question}</p>`;
        optionOneDiv.innerHTML = `<p>${dataArray[count].options[0]}</p>`
        optionTwoDiv.innerHTML = `<p>${dataArray[count].options[1]}</p>`
        optionThreeDiv.innerHTML = `<p>${dataArray[count].options[2]}</p>`


       
        nextButton.addEventListener('click', async () => {

            userAnswerToShowInHeading.textContent = 'Pick an option'
            questionExplaination.textContent = ``;
            if (isOptoinSelected) {
                preButton.style.zIndex = '1'
                isOptoinSelected = false;
                loader.style.display = 'block';
                questionAndOptionDetails.style.opacity = '0';
                setTimeout(() => {
                    loader.style.display = 'none';
                    questionAndOptionDetails.style.opacity = '1';
                }, 1000)
                alreadyAnswered = true;
                answerImageDiv.innerHTML = ``
                questionExplaination.textContent = '';
                optionOneDiv.style.backgroundColor = '#e7eae7';
                optionTwoDiv.style.backgroundColor = '#e7eae7';
                optionThreeDiv.style.backgroundColor = '#e7eae7';

                optionOneDiv.style.color = 'black';
                optionTwoDiv.style.color = 'black';
                optionThreeDiv.style.color = 'black';

                if (currentTopic < dataArray.length) {
                    currentTopic++
                    if (currentTopic == dataArray.length - 1) {
                        nextButton.style.display = 'none';
                        finishQuize.style.display = 'block';
                        currentProgress.style.width = `${(100 / dataArray.length) * (currentTopic + 1)}%`;
                    }


                    currentQuestion.textContent = `${currentTopic + 1}`
                    currentProgress.style.width = `${(100 / dataArray.length) * (currentTopic)}%`;
                    const correcAnswerRef = dataArray[currentTopic].answer
                    const userSelectedQuestionRef = ref(database, 'users/' + userId + '/solvedTopics/' + `/${id}/` + dataArray[currentTopic].topic + '/userSelectedOption/');
                    // const correctQuestionRef = ref(database, 'users/' + userId + '/solvedTopics/' + `/${id}/` + dataArray[currentTopic].topic + '/correctOption/');
                    const userelectedQuestion = await get(userSelectedQuestionRef);


                    if (userelectedQuestion.val() == 1) {
                        alreadyAnswered = false;
                        isOptoinSelected = true;
                        questionExplaination.textContent = `${dataArray[currentTopic].explanation}`;
                        correcAnswerRef == userelectedQuestion.val() ? (optionOneDiv.style.backgroundColor = 'green', optionOneDiv.style.color = 'white', answerImageDiv.innerHTML = `<img src="../../assets/images/right-answer-image.png">`, userAnswerToShowInHeading.textContent = 'Correct') : (optionOneDiv.style.backgroundColor = 'red', optionOneDiv.style.color = 'white', answerImageDiv.innerHTML = `<img src="../../assets/images/wrong-answer-image.png">`, userAnswerToShowInHeading.textContent = 'Incorrect');
                    } else if (userelectedQuestion.val() == 2) {
                        alreadyAnswered = false;
                        isOptoinSelected = true;
                        questionExplaination.textContent = `${dataArray[currentTopic].explanation}`;
                        correcAnswerRef == userelectedQuestion.val() ? (optionTwoDiv.style.backgroundColor = 'green', optionTwoDiv.style.color = 'white', answerImageDiv.innerHTML = `<img src="../../assets/images/right-answer-image.png">`, userAnswerToShowInHeading.textContent = 'Correct') : (optionTwoDiv.style.backgroundColor = 'red', optionTwoDiv.style.color = 'white', answerImageDiv.innerHTML = `<img src="../../assets/images/wrong-answer-image.png">`, userAnswerToShowInHeading.textContent = 'Incorrect');
                    } else if (userelectedQuestion.val() == 3) {
                        alreadyAnswered = false;
                        isOptoinSelected = true;
                        questionExplaination.textContent = `${dataArray[currentTopic].explanation}`;
                        correcAnswerRef == userelectedQuestion.val() ? (optionThreeDiv.style.backgroundColor = 'green', optionThreeDiv.style.color = 'white', answerImageDiv.innerHTML = `<img src="../../assets/images/right-answer-image.png">`, userAnswerToShowInHeading.textContent = 'Correct') : (optionThreeDiv.style.backgroundColor = 'red', optionThreeDiv.style.color = 'white', answerImageDiv.innerHTML = `<img src="../../assets/images/wrong-answer-image.png">`, userAnswerToShowInHeading.textContent = 'Incorrect');

                    }
                    questionContainer.innerHTML = `<h1>${dataArray[currentTopic].question}</h1>`;
                    optionOneDiv.innerHTML = `<p>${dataArray[currentTopic].options[0]}</p>`
                    optionTwoDiv.innerHTML = `<p>${dataArray[currentTopic].options[1]}</p>`
                    optionThreeDiv.innerHTML = `<p>${dataArray[currentTopic].options[2]}</p>`



                }
            } else {
                selectOptionError.textContent = "Please provide a answer";
                setTimeout(() => {
                    selectOptionError.textContent = '';
                }, 2000)
            }

        });

        preButton.addEventListener('click', async () => {
            userAnswerToShowInHeading.textContent = 'Pick an option'
            if (currentTopic == 1) {
                preButton.style.zIndex = '-1';
            }
            alreadyAnswered = false;
            isOptoinSelected = true;
            optionOneDiv.style.backgroundColor = '#e7eae7';
            optionTwoDiv.style.backgroundColor = '#e7eae7';
            optionThreeDiv.style.backgroundColor = '#e7eae7';
            optionOneDiv.style.color = 'black';
            optionTwoDiv.style.color = 'black';
            optionThreeDiv.style.color = 'black';

            answerImageDiv.innerHTML = ``

            loader.style.display = 'block';
            questionAndOptionDetails.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
                questionAndOptionDetails.style.opacity = '1';
            }, 1000)

            if (currentTopic == 0) {

                currentProgress.style.width = `${(100 / dataArray.length) * (currentTopic)}%`
                currentQuestion.textContent = `${currentTopic}`;

            }
            if (currentTopic > 0) {
                currentQuestion.textContent = `${currentTopic}`
                currentTopic--

                currentProgress.style.width = `${(100 / dataArray.length) * (currentTopic)}%`
                nextButton.style.display = 'block';


                const solvedTopicsRef = ref(database, 'users/' + userId + '/solvedTopics/' + `/${id}/` + dataArray[currentTopic].topic + '/topic/');
                const userSelectedQuestionRef = ref(database, 'users/' + userId + '/solvedTopics/' + `/${id}/` + dataArray[currentTopic].topic + '/userSelectedOption/');
                const correctQuestionRef = ref(database, 'users/' + userId + '/solvedTopics/' + `/${id}/` + dataArray[currentTopic].topic + '/correctOption/');

                const topic = await get(solvedTopicsRef);
                const userelectedQuestion = await get(userSelectedQuestionRef);
                const correctQestion = await get(correctQuestionRef);

                if (userelectedQuestion.val() == 1) {
                    alreadyAnswered = false;
                    if (correctQestion.val() == userelectedQuestion.val()) {
                        questionExplaination.textContent = `${dataArray[currentTopic].explanation}`;
                        optionOneDiv.style.backgroundColor = 'green';
                        optionOneDiv.style.color = 'white';
                        
                        answerImageDiv.innerHTML = `<img src="../../assets/images/right-answer-image.png">`;
                        userAnswerToShowInHeading.textContent = 'Correct'

                    } else {
                        optionOneDiv.style.backgroundColor = 'red';
                        optionOneDiv.style.color = 'white';
                        answerImageDiv.innerHTML = `<img src="../../assets/images/wrong-answer-image.png">`;
                        userAnswerToShowInHeading.textContent = 'Incorrect'
                    }


                } else if (userelectedQuestion.val() == 2) {
                    questionExplaination.textContent = `${dataArray[currentTopic].explanation}`;
                    alreadyAnswered = false;

                    correctQestion.val() == userelectedQuestion.val() ? (optionTwoDiv.style.backgroundColor = 'green', optionTwoDiv.style.color = 'white', answerImageDiv.innerHTML = `<img src="../../assets/images/right-answer-image.png">`, userAnswerToShowInHeading.textContent = 'Correct') : (optionThreeDiv.style.backgroundColor = 'red', optionTwoDiv.style.color = 'white', answerImageDiv.innerHTML = `<img src="../../assets/images/wrong-answer-image.png">`, userAnswerToShowInHeading.textContent = 'Incorrect');

                } else if (userelectedQuestion.val() == 3) {
                    questionExplaination.textContent = `${dataArray[currentTopic].explanation}`;
                    alreadyAnswered = false;
                    correctQestion.val() == userelectedQuestion.val() ? (optionThreeDiv.style.backgroundColor = 'green', optionThreeDiv.style.color = 'white', answerImageDiv.innerHTML = `<img src="../../assets/images/right-answer-image.png">`, userAnswerToShowInHeading.textContent = 'Correct') : (optionThreeDiv.style.backgroundColor = 'red', optionThreeDiv.style.color = 'white', answerImageDiv.innerHTML = `<img src="../../assets/images/wrong-answer-image.png">`, userAnswerToShowInHeading.textContent = 'Incorrect');
                    console.log('option-3: ', userelectedQuestion.val())

                }
                const userSelctedAnswer = userelectedQuestion.val();

                if (topic.val() == dataArray[currentTopic].topic) {

                } else {
    
                }
                questionContainer.innerHTML = `<p>${dataArray[currentTopic].question}</p>`;
                optionOneDiv.innerHTML = `<p>${dataArray[currentTopic].options[0]}</p>`
                optionTwoDiv.innerHTML = `<p>${dataArray[currentTopic].options[1]}</p>`
                optionThreeDiv.innerHTML = `<p>${dataArray[currentTopic].options[2]}</p>`

                finishQuize.style.display='none';

            }
        })

        optionOneDiv.addEventListener('click', async (e) => {
            isOptoinSelected = true;


            let isUserAnswerCorrect = true;
            if (alreadyAnswered) {
                const selectedOption = e.currentTarget.getAttribute('option-one');
                 questionExplaination.textContent=`${dataArray[currentTopic].explanation}`
                if (selectedOption == dataArray[currentTopic].answer) {
                    optionOneDiv.style.backgroundColor = 'green';
                    optionOneDiv.style.color = 'white';
                    answerImageDiv.innerHTML = `<img src="../../assets/images/right-answer-image.png">`
                    userAnswerToShowInHeading.textContent = 'Correct'
                    
                } else {
                    optionOneDiv.style.backgroundColor = 'red';
                    optionOneDiv.style.color = 'white';
                    answerImageDiv.innerHTML = `<img src="../../assets/images/wrong-answer-image.png">`;
                    userAnswerToShowInHeading.textContent = 'Incorrect'
                    isUserAnswerCorrect = false;

                }

                questionExplaination.textContent = `${dataArray[currentTopic].explanation}`;

                alreadyAnswered = false;
                try {
                    const newsolvedTopic = {
                        topic: dataArray[currentTopic].topic,
                        question: dataArray[currentTopic].question,
                        userSelectedOption: selectedOption,
                        correctOption: dataArray[currentTopic].answer,
                        isUserAnswerCorrect: isUserAnswerCorrect
                    };
                    const solvedTopicsRef = ref(database, 'users/' + userId + '/solvedTopics/' + `/${id}/` + dataArray[currentTopic].topic);
                    await set(solvedTopicsRef, newsolvedTopic);



                } catch (error) {
                    console.log('Error in update: ', error)
                }
            }
        })
        optionTwoDiv.addEventListener('click', async (e) => {
            isOptoinSelected = true;
            let isUserAnswerCorrect = true;

            if (alreadyAnswered) {
                 questionExplaination.textContent=`${dataArray[currentTopic].explanation}`
                const solvedTopicsRef = ref(database, 'users/' + userId + '/solvedTopics/' + `/${id}/` + dataArray[currentTopic].topic);
                const selectedOption = e.currentTarget.getAttribute('option-two');
                if (selectedOption == dataArray[currentTopic].answer) {
                    optionTwoDiv.style.backgroundColor = 'green';
                    optionTwoDiv.style.color = 'white';
                    answerImageDiv.innerHTML = `<img src="../../assets/images/right-answer-image.png">`
                    userAnswerToShowInHeading.textContent = 'Correct'

                } else {
                    optionTwoDiv.style.backgroundColor = 'red';
                    optionTwoDiv.style.color = 'white';
                    answerImageDiv.innerHTML = `<img src="../../assets/images/wrong-answer-image.png">`
                    userAnswerToShowInHeading.textContent = 'Incorrect'
                    isUserAnswerCorrect = false;

                }
                questionExplaination.textContent = `${dataArray[currentTopic].explanation}`;
                alreadyAnswered = false;
                try {

                    const newsolvedTopic = {
                        topic: dataArray[currentTopic].topic,
                        question: dataArray[currentTopic].question,
                        userSelectedOption: selectedOption,
                        correctOption: dataArray[currentTopic].answer,
                        isUserAnswerCorrect: isUserAnswerCorrect
                    };

                    await set(solvedTopicsRef, newsolvedTopic);

                    

                } catch (error) {
                    console.log('Error in update: ', error)
                }
            }
        });
        optionThreeDiv.addEventListener('click', async (e) => {
            isOptoinSelected = true;
            let isUserAnswerCorrect = true;

            if (alreadyAnswered) {
                const solvedTopicsRef = ref(database, 'users/' + userId + '/solvedTopics/' + `/${id}/` + dataArray[currentTopic].topic);
                const selectedOption = e.currentTarget.getAttribute('option-three');
                if (selectedOption == dataArray[currentTopic].answer) {
                    optionThreeDiv.style.backgroundColor = 'green';
                    optionThreeDiv.style.color = 'white';
                    answerImageDiv.innerHTML = `<img src="../../assets/images/right-answer-image.png">`
                    userAnswerToShowInHeading.textContent = 'Correct'
                } else {
                    optionThreeDiv.style.backgroundColor = 'red';
                    optionThreeDiv.style.color = 'white';
                    answerImageDiv.innerHTML = `<img src="../../assets/images/wrong-answer-image.png">`
                    userAnswerToShowInHeading.textContent = 'Incorrect'
                    isUserAnswerCorrect = false;
                }
                questionExplaination.textContent = `${dataArray[currentTopic].explanation}`;
                alreadyAnswered = false;
                try {

                    const newsolvedTopic = {
                        topic: dataArray[currentTopic].topic,
                        question: dataArray[currentTopic].question,
                        userSelectedOption: selectedOption,
                        correctOption: dataArray[currentTopic].answer,
                        isUserAnswerCorrect: isUserAnswerCorrect
                    };

                    await set(solvedTopicsRef, newsolvedTopic);

                

                } catch (error) {
                    console.log('Error in update: ', error)
                }
            }
        })
        const acceptButton = document.getElementsByClassName('accept')[0];
        acceptButton.addEventListener('click',()=>{
            window.location.href=`../../pages/review-page.html?language=${id}`;
        })
        finishQuize.addEventListener('click', async () => {
            currentProgress.style.width = `${100}%`
            reviewAnswerAndGetScoresDiv.style.display='flex';
            container.style.filter='blur(5px)'
        });

    } else {
        console.log("No data found!");

    }
}

fetchJSONFromFirebase();
const hammerButton = document.getElementById('hammer');
hammerButton.addEventListener('click',()=>{
header.classList.toggle('header-show');
});