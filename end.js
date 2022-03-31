const username = document.getElementById('username');
const saveScoreBtn = document.getElementById('saveScoreBtn');
const finalScore = document.getElementById('finalScore');
const mostRecentScore = localStorage.getItem('mostRecentScore');

const highScores = JSON.parse(localStorage.getItem('highScores')) || []; //EVERYTHING IS SAVES AS A STRING, thats why we convert it into an actual array with JSON.parce

const MAX_HIGH_SCORES = 5;

finalScore.innerText = mostRecentScore;

username.addEventListener('keyup', () => {
    //console.log(username.value); -> to see every movement of char before being saved
    saveScoreBtn.disabled = !username.value; //if there isnt a name, disable the save button. when something e=gets written on, enable it
});

saveHighScore = (e) => {
    //console.log('clicked the save button'); --> to check if it allows you to click without any name in username
    e.preventDefault();

    const score = {
        score: mostRecentScore, //Math.floor(Math.random()*100),
        name: username.value
    };
    highScores.push(score); //you add the score to the array
    highScores.sort ((a,b) => b.score - a.score); //built in function for arrays in js. if the b score is highest than the a score, then put b before a
    highScores.splice(5); //at index 5 start cutting off everything after that

    localStorage.setItem('highScores', JSON.stringify(highScores));
    window.location.assign('/');

};