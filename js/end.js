let gameOverMusic;
let restartCounter;
let text3 = 0;
let finalCounter;

let timer;


let endState = {
    preload: preloadEnd,
    create: createEnd
};


function preloadEnd(){
}

function createEnd(){

    restartCounter = 15;
    music.stop();
    gameOverMusic = game.add.audio('gameover');
    gameOverMusic.loopFull();
    var text = ("Thanks for\nplaying!\nYou " + wol + "!");
    var style = { font: "50px Arial", fill: "#FFFFFF", align: "center" };
    var t = game.add.text(game.world.centerX-120, 150, text, style);

    var text2 = "Platforms traversed: " + plataformasFinal;
    var style2 = { font: "30px Arial", fill: "#00FCE5", align: "center" };
    var t = game.add.text(game.world.centerX-140, 350, text2, style2);

    timer = game.time.events.add(1000, updateCounter, this);

    var button = game.add.button(game.world.centerX - 115, 400, 'replay', startMain, this, 2, 1, 0);

    text3 = "Start again in: " + restartCounter;
    var style3 = { font: "20px Arial", fill: "#FFFFFF", align: "center" };
    finalCounter = game.add.text(game.world.centerX-85, 500, text3, style3);

    var text4 = "~Or play S to restart~";
    var t = game.add.text(game.world.centerX-100, 650, text4, style3);


    
    


    document.body.onkeyup = function(e){
        if(e.keyCode == 83){
            gameOverMusic.stop();
            game.destroy();
            startGame();
        }
    }
}

function updateCounter() {
    restartCounter--;
    text3 = "Start again in: " + (restartCounter);
    finalCounter.setText(text3);
    if (restartCounter > 0) timer = game.time.events.add(1000, updateCounter, this); 
    else startMain();
    
    
}

function startMain(){
    game.time.events.remove(timer);
    gameOverMusic.stop();
    game.destroy();
    playScreen.style.display = "inline-block";
}





