var backendGameUrl = "https://codingprof.hs-rw.de/city-revival-game/game.html";
var eventSourceUrl = "https://codingprof.hs-rw.de/cityrevivalbackend/button-click";
var backendUrl = "https://codingprof.hs-rw.de/city-revival-game/";

var block = document.getElementById("block");
var blockBottom = document.getElementById("blockBottom");
var hole = document.getElementById("hole");
var character = document.getElementById("character");
var link = document.getElementById("jumpButton");
var game = document.getElementById("game");
var modal = document.getElementById("myModal");
var startModal = document.getElementById("startModal");

var startGameTimer=4;
var startGamevar = 0;

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
var gravity = parseInt(window.getComputedStyle(game).getPropertyValue("height")) / 233; //Character geht runter
var jumpStrength; //Character geht hoch

//Tracking Time
var elapsedTime; //Wird stetig aktualisiert und wird im verlgeich mit lastJumped für die Aktivität genutzt
var deathTimer = 0; //Wie lange ist die Runde vorbei - Wird dafür bentuzt das Fenster zu blockieren
var lastJumped; // Wann wurde das letzte mal gesprungen - Wird dafür bentutzt um auf Aktivität zu prüfen

//Erhält und verarbeitet die Informationen vom Controller-Frontend
var source = new EventSource(eventSourceUrl);
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

    var gameHeight = parseInt(window.getComputedStyle(game).getPropertyValue("height"));
    var charHeight = parseInt(window.getComputedStyle(character).getPropertyValue("height"));
    var holeMath = gameHeight - charHeight*3;

    console.log("LOCH IM BLOCK: " + holeMath);
    var randomHeight = Math.floor(Math.random()*holeMath) +1;

    console.log("Game Height: " + gameHeight);
    var rest = gameHeight - randomHeight;
    console.log("REST: " + rest);
    if(rest > charHeight*3){
        rest = rest - charHeight*3;
    }

    block.style.height = gameHeight/2;
    console.log("Height: " + block.style.height);
    blockBottom.style.height = gameHeight/2;

    block.style.height = randomHeight + "px";
    blockBottom.style.height = rest + "px";
    if(gameHeight - randomHeight - rest == 0){
        blockBottom.style.top = charHeight*3;
    }else{
        blockBottom.style.top = gameHeight - randomHeight - rest;
    }
    
    console.log("gameHeight: " + gameHeight);
    console.log("randomHeight: " + randomHeight);
    console.log("REST: " + rest);
    console.log("TOP: " + blockBottom.style.top);
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
    var characterSize = parseInt(window.getComputedStyle(character).getPropertyValue("width"));




    elapsedTime = Date.now();
    //Bringt Spiele-Seite zurück zur Index-Seite
    if(((elapsedTime - lastJumped)/1000) > 30){

           document.location.href = backendUrl;
    }
    if(blockSend == 0 && blockLeft < 50){
        blockSend = 1;
    }
    //Gravity
    if(jumping == 0){
        character.style.top = (characterTop + gravity+1) + "px";
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
            document.getElementById('popupText').innerText = "Dein Score: " + gameScore + "\n\n\n Blaue Fläche druecken um nochmal zu spielen!";
        }
        gameScore = 0;

        //Startet einen X Sekunden langen Countdown währenddessen das Spiel nicht weitergespielt werden kann und durch ein Fenster mit dem gameScore blockiert wird
        var countDeathSeconds = setInterval(() => {
            deathTimer++;
            //document.getElementById('popupText').innerText = "Dein Score: " + gameScore  + Enviroment.NewLine + " Druecke Springen in " + deathTimer + "Sekunden um ein neues Spiel zu starten.";
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
    var gameHeight = parseInt(window.getComputedStyle(game).getPropertyValue("height"));
    var temp = gameHeight / 7;
    character.style.width = temp + "px";
    character.style.height = temp + "px";
 }

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
    startGameTimer=4;

}


function jump(){
    if(startGamevar==0){
        console.log("Trigger function");
        startGame();
    }
    else{
        reset();
        lastJumped = Date.now();

    jumping = 1;
    let jumpCount = 0;
    var jumpInterval = setInterval(function(){
        var characterTop = parseInt(window.getComputedStyle(character).getPropertyValue("top"));
        if(characterTop > 6) {
            document.getElementById("character").src = "./img/birdup.png";
            character.style.top= (characterTop-gravity-1)+"px";
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

function startGame(){


        block.style.animationDuration = "blockBottom 500s infinite linear";
        blockBottom.style.animationDuration = "blockBottom 500s infinite linear";
        checker = 1;
        
        var countStartSeconds = setInterval(() => {
            
            startGameTimer--;
            document.getElementById('popupTextStart').innerText = "Spiel startet in " + startGameTimer;
            if(startGameTimer<0){
                console.log("StartTimer in Intervall" + startGameTimer);
                startModal.style.display = "none";
                block.style.animationDuration = "blockBottom 5s infinite linear";
                blockBottom.style.animationDuration = "blockBottom 2s infinite linear";
                startGamevar=1;

                jump();

                clearInterval(countStartSeconds);
            }

        }, 1000)

    }

/*    
function increaseSpeed(){
    console.log("trigger1");
        switch(gameScore){
            case 2:
                console.log("trigger2");
                block.style.animationDuration = "block 0.8s infinite linear";
                blockBottom.style.animationDuration = "blockBottom 0.8s infinite linear";
                break;
            case 2:
                startGame();
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