const highScoresList = document.getElementById('highScoresList');
const highScores = JSON.parse(localStorage.getItem('highScores')) || []; //return the highest scored from the memory || empty array

highScoresList.innerHTML = highScores 
.map (score => {
    return `<li class="high-score">${score.name} - ${score.score}</li>`; //list of name and its score in the high score page
})
.join("");