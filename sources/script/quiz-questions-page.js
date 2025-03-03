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
        console.log(user.uid);
        userId = user.uid;
    }
});
//========================================================= getting the url params using the to show the quizes ==================
const param = new URLSearchParams(window.location.search);
const id = param.get('id');
console.log(id);

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
        console.log("JSON uploaded successfully to Firebase Realtime Database!");
    } catch (error) {
        console.error("Error uploading JSON:", error);
    }
}
uploadJSONToFirebase();

//======================================================================================================================


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
    console.log('this is current user', userId)
    const dbRef = ref(database, "questions/");
    const snapshot = await get(dbRef);
    let currentTopic = 0;


    if (snapshot.exists()) {
        const data = snapshot.val();
        console.log('This is data-1', data.question)

        data.question.forEach(element => {
            console.log(element)

            console.log("This is element id", element.language);
            console.log("This is the id", id)
            if (element.language == id) {
                dataArray.push(element)
                console.log("This is data", element)
            }
        });
        totalQuestion.textContent = `${dataArray.length}`
        userAnswerToShowInHeading.textContent = 'Pick an option';
        let isOptoinSelected = false;
        let alreadyAnswered = true;
        console.log(dataArray)
        const correcAnswerRef = dataArray[0].answer
        currentQuestion.textContent = `${1}`

        const userSelectedQuestionRef = ref(database, 'users/' + userId + '/solvedTopics/' + `/${id}/` + dataArray[0].topic + '/userSelectedOption/');
        // const correctQuestionRef = ref(database, 'users/' + userId + '/solvedTopics/' + `/${id}/` + dataArray[currentTopic].topic + '/correctOption/');
        const userelectedQuestion = await get(userSelectedQuestionRef);
        console.log(userSelectedQuestionRef)
        // console.log(correcAnswerRef == userSelectedQuestionRef.val());

        if (userelectedQuestion.val() == 1) {
            alreadyAnswered = false;
            isOptoinSelected = true;
            questionExplaination.textContent=`${dataArray[0].explanation}`
            console.log(correcAnswerRef == userelectedQuestion.val())
            correcAnswerRef == userelectedQuestion.val() ? (optionOneDiv.style.backgroundColor = 'green', optionOneDiv.style.color = 'white', answerImageDiv.innerHTML = `<img src="../../assets/images/right-answer-image.png">`, userAnswerToShowInHeading.textContent = 'Correct') : (optionOneDiv.style.backgroundColor = 'red', optionOneDiv.style.color = 'white', answerImageDiv.innerHTML = `<img src="../../assets/images/wrong-answer-image.png">`, userAnswerToShowInHeading.textContent = 'Incorrect');
            console.log('option-1: ', userelectedQuestion.val())
        } else if (userelectedQuestion.val() == 2) {
            alreadyAnswered = false;
            isOptoinSelected = true;
             questionExplaination.textContent=`${dataArray[0].explanation}`
            console.log(correcAnswerRef == userelectedQuestion.val())
            correcAnswerRef == userelectedQuestion.val() ? (optionTwoDiv.style.backgroundColor = 'green', optionTwoDiv.style.color = 'white', answerImageDiv.innerHTML = `<img src="../../assets/images/right-answer-image.png">`, userAnswerToShowInHeading.textContent = 'Correct') : (optionTwoDiv.style.backgroundColor = 'red', optionTwoDiv.style.color = 'white', answerImageDiv.innerHTML = `<img src="../../assets/images/wrong-answer-image.png">`, userAnswerToShowInHeading.textContent = 'Incorrect');
            console.log('option-2: ', userelectedQuestion.val())
        } else if (userelectedQuestion.val() == 3) {
            alreadyAnswered = false;
            isOptoinSelected = true;
             questionExplaination.textContent=`${dataArray[0].explanation}`
            console.log(correcAnswerRef == userelectedQuestion.val())
            console.log('This is correct answer: ', correcAnswerRef);
            console.log('This is correct answer: ', userelectedQuestion.val());
            console.log(correcAnswerRef == userelectedQuestion.val());
            correcAnswerRef == userelectedQuestion.val() ? (optionThreeDiv.style.backgroundColor = 'green', optionThreeDiv.style.color = 'white', answerImageDiv.innerHTML = `<img src="../../assets/images/right-answer-image.png">`, userAnswerToShowInHeading.textContent = 'Correct') : (optionThreeDiv.style.backgroundColor = 'red',  optionThreeDiv.style.color = 'white', answerImageDiv.innerHTML = `<img src="../../assets/images/wrong-answer-image.png">`, userAnswerToShowInHeading.textContent = 'Incorrect');
            console.log('option-3: ', userelectedQuestion.val())

        }
        questionContainer.innerHTML = `<p>${dataArray[0].question}</p>`;
        optionOneDiv.innerHTML = `<p>${dataArray[0].options[0]}</p>`
        optionTwoDiv.innerHTML = `<p>${dataArray[0].options[1]}</p>`
        optionThreeDiv.innerHTML = `<p>${dataArray[0].options[2]}</p>`


       
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


                console.log('this is curret topic before ', currentTopic);
                console.log('this is dataArray length', dataArray.length)
                if (currentTopic < dataArray.length) {
                    currentTopic++
                    if (currentTopic == dataArray.length - 1) {
                        nextButton.style.display = 'none';
                        finishQuize.style.display = 'block';
                        currentProgress.style.width = `${(100 / dataArray.length) * (currentTopic + 1)}%`;
                    }

                    console.log('this is curret topic', currentTopic);
                    console.log('this is dataArray length', dataArray.length)

                    currentQuestion.textContent = `${currentTopic + 1}`
                    currentProgress.style.width = `${(100 / dataArray.length) * (currentTopic)}%`;
                    const correcAnswerRef = dataArray[currentTopic].answer
                    const userSelectedQuestionRef = ref(database, 'users/' + userId + '/solvedTopics/' + `/${id}/` + dataArray[currentTopic].topic + '/userSelectedOption/');
                    // const correctQuestionRef = ref(database, 'users/' + userId + '/solvedTopics/' + `/${id}/` + dataArray[currentTopic].topic + '/correctOption/');
                    const userelectedQuestion = await get(userSelectedQuestionRef);
                    console.log(userSelectedQuestionRef)
                    // console.log(correcAnswerRef == userSelectedQuestionRef.val());

                    if (userelectedQuestion.val() == 1) {
                        alreadyAnswered = false;
                        isOptoinSelected = true;
                        questionExplaination.textContent = `${dataArray[currentTopic].explanation}`;
                        console.log(correcAnswerRef == userelectedQuestion.val())
                        correcAnswerRef == userelectedQuestion.val() ? (optionOneDiv.style.backgroundColor = 'green', optionOneDiv.style.color = 'white', answerImageDiv.innerHTML = `<img src="../../assets/images/right-answer-image.png">`, userAnswerToShowInHeading.textContent = 'Correct') : (optionOneDiv.style.backgroundColor = 'red', optionOneDiv.style.color = 'white', answerImageDiv.innerHTML = `<img src="../../assets/images/wrong-answer-image.png">`, userAnswerToShowInHeading.textContent = 'Incorrect');
                        console.log('option-1: ', userelectedQuestion.val())
                    } else if (userelectedQuestion.val() == 2) {
                        alreadyAnswered = false;
                        isOptoinSelected = true;
                        questionExplaination.textContent = `${dataArray[currentTopic].explanation}`;
                        console.log(correcAnswerRef == userelectedQuestion.val())
                        correcAnswerRef == userelectedQuestion.val() ? (optionTwoDiv.style.backgroundColor = 'green', optionTwoDiv.style.color = 'white', answerImageDiv.innerHTML = `<img src="../../assets/images/right-answer-image.png">`, userAnswerToShowInHeading.textContent = 'Correct') : (optionTwoDiv.style.backgroundColor = 'red', optionTwoDiv.style.color = 'white', answerImageDiv.innerHTML = `<img src="../../assets/images/wrong-answer-image.png">`, userAnswerToShowInHeading.textContent = 'Incorrect');
                        console.log('option-2: ', userelectedQuestion.val())
                    } else if (userelectedQuestion.val() == 3) {
                        alreadyAnswered = false;
                        isOptoinSelected = true;
                        questionExplaination.textContent = `${dataArray[currentTopic].explanation}`;
                        console.log(correcAnswerRef == userelectedQuestion.val())
                        console.log('This is correct answer: ', correcAnswerRef);
                        console.log('This is correct answer: ', userelectedQuestion.val());
                        console.log(correcAnswerRef == userelectedQuestion.val());
                        correcAnswerRef == userelectedQuestion.val() ? (optionThreeDiv.style.backgroundColor = 'green', optionThreeDiv.style.color = 'white', answerImageDiv.innerHTML = `<img src="../../assets/images/right-answer-image.png">`, userAnswerToShowInHeading.textContent = 'Correct') : (optionThreeDiv.style.backgroundColor = 'red', optionThreeDiv.style.color = 'white', answerImageDiv.innerHTML = `<img src="../../assets/images/wrong-answer-image.png">`, userAnswerToShowInHeading.textContent = 'Incorrect');
                        console.log('option-3: ', userelectedQuestion.val())

                    }
                    questionContainer.innerHTML = `<h1>${dataArray[currentTopic].question}</h1>`;
                    optionOneDiv.innerHTML = `<p>${dataArray[currentTopic].options[0]}</p>`
                    optionTwoDiv.innerHTML = `<p>${dataArray[currentTopic].options[1]}</p>`
                    optionThreeDiv.innerHTML = `<p>${dataArray[currentTopic].options[2]}</p>`

                    console.log(currentTopic)


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
            console.log('this is the current question: ', currentTopic)
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
                console.log('THIS IS CURRENT TOPIC', currentTopic)
            }
            if (currentTopic > 0) {
                currentQuestion.textContent = `${currentTopic}`
                currentTopic--

                console.log('THIS IS CURRENT TOPIC', currentTopic)
                currentProgress.style.width = `${(100 / dataArray.length) * (currentTopic)}%`
                nextButton.style.display = 'block';


                console.log('pre button clicked')
                const solvedTopicsRef = ref(database, 'users/' + userId + '/solvedTopics/' + `/${id}/` + dataArray[currentTopic].topic + '/topic/');
                const userSelectedQuestionRef = ref(database, 'users/' + userId + '/solvedTopics/' + `/${id}/` + dataArray[currentTopic].topic + '/userSelectedOption/');
                const correctQuestionRef = ref(database, 'users/' + userId + '/solvedTopics/' + `/${id}/` + dataArray[currentTopic].topic + '/correctOption/');

                const topic = await get(solvedTopicsRef);
                const userelectedQuestion = await get(userSelectedQuestionRef);
                const correctQestion = await get(correctQuestionRef);

                console.log('This is the correct answer', correctQestion.val());
                console.log('This is the correct answer', userelectedQuestion.val());

                if (userelectedQuestion.val() == 1) {
                    alreadyAnswered = false;
                    console.log(correctQestion.val() == userelectedQuestion.val())
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

                    console.log('option-1: ', userelectedQuestion.val())
                } else if (userelectedQuestion.val() == 2) {
                    questionExplaination.textContent = `${dataArray[currentTopic].explanation}`;
                    alreadyAnswered = false;
                    console.log(correctQestion.val() == userelectedQuestion.val())
                    correctQestion.val() == userelectedQuestion.val() ? (optionTwoDiv.style.backgroundColor = 'green', optionTwoDiv.style.color = 'white', answerImageDiv.innerHTML = `<img src="../../assets/images/right-answer-image.png">`, userAnswerToShowInHeading.textContent = 'Correct') : (optionThreeDiv.style.backgroundColor = 'red', optionTwoDiv.style.color = 'white', answerImageDiv.innerHTML = `<img src="../../assets/images/wrong-answer-image.png">`, userAnswerToShowInHeading.textContent = 'Incorrect');
                    console.log('option-2: ', userelectedQuestion.val())
                } else if (userelectedQuestion.val() == 3) {
                    questionExplaination.textContent = `${dataArray[currentTopic].explanation}`;
                    alreadyAnswered = false;
                    console.log(correctQestion.val() == userelectedQuestion.val())
                    console.log('This is correct answer: ', correctQestion.val());
                    console.log('This is correct answer: ', userelectedQuestion.val());
                    console.log(correctQestion.val() == userelectedQuestion.val());
                    correctQestion.val() == userelectedQuestion.val() ? (optionThreeDiv.style.backgroundColor = 'green', optionThreeDiv.style.color = 'white', answerImageDiv.innerHTML = `<img src="../../assets/images/right-answer-image.png">`, userAnswerToShowInHeading.textContent = 'Correct') : (optionThreeDiv.style.backgroundColor = 'red', optionThreeDiv.style.color = 'white', answerImageDiv.innerHTML = `<img src="../../assets/images/wrong-answer-image.png">`, userAnswerToShowInHeading.textContent = 'Incorrect');
                    console.log('option-3: ', userelectedQuestion.val())

                }
                const userSelctedAnswer = userelectedQuestion.val();
                console.log('This is user selected answer: ' + userSelctedAnswer)
                console.log(topic.val());
                if (topic.val() == dataArray[currentTopic].topic) {

                } else {
                    console.log('This is the topic in firestore: ' + topic.val())
                    console.log('This is the topic in local: ' + dataArray[currentTopic].topic)
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

            console.log('clicked')
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

                    console.log("Solved question added successfully!");

                } catch (error) {
                    console.log('Error in update: ', error)
                }
            }
        })
        optionTwoDiv.addEventListener('click', async (e) => {
            isOptoinSelected = true;
            let isUserAnswerCorrect = true;
            console.log('clicked')
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

                    console.log("Solved question added successfully!");

                } catch (error) {
                    console.log('Error in update: ', error)
                }
            }
        });
        optionThreeDiv.addEventListener('click', async (e) => {
            isOptoinSelected = true;
            let isUserAnswerCorrect = true;
            console.log('clicked')
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

                    console.log("Solved question added successfully!");

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
