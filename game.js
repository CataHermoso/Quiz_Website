const question = document.getElementById('question');
const choices = Array.from(document.getElementsByClassName('choice-text'));
const progressText = document.getElementById('progressText');
const scoreText = document.getElementById('score');
const progressBarFull = document.getElementById('progressBarFull');
const loader = document.getElementById('loader');
const game = document.getElementById('game');

let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuestions = []; //take questions out of this var so we dont repeat them

let questions = []; // we could write here the json file with the questions to make it simpler

fetch("https://opentdb.com/api.php?amount=10&category=17&difficulty=easy&type=multiple")
    .then( res => { //use the fetch ipa to go look for them in the json file
        return res.json();
    })
    .then (loadedQuestions => {
        console.log(loadedQuestions.results);
        questions = loadedQuestions.results.map(loadedQuestion => {
            const formattedQuestion = { //we need to change the format of the api page so it works in the formatting that we are using
                question: loadedQuestion.question
            };

            const answerChoices = [...loadedQuestion.incorrect_answers];
            formattedQuestion.answer = Math.floor(Math.random()*3)+1; //decide which choice is my answer
            answerChoices.splice(formattedQuestion.answer -1,0,loadedQuestion.correct_answer);

            answerChoices.forEach((choice,index) => {
                formattedQuestion["choice" + (index+1)] = choice; //iterate through each answer, well put the into choice1,2,3,and4
            });

            return formattedQuestion;
        });
        
        startGame();
    })
    .catch(err => { //error scenario
        console.error(err);
    });

//CONSTANTS
const CORRECT_BONUS = 10;
const MAX_QUESTIONS = 7;

startGame = () => {
    questionCounter = 0;
    score = 0;
    availableQuestions = [...questions] //we are gonna copy all the questions from the questions array. the ... means take these arrays spread each item and put them into a new array
    getNewQuestion();
    game.classList.remove("hidden"); //the loader is in the screen, until the game starts
    loader.classList.add("hidden"); //the loader disapears 
};

getNewQuestion = () => { //getnewquest=funct name, ()=parameters
    if(availableQuestions.length == 0 || questionCounter >= MAX_QUESTIONS){ //so the questions stop at number 7 and gets us to the end page
        localStorage.setItem('mostRecentScore', score); //so that it saves the last score
        //GO TO THE END PAGE
        return window.location.assign('end.html');
    }
    questionCounter++; //when we start the game its gonna be 1, and then 2...   
    progressText.innerText = ('Question ' + questionCounter + '/' + MAX_QUESTIONS); //it shows us how many question we did and how many we have left
    //update the progress bar
    progressBarFull.style.width = ((questionCounter/MAX_QUESTIONS)*100)+ '%';

    const questionIndex = Math.floor(Math.random() * availableQuestions.length);
    currentQuestion = availableQuestions[questionIndex];
    question.innerText = currentQuestion.question;

    choices.forEach(choice => {
        const number = choice.dataset['number'];
        choice.innerText = currentQuestion['choice' + number]; //we can grab the choice property, we can get this data number associated with it, to get the data appropiate choice out of the question
    });

    availableQuestions.splice(questionIndex, 1); //its gonna get rid of the questions that we use
    acceptingAnswers = true;
};

choices.forEach(choice => {
    choice.addEventListener('click', e => {
        if(!acceptingAnswers) return;

        //we detect wheter the answers are correct or not
        acceptingAnswers=false;
        const selectedChoice = e.target;
        const selectedAnswer = selectedChoice.dataset['number'];
        
        //we wanna figure out which class to apply: correct or incorrect
        const classToApply = 
            selectedAnswer == currentQuestion.answer ? 'correct' : 'incorrect'; //if the condition is true ill assign correct, but if its not correct ill assign incorrect

            if(classToApply==='correct') {
                incrementScore(CORRECT_BONUS); //keeping track of the score, incrementing 10 for each correct answer
            }

            selectedChoice.parentElement.classList.add(classToApply); //the selectedChoice is a piece of tech that we click on, we actually want this to hold the container element
            
            setTimeout( () => {
                selectedChoice.parentElement.classList.remove(classToApply); //remove the class from the console of js on the website so they dont acumulate and after each question is answered it pretends that nothing happened
                getNewQuestion();

            },1000); //its gonna wait for 1 second until it removes the class and goes to the next question (1000miliseconds)
    });
});

incrementScore = num => {
    score +=num;
    scoreText.innerText = score;
};
