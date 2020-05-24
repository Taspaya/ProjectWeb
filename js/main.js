let game;



function startGame() 
{

    let playScreen = document.getElementById("playScreen");
    playScreen.style.display = "none";

    game = new Phaser.Game(GAME_AREA_WIDTH, GAME_AREA_HEIGHT, Phaser.CANVAS, 'platformGameStage');


    // Play Screen
    game.state.add('configure', configState);
    game.state.add('play', playState);
    game.state.add('end', endState);
    game.state.start('configure');
    
}

function startInLv2(){
    currentLevel = 2;
    startGame();
}