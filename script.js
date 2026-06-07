/* =====================================================
   ULTIMATE TIC TAC TOE - JAVASCRIPT
===================================================== */

/* =========================
   DOM ELEMENTS
========================= */

const cells =
document.querySelectorAll(".cell");

const statusText =
document.getElementById("status");

const startBtn =
document.getElementById("startBtn");

const restartBtn =
document.getElementById("restartBtn");

const newMatchBtn =
document.getElementById("newMatchBtn");

const themeToggle =
document.getElementById("themeToggle");

const playerNameInput =
document.getElementById("playerName");

const difficultySelect =
document.getElementById("difficulty");

const roundSelect =
document.getElementById("roundSelect");

const playerScoreText =
document.getElementById("playerScore");

const computerScoreText =
document.getElementById("computerScore");

const totalGamesText =
document.getElementById("totalGames");

const winsText =
document.getElementById("wins");

const lossesText =
document.getElementById("losses");

const drawsText =
document.getElementById("draws");

const achievementList =
document.getElementById("achievementList");

const historyList =
document.getElementById("historyList");

const winnerModal =
document.getElementById("winnerModal");

const winnerTitle =
document.getElementById("winnerTitle");
console.log(winnerTitle);

const playAgainBtn =
document.getElementById("playAgain");

const clickSound =
document.getElementById("clickSound");

const winSound =
document.getElementById("winSound");

const loseSound =
document.getElementById("loseSound");

/* =========================
   GAME VARIABLES
========================= */

let currentPlayer = "X";

let gameActive = false;

let playerName = "Player";

let playerScore = 0;

let computerScore = 0;

let totalRounds = 3;

let difficulty = "easy";

let gameState = [
    "", "", "",
    "", "", "",
    "", "", ""
];

/* =========================
   WINNING COMBINATIONS
========================= */

const winningConditions = [

    [0,1,2],
    [3,4,5],
    [6,7,8],

    [0,3,6],
    [1,4,7],
    [2,5,8],

    [0,4,8],
    [2,4,6]
];

/* =========================
   LOCAL STORAGE
========================= */

let stats = JSON.parse(
localStorage.getItem(
"ticTacToeStats"
)) || {

    totalGames:0,
    wins:0,
    losses:0,
    draws:0
};

loadStats();

/* =========================
   START MATCH
========================= */

startBtn.addEventListener(
"click",
() => {

    playerName =
    playerNameInput.value.trim();

    if(playerName === ""){
        playerName = "Player";
    }

    difficulty =
    difficultySelect.value;

    totalRounds =
    parseInt(
        roundSelect.value
    );

    playerScore = 0;
    computerScore = 0;

    updateScoreboard();

    restartRound();

    gameActive = true;

    statusText.textContent = `${playerName}'s Turn`;

});
/* =========================
   PLAYER CLICK
========================= */

cells.forEach(cell => {

    cell.addEventListener(
    "click",
    handleCellClick
    );

});

function handleCellClick(event){

    if(!gameActive)
        return;

    const cell =
    event.target;

    const index =
    cell.dataset.index;

    if(
        gameState[index] !== ""
    ){
        return;
    }

    playClickSound();

    gameState[index] = "X";

    cell.textContent = "X";

    checkWinner();

    if(gameActive){ 

        setTimeout(() => {

            computerMove();

        },500);
    }
}

/* =========================
   COMPUTER MOVE
========================= */

function computerMove(){

    let move;

    switch(difficulty){

        case "easy":

            move =
            getRandomMove();

            break;

        case "medium":

            move =
            Math.random() < 0.7

            ? getWinningMove()

            : getRandomMove();

            break;

        case "hard":

            move =
            getWinningMove();

            break;
    }

    if(move === null){

        move =
        getRandomMove();
    }

    if(move === undefined)
        return;

    gameState[move] = "O";

    cells[move].textContent = "O";

    checkWinner();
}

