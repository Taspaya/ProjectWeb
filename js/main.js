let game;



function startGame() 
{

    let initialScreen = document.getElementById("initialScreen");
    initialScreen.style.display = "none";

    game = new Phaser.Game(GAME_AREA_WIDTH, GAME_AREA_HEIGHT, Phaser.CANVAS, 'platformGameStage');

    // Welcome Screen
    //game.state.add('welcome', initialState);
    // About Screen
    //game.state.add('about', aboutState);
    // Config Screen
    //game.state.add('config', configState);
    // Play Screen
    game.state.add('play', playState);

    game.state.start('play');

    // Add the instruction required to start the 'welcome' state
}