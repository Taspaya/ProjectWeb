let configState = {
    preload: preloadImages,
    create: startPlay
};

function preloadImages()
{
    game.load.image('ball', 'assets/imgs/nave.png');
    game.load.image('slab', 'assets/imgs/obstacle.png');
}


function startPlay() 
{
    game.state.start('play');
}