/* =========================
   RANDOM MOVE
========================= */

function getRandomMove(){

    const emptyCells =
    gameState
    .map(
        (value,index)=>

        value === ""
        ? index
        : null
    )
    .filter(
        value =>
        value !== null
    );

    if(
        emptyCells.length === 0
    ){
        return;
    }

    return emptyCells[
        Math.floor(
            Math.random()
            * emptyCells.length
        )
    ];
}

/* =========================
   SMART MOVE
========================= */

function getWinningMove(){

    for(
        let combo
        of winningConditions
    ){

        const [a,b,c] =
        combo;

        let values = [

            gameState[a],
            gameState[b],
            gameState[c]
        ];

        if(
            values.filter(
            v => v === "O"
            ).length === 2
            &&
            values.includes("")
        ){

            if(gameState[a] === "")
                return a;

            if(gameState[b] === "")
                return b;

            if(gameState[c] === "")
                return c;
        }
    }

    return getRandomMove();
}

/* =========================
   CHECK WINNER
========================= */

function checkWinner(){

    let roundWon = false;

    let winningCells = [];

    for(
        let condition
        of winningConditions
    ){

        const a =
        gameState[
        condition[0]
        ];

        const b =
        gameState[
        condition[1]
        ];

        const c =
        gameState[
        condition[2]
        ];

        if(
            a === "" ||
            b === "" ||
            c === ""
        ){
            continue;
        }

        if(
            a === b &&
            b === c
        ){

            roundWon = true;

            winningCells =
            condition;

            break;
        }
    }

    if(roundWon){

        winningCells.forEach(
        index => {

            cells[index]
            .classList
            .add("win");

        });

        gameActive = false;

        const winner =
        gameState[
        winningCells[0]
        ];

/*
        if(winner === "X"){

            playerScore++;

            stats.wins++;

            addHistory(
            `${playerName} Won`
            );

            unlockAchievements();

            playWinSound();

            launchConfetti();

            statusText.textContent =
            `${playerName} Wins!`;

        }
*/

        if(winner === "X"){

            playerScore++;

            stats.wins++;

            addHistory(
            `${playerName} Won`
            );

            unlockAchievements();

            playWinSound();

            launchConfetti();

            statusText.textContent = `🏆 ${playerName} Wins This Round!`;

        }

        else{

            computerScore++;

            stats.losses++;

            addHistory(
            "Computer Won"
            );

            playLoseSound();

            //statusText.textContent = "Computer Wins!";

            statusText.textContent = `🤖 Computer Wins!`;

        }

        stats.totalGames++;

        saveStats();

        updateScoreboard();

        /*
        showWinnerModal(
            statusText.textContent
        );
        */

        checkTournamentWinner();

        return;
    }

    if(
        !gameState.includes("")
    ){

        stats.draws++;

        stats.totalGames++;

        saveStats();

        addHistory("Draw");

        gameActive = false;

        statusText.textContent ="Draw Match";

        showWinnerModal(
        "🤝 Draw Match"
        );
    }
}

/* =========================
   TOURNAMENT WINNER
========================= */
/*
function checkTournamentWinner(){

    const target =
    Math.ceil(
    totalRounds / 2
    );

    if(
        playerScore >= target
    ){

        setTimeout(() => {

            showWinnerModal(
            `🏆 ${playerName}
            Won Tournament`
            );

        },1000);
    }

    if(
        computerScore >= target
    ){

        setTimeout(() => {

            showWinnerModal(
            "🤖 Computer Won Tournament"
            );

        },1000);
    }
}
*/

function checkTournamentWinner(){

    const winsNeeded =
    Math.ceil(
        totalRounds / 2
    );

    if(
        playerScore >= winsNeeded
    ){

        showWinnerModal(
        `🏆 ${playerName} Won The Tournament!`
        );

        gameActive = false;

        return true;
    }

    if(
        computerScore >= winsNeeded
    ){

        showWinnerModal(
        `🤖 Computer Won The Tournament!`
        );

        gameActive = false;

        return true;
    }

    return false;
}

