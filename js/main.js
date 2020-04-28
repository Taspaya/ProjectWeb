let game;



function startGame() 
{

    let initialScreen = document.getElementById("initialScreen");
    initialScreen.style.display = "none";

    game = new Phaser.Game(GAME_AREA_WIDTH, GAME_AREA_HEIGHT, Phaser.CANVAS, 'platformGameStage');


    // Play Screen
    game.state.add('configure', configState);
    game.state.add('play', playState);

    game.state.start('configure');

    // Add the instruction required to start the 'welcome' state
}