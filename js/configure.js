let configState = {
    preload: preloadImages,
    create: startPlay
};

function preloadImages()
{

    game.load.spritesheet('ball', 'assets/imgs/albondigaSprite.png', 60, 60, 8);
    game.load.spritesheet('platform', 'assets/imgs/obstacleSprite.png', 100, 25, 5);
    game.load.spritesheet('playerDeath', 'assets/imgs/albondigaDeath.png', 60, 60, 5);
    game.load.image('slab', 'assets/imgs/obstacle.png');

    game.load.image('virus', 'assets/imgs/virus.png');


    game.load.image('pup','assets/imgs/pup.png');
}


function startPlay() 
{
    game.state.start('play');
}