/* =========================
   SCOREBOARD
========================= */

function updateScoreboard(){

    playerScoreText.textContent =
    playerScore;

    computerScoreText.textContent =
    computerScore;

    loadStats();
}

/* =========================
   RESTART ROUND
========================= */

function restartRound(){

    gameState = [

        "", "", "",
        "", "", "",
        "", "", ""
    ];

    cells.forEach(cell => {

        cell.textContent = "";

        cell.classList.remove(
        "win"
        );

    });

    gameActive = true;

    //statusText.textContent =`${playerName}'s Turn`;

    statusText.textContent = `🎯 ${playerName}'s Turn`;

}

/* =========================
   NEW MATCH
========================= */

newMatchBtn.addEventListener(
"click",
() => {

    playerScore = 0;
    computerScore = 0;

    updateScoreboard();

    restartRound();

});
/* =========================
   RESTART BUTTON
========================= */

restartBtn.addEventListener(
"click",
restartRound
);

/* =========================
   MODAL
========================= */
/*
function showWinnerModal(text){

    winnerTitle.textContent =
    text;

    winnerModal.style.display =
    "flex";
}
*/

function showWinnerModal(text){

    console.log(
        "Modal Text:",
        text
    );

    winnerTitle.textContent =
    text;

    winnerModal.style.display =
    "flex";
}

playAgainBtn.addEventListener(
"click",
() => {

    winnerModal.style.display =
    "none";

    restartRound();

});

/* =========================
   THEME TOGGLE
========================= */

themeToggle.addEventListener(
"click",
() => {

    document.body
    .classList.toggle("light");

});
/* =========================
   STATS
========================= */

function saveStats(){

    localStorage.setItem(
    "ticTacToeStats",

    JSON.stringify(stats)
    );

    loadStats();
}

function loadStats(){

    totalGamesText.textContent =
    stats.totalGames;

    winsText.textContent =
    stats.wins;

    lossesText.textContent =
    stats.losses;

    drawsText.textContent =
    stats.draws;
}

/* =========================
   HISTORY
========================= */

function addHistory(text){

    const li =
    document.createElement("li");

    li.textContent =
    text;

    historyList.prepend(li);
}

/* =========================
   ACHIEVEMENTS
========================= */

function unlockAchievements(){

    achievementList.innerHTML =
    "";

    let achievements = [];

    if(stats.wins >= 1)
        achievements.push(
        "🏅 First Victory"
        );

    if(stats.wins >= 5)
        achievements.push(
        "🔥 5 Wins"
        );

    if(stats.wins >= 10)
        achievements.push(
        "👑 Champion"
        );

    if(stats.wins >= 25)
        achievements.push(
        "💀 Master"
        );

    if(
        achievements.length === 0
    ){

        achievementList.innerHTML =
        "No Achievements Yet";

        return;
    }

    achievements.forEach(
    badge => {

        const div =
        document
        .createElement("div");

        div.classList.add(
        "badge"
        );

        div.textContent =
        badge;

        achievementList
        .appendChild(div);

    });
}

/* =========================
   SOUNDS
========================= */

function playClickSound(){

    if(clickSound){

        clickSound.currentTime = 0;

        clickSound.play();

    }
}

function playWinSound(){

    if(winSound){

        winSound.currentTime = 0;

        winSound.play();

    }
}

function playLoseSound(){

    if(loseSound){

        loseSound.currentTime = 0;

        loseSound.play();

    }
}

/* =========================
   CONFETTI
========================= */

function launchConfetti(){

    if(typeof confetti ===
    "function"){

        confetti({

            particleCount:250,

            spread:180,

            origin:{
                y:0.6
            }

        });
    }
}

/* =========================
   INITIALIZE
========================= */

unlockAchievements();

updateScoreboard();