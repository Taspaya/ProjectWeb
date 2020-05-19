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
    game.load.image('slab_end', 'assets/imgs/obstacle_end.png');


    game.load.image('trap', 'assets/imgs/trap.png');

    game.load.image('virus', 'assets/imgs/virus.png');


    game.load.image('pup','assets/imgs/pup.png');


    game.load.image('star','assets/imgs/stars.png');

    game.load.image('shield','assets/imgs/shield.png');


    game.load.image('heart', 'assets/imgs/heart.png');
    game.load.image('healthholder', 'assets/imgs/health_holder.png');
    game.load.image('healthbar', 'assets/imgs/health_bar.png');
    game.load.image('powerUp', 'assets/imgs/powerup.png');




}


function startPlay() 
{
    game.state.start('play');
}
