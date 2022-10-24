var block = document.getElementById("block");
var blockBottom = document.getElementById("blockBottom");
var hole = document.getElementById("hole");
var character = document.getElementById("character");
var link = document.getElementById("jumpButton");
var game = document.getElementById("game");
var modal = document.getElementById("myModal");
var startModal = document.getElementById("startModal");



var runCounter=0;
var gameScore=0;

var jumping = 0;
var counter = 0;
var checker = 1;
var testRun = 0;

var blockSend = 0;
var trackFirstJump = 0;
var gameScoreDate;

//Steuern ups and downs
var gravity; //Character geht runter
var jumpStrength; //Character geht hoch

//Tracking Time
var elapsedTime; //Wird stetig aktualisiert und wird im verlgeich mit lastJumped für die Aktivität genutzt
var deathTimer = 0; //Wie lange ist die Runde vorbei - Wird dafür bentuzt das Fenster zu blockieren
var lastJumped; // Wann wurde das letzte mal gesprungen - Wird dafür bentutzt um auf Aktivität zu prüfen

//Erhält und verarbeitet die Informationen vom Controller-Frontend
var source = new EventSource('http://localhost:8080/button-click');
source.addEventListener("message", (e) => {

        if(startModal.style.display == "block"){
            startGame();
        }
    if(deathTimer == 0){
        testRun=1;
        if(checker==0){
            countTime = new Date();
        }
        jump();
    }
});


block.addEventListener('animationiteration', () => {
    //increaseSpeed();

    var gameHeight = parseInt(window.getComputedStyle(game).getPropertyValue("height"));
    var charHeight = parseInt(window.getComputedStyle(character).getPropertyValue("height"));
    var holeMath = gameHeight - charHeight*2;
    var randomHeight = Math.floor(Math.random()*holeMath) +1;
    randomHeight = randomHeight;
    //checker = 0;
    console.log("Game Height: " + gameHeight);
    var rest = gameHeight - randomHeight;
    if(rest > charHeight*2){
        rest = rest - charHeight*2;
    }

    block.style.height = gameHeight/2;
    blockBottom.style.height = gameHeight/2;

    block.style.height = randomHeight + "px";
    blockBottom.style.height = rest + "px";
    blockBottom.style.top = gameHeight - randomHeight - rest;
        var gameWidth = parseInt(window.getComputedStyle(game).getPropertyValue("width"));

    var blockLeft = parseInt(window.getComputedStyle(block).getPropertyValue("left"));

    //Neuer Block wurde losgeshcickt

    if(blockSend == 1){
        console.log("A GameScore: " + gameScore);
        blockSend = 0;
        gameScore++;
        console.log("B GameScore: " + gameScore);
    }

});

setInterval(function(){

    var gameHeight = parseInt(window.getComputedStyle(game).getPropertyValue("height"));
    var gameWidth = parseInt(window.getComputedStyle(game).getPropertyValue("width"));
    var blockLeft = parseInt(window.getComputedStyle(block).getPropertyValue("left"));
    var holeTop = parseInt(window.getComputedStyle(block).getPropertyValue("height"));
    var holeBottom = parseInt(window.getComputedStyle(blockBottom).getPropertyValue("height"));
    var characterTop = parseInt(window.getComputedStyle(character).getPropertyValue("top"));


    elapsedTime = Date.now();
    //Bringt Spiele-Seite zurück zur Index-Seite
    if(((elapsedTime - lastJumped)/1000) > 5){

           document.location.href = "http://127.0.0.1:8887/";
    }
    if(blockSend == 0 && blockLeft < 50){
        blockSend = 1;
    }
    //Gravity
    if(jumping == 0){
        character.style.top = (characterTop + 3) + "px";
    }

    holeBottom = gameHeight - holeBottom;

    if(checker == 0 && (character.style.display != "none" && ((characterTop > gameHeight - 20) || ((blockLeft < 100) && (blockLeft>-50) && ((characterTop<holeTop) || (characterTop > holeBottom)))))){

        blockSend = 1;

        elapsedTime = Date.now();
        hideObjectives();
        deathTimer++;
        checker=1;

        console.log("Gamescore: " + gameScore);
        //Öffnet Scoresheet und gibt Score an
        modal.style.display = "block";
        gameScore = gameScore;
        if(gameScore < 0){
            document.getElementById('popupText').innerText = "Du hast dein Bestes gegeben. Viel Erfolg beim nächsten Mal.";
        }else{
            document.getElementById('popupText').innerText = "Dein Score: " + gameScore;
        }
        gameScore = 0;

        //Startet einen X Sekunden langen Countdown währenddessen das Spiel nicht weitergespielt werden kann und durch ein Fenster mit dem gameScore blockiert wird
        var countDeathSeconds = setInterval(() => {
            deathTimer++;
            if(deathTimer>5){
                deathTimer = 0;

                clearInterval(countDeathSeconds);
            }

        }, 1000)
    }


}, 10);
 function startGameDisplay(){
    hideObjectives();
    startModal.style.display = "block";
 }
/*
function speedIncrease(){
    block.style.display = "none";
    blockBottom.style.display = "none";
    var speed = 0;
    console.log("testzwei");
    speed = setInterval(() => {

            console.log("speed" + speed);
            speed++;
            if(speed>2){
            speed = 0;
            console.log("triggered")
               block.style.display = "block";
               blockBottom.style.display = "block";
               block.style.left = '0%';
               blockBottom.style.left = '0%';
               clearInterval(speed);
            }

        }, 1000);

}*/
function pauseGame(){

    hideObjectives();
    block.style.left = '0%';
    blockBottom.style.left = '0%';
    block.style.animation = "paused";
    blockBottom.style.animation = "paused";

}

//Versteckt Character und Blöcke
function hideObjectives(){
        block.style.display = "none";
        blockBottom.style.display = "none";
        character.style.display = "none";
}
/*
function increaseSpeed(){
        switch(gameScore){
            case 2:
                block.style.animationDuration = "block 0.8s infinite linear";
                blockBottom.style.animationDuration = "blockBottom 0.8s infinite linear";
                break;
            case 15:
                block.style.animationDuration = "1.6s";
                blockBottom.style.animationDuration = "1.6s";
                break;
            case 20:
                block.style.animationDuration = "1.4s";
                blockBottom.style.animationDuration = "1.4s";
                break;
            case 30:
                block.style.animationDuration = "1.2s";
                blockBottom.style.animationDuration = "1.2s";
                break;
            case 40:
                block.style.animationDuration = "1s";
                blockBottom.style.animationDuration = "1s";
                break;
            case 50:
                block.style.animationDuration = "0.8s";
                blockBottom.style.animationDuration = "0.8s";
                break;
                default:
                    console.log("nothing happened...");
                    break;
        }
}
*/
function reset(){

    if(checker==1){
        block.style.left = '0%';
        blockBottom.style.left = '0%';
        character.style.top = '50%';
    }

    character.style.display = "block";
    block.style.display = "block";
    blockBottom.style.display = "block";
    modal.style.display = "none";
    checker = 0;

}

function startGame(){
    var startGameTimer=4;
                    block.style.animationDuration = "blockBottom 500s infinite linear";
                    blockBottom.style.animationDuration = "blockBottom 500s infinite linear";
    checker = 1;
    var countStartSeconds = setInterval(() => {
        startGameTimer--;
        document.getElementById('popupTextStart').innerText = "Spiel startet in " + startGameTimer;
        if(startGameTimer<0){
            startModal.style.display = "none";
            block.style.animationDuration = "blockBottom 2s infinite linear";
            blockBottom.style.animationDuration = "blockBottom 2s infinite linear";

            jump();

            clearInterval(countStartSeconds);
        }

    }, 1000)


}
function jump(){
    if(startModal.style.display == "block"){
        startGame();
    }else{
    reset();
    lastJumped = Date.now();

    jumping = 1;
    let jumpCount = 0;
    var jumpInterval = setInterval(function(){
        var characterTop = parseInt(window.getComputedStyle(character).getPropertyValue("top"));
        if(characterTop > 6) {
            document.getElementById("character").src = "./img/birdup.png";
            character.style.top= (characterTop-4)+"px";
        }
        if(jumpCount>20){
            clearInterval(jumpInterval);
            jumping = 0;
            jumpCount = 0;
        }
        jumpCount++;
    }, 10)
}
};
document.onkeydown = function (e) {
    if (e.keyCode == 32) {
        link.click();
    }
};