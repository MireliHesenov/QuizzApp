const question = document.querySelector('.question');
const choices = Array.from(document.getElementsByClassName('choice'));
const questionCounterText = document.querySelector('#questionCounter');
const scoreText = document.querySelector('#score');
let score = 0 ;
let currentQuestion = {};
let answerStatus = false;
let availableQuestion = [];
let questionCounter= 0 ;
let questions = [];
//Constant 
const correctBonus = 10 ;
let maxQuestion = null;


function clickStart(){
    const playerName = document.querySelector('#playerName').value ;

    if(playerName == ''){
        const errorMessage = document.createElement('div');
        errorMessage.classList.add('error');
        errorMessage.textContent = 'Please enter Player Name'
        document.body.appendChild(errorMessage);
        setTimeout(() =>{
            document.body.removeChild(errorMessage);
        },1000)
         
    }else{
        sessionStorage.setItem('PlayerName' , playerName)
        window.location = 'game.html';
        return false
    }
}



async function loadQuestion(){

    const response = await fetch("questions.json");
    questions = await response.json();
    startGame();
}


function startGame(){
    score = 0 ;
    questionCounter = 0;
    availableQuestion = [...questions];
    maxQuestion = questions.length;
    countDownTimer();
    getNewQuestion();


}




function countDownTimer(){

    let time = document.querySelector('#timer');
    let timeCounter = 60 ;  
   
     setInterval(() => {        
        time.innerText =  timeCounter;
        
        if(timeCounter == 0){
            
            gameOver()
        }
       timeCounter-- 
    }, 1000);

   


    
}




function getNewQuestion(){
    
    
    if(questionCounter > maxQuestion -1){
        //go to the scoreboard page
        gameOver()
        
    
    }
    currentQuestion = availableQuestion[questionCounter];
    question.innerText = currentQuestion.question;
    choices.forEach(choice => {
        const number = choice.dataset['number'];
        choice.innerText = currentQuestion['choice' + number]
    })
    answerStatus = true;
    questionCounterText.innerText = `${questionCounter + 1} / ${maxQuestion}`; 
    questionCounter++;
 

}



choices.forEach(choice => {
   choice.addEventListener('click' , (e) => {
     if(!answerStatus) return;
     console.log(answerStatus)
     let selectedChoice = e.target;
     let selectedAnswer = selectedChoice.innerText;
     let result = 
     selectedAnswer === currentQuestion.answer ? 'correct' : 'incorrect';
     console.log(selectedChoice)
     if(result == 'correct'){
      updateScore();
     }
     
     selectedChoice.classList.add(result)
     setTimeout(() =>{
         selectedChoice.classList.remove(result);
         getNewQuestion();
     },1000)

     
    
     

    })
})
  
   function updateScore(){
    
    score += correctBonus;
    scoreText.innerText = score ;
  
     

    }

async function gameOver(){
    
   await db.collection('scoreboard').add({
        Name: sessionStorage.getItem('PlayerName') ,
        Score:score
    })
    
    window.location = "./scoreboard.html";

}

async function  getResult(){


    await db.collection('scoreboard').orderBy("Score", "desc").limit(10).get().then((snapshot) => {
       snapshot.docs.forEach((doc, index) =>{
           
            renderScore(doc.data(),index)
     
       })
   })
     
}

function renderScore(user , index){
    const scores = document.querySelector('.scores');
    playerName =  user.Name ;
    playerScore =  user.Score ;
    const HTML = `

    <li class="score"> <span class='rank'>${index + 1}.</span>   ${playerName}  :  ${playerScore}</li>

`;

 scores.innerHTML += HTML;


}


