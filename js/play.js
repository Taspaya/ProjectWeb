
//#region CONSTANTS  
//GAME AREA
const GAME_AREA_WIDTH = 400;
const GAME_AREA_HEIGHT = 800;
const SQUARE_SIZE = 40;
const FPS = 30;

// BALL

const SQUARE_COLOR = "#cc0000"; // BALL_COLOR
const SQUARE_SPEED_X = 0;       // BALL_SPEEDX
const SQUARE_SPEED_Y = 0;       // BALL_SPEEDY

// OBSTACLES

const OBSTACLE_SPEED = 120;
const OBSTACLE_SPEEDX = 15;
const OBSTACLE_COLOR = "#0360ff";
const OBSTACLE_WIDTH = 100;

//PHYSIX

const PROBABILITY_ACCELERATE = 0.7;
const GLOBAL_ACCELERATION = 2;
const THRESHOLD = -400;

// KEYCODES

const RIGHTARROW_KEYCODE = 39;
const LEFTARROW_KEYCODE = 37;
const UPARROW_KEYCODE = 38;
const DOWNARROW_KEYCODE = 40;

//#endregion

//#region GLOBALS

const max_vida = 100;

let juega = true;

let virus;

let pUp;

let trap;

let ball;
let rightBTN;
let leftBTN;

let cursors;

let global_speed = 2;
let obs;
let random;

let obstaclesGroup;
let virusGroup;
let pUpsGroup;

let havePower = false;

let gap;
let gaps = [-2 , 1 , 3 , 0 , 0 , 0 , 1 , 2 , 1 ];

let totalPlataformas = 10;

let pups = [false , false , true , false , true , false , false , false , true ];

let rightArrowPressed = false,
    leftArrowPressed = false,
    upArrowPressed = false,
    downArrowPressed = false;

let seconds, timeout, theChrono, lifes;
let continueGame = true;
let Currentlifes = 3;   
let counter = 0;

//if(body.touching.down){}

let playState = {
    create: createPlay,
    update: updatePlay
};

function createPlay()
{
    leftBTN = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
    rightBTN = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);

    game.input.enabled = true;
    havePower = false;
    obstaclesGroup = game.add.group();
    virusGroup = game.add.group();
    pUpsGroup = game.add.group();
    obstaclesGroup.enableBody = true;
    virusGroup.enableBody = true;
    pUpsGroup.enableBody = true;
    createKeyControls();
    createBall();
    createHUD();
    createLevelOne();

}

function updatePlay()
{
    game.physics.arcade.overlap(obstaclesGroup,ball, rebound, null, this);
    game.physics.arcade.overlap(virusGroup, ball, collapseVirus, null, this);
    game.physics.arcade.overlap(pUpsGroup, ball, getPowerUp, null, this);
    
    powerup();

    manageGravity();

    if (juega) ball.animations.play('pelota');

    if (leftBTN.isDown) 
    {
        for(let i = 0; i < obstaclesGroup.children.length; i++)
        {
            game.physics.arcade.enable(obstaclesGroup.children[i]);
            obstaclesGroup.children[i].body.velocity.x = -300;
        }
        for(let i = 0; i < virusGroup.children.length; i++)
        {
            game.physics.arcade.enable(virusGroup.children[i]);
            virusGroup.children[i].body.velocity.x = -300;
        }
        for(let i = 0; i < pUpsGroup.children.length; i++)
        {
            game.physics.arcade.enable(pUpsGroup.children[i]);
            pUpsGroup.children[i].body.velocity.x = -300;
        }
    }
    else if (rightBTN.isDown) 
    {
        for(let i = 0; i < obstaclesGroup.children.length; i++)
        {
            game.physics.arcade.enable(obstaclesGroup.children[i]);
            obstaclesGroup.children[i].body.velocity.x = 300;
        }
        for(let i = 0; i < virusGroup.children.length; i++)
        {
            game.physics.arcade.enable(virusGroup.children[i]);
            virusGroup.children[i].body.velocity.x = 300;
        }
        for(let i = 0; i < pUpsGroup.children.length; i++)
        {
            game.physics.arcade.enable(pUpsGroup.children[i]);
            pUpsGroup.children[i].body.velocity.x = 300;
        }
    }
    else 
    {
        for(let i = 0; i < obstaclesGroup.children.length; i++)
        {
            game.physics.arcade.enable(obstaclesGroup.children[i]);
            obstaclesGroup.children[i].body.velocity.x = 0;
        }
        for(let i = 0; i < virusGroup.children.length; i++)
        {
            game.physics.arcade.enable(virusGroup.children[i]);
            virusGroup.children[i].body.velocity.x = 0;
        }
        for(let i = 0; i < pUpsGroup.children.length; i++)
        {
            game.physics.arcade.enable(pUpsGroup.children[i]);
            pUpsGroup.children[i].body.velocity.x = 0;
        }
    }
}

function manageGravity()
{

    for(let i = 0; i < obstaclesGroup.children.length; i++)
    {
        game.physics.arcade.enable(obstaclesGroup.children[i]);
        obstaclesGroup.children[i].body.velocity.y = obstaclesGroup.children[i].body.velocity.y -  GLOBAL_ACCELERATION;
    }

    for(let i = 0; i < virusGroup.children.length; i++)
    {
        game.physics.arcade.enable(virusGroup.children[i]);
        virusGroup.children[i].body.velocity.y = virusGroup.children[i].body.velocity.y - GLOBAL_ACCELERATION;
    }

    for(let i = 0; i < pUpsGroup.children.length; i++)
    {
        game.physics.arcade.enable(pUpsGroup.children[i]);
        pUpsGroup.children[i].body.velocity.y = pUpsGroup.children[i].body.velocity.y - GLOBAL_ACCELERATION;
    }

}

function createLevelOne()
{

    let distance = game.height;

    for(let i = 0; i < gaps.length ; i++)
    {
        createobstaclesGroup(distance,gaps[i], pups[i]);
        createVirus(0,distance - 80);

        distance = distance + 450;
    }    

    createobstaclesGroup(distance, 19);
}

function createKeyControls()
{
    rightBTN = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
    leftBTN = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
}

function createBall()
{
    let x = game.world.centerX - 20;
    let y = game.world.centerY * 0.1  ;
    ball = game.add.sprite(x,y, 'ball');


    ball.width = 30;
    ball.height = 30;
    game.physics.arcade.enable(ball);

    ball.animations.add('pelota', [0,1,2,3,4,5,6,7], 14, true);

}

function createobstaclesGroup(distance,gap, powerup, trap)
{
    for(let i = -500,  j = -10; j < 18; i = i + 80, j++)
    {
        if(j != gap )
        createObstacle(i, game.height + distance);
        else if (j == gap && powerup)
        createPowerUp(i,  game.height + distance);
    }

}

function getPowerUp(ball, _pup)
{
    if(_pup.key = "pup")
    {
        havePower = true;
        _pup.destroy();
        
        for(let i = 0; i < obstaclesGroup.children.length; i++)
        {
            game.physics.arcade.enable(obstaclesGroup.children[i]);
            obstaclesGroup.children[i].body.velocity.y = obstaclesGroup.children[i].body.velocity.y -  4;
        }
    
        for(let i = 0; i < virusGroup.children.length; i++)
        {
            game.physics.arcade.enable(virusGroup.children[i]);
            virusGroup.children[i].body.velocity.y = virusGroup.children[i].body.velocity.y - 4;
        }
    
        for(let i = 0; i < pUpsGroup.children.length; i++)
        {
            game.physics.arcade.enable(pUpsGroup.children[i]);
            pUpsGroup.children[i].body.velocity.y = pUpsGroup.children[i].body.velocity.y - 4;
        }
    }
}

function powerup(){
    var icon = hudGroup.children[3];
 
    if (havePower){
        icon.visible = true;
    }
    else icon.visible = false;
  
}

function collapseVirus(ball, _virus)
{
    if(_virus.key == "virus")
    {
        updateHealthBar(.5);
        // AQUI FUNCIÓN DE LO DE BAJAR LA VIDA

        // AQUI ANMACIÓN DE DAÑO O LO QUE SEA
        
        _virus.destroy();

    }

}

function rebound(ball, _obstacle)
{

    if(_obstacle.key == "slab")
    {
        havePower = false;
        if(_obstacle.body.velocity.y < THRESHOLD) _obstacle.destroy();

        for(let i = 0; i < obstaclesGroup.children.length; i++)
        {
            game.physics.arcade.enable(obstaclesGroup.children[i]);
            obstaclesGroup.children[i].body.velocity.y = OBSTACLE_SPEED;       
            
            juega = false;
            ball.animations.stop(null, true);
            ball.animations.add('muerte', [0,1,2,3,4], 10, false);
            ball.loadTexture('playerDeath', true);
            ball.animations.play('muerte');
        }
        for(let i = 0; i < virusGroup.children.length; i++)
        {            
            game.physics.arcade.enable(virusGroup.children[i]);
            virusGroup.children[i].body.velocity.y = OBSTACLE_SPEED; 

        }
        for(let i = 0; i < pUpsGroup.children.length; i++)
        {            
            game.physics.arcade.enable(pUpsGroup.children[i]);
            pUpsGroup.children[i].body.velocity.y = OBSTACLE_SPEED; 

        }

    }

    

    
}

function updateHealthBar(damage) {

    healthBar.scale.x -= .40 * damage; //Velocitat * 40% 
    if (healthBar.scale.x <= 0) healthBar.scale.x = 0;

}

function createHUD() {

    hudGroup = game.add.group();
    hudGroup.create(5, 5, 'heart');
    hudGroup.create(50, 15, 'healthholder');
    healthBar = hudGroup.create(50,15,'healthbar');
    hudNamePlayer=game.add.text(5,45,nombreJugador,{fill: '#FFFFFF', fontSize: 20});
    hudPlatforms=game.add.text(345,760,totalPlataformas,{fill: '#FFFFFF', fontSize: 20});
    hudGroup.create(320, 700, 'powerUp');
    hudGroup.add(hudNamePlayer);

    hudGroup.fixedToCamera = true;
    healthValue = max_vida;

}

function createObstacle(x,y)
{
    obstacle = game.add.sprite(x,y, 'slab');
    game.physics.arcade.enable(obstacle);
    obstacle.width = 80;
    obstacle.height = 20;
    obstacle.body.velocity.y = -OBSTACLE_SPEED;
    obstaclesGroup.add(obstacle);
    
    obstacle.body.checkCollision.right = false;
    obstacle.body.checkCollision.left = false;

}

function createVirus(x,y)
{
    virus = game.add.sprite(x, game.height + y,'virus');
    game.physics.arcade.enable(virus);
    virus.width = 80;
    virus.height = 60;
    virus.body.velocity.y = -OBSTACLE_SPEED;
    virus.body.velocity.x = 0;
    virusGroup.add(virus);
}

function createPowerUp(x, y)
{
    pUp = game.add.sprite(x + 15,  y - 15,'pup');
    game.physics.arcade.enable(pUp);
    pUp.width = 40;
    pUp.height = 60;
    pUp.body.velocity.y = -OBSTACLE_SPEED;
    pUp.body.velocity.x = 0;
    pUpsGroup.add(pUp);

}

function createTrap(x,y)
{
    trap = game.add.sprite(x + 15,  y - 15, 'trap');
    game.physics.arcade.enable(trap);
    trap.width = 40;
    trap.height = 50;
    trap.body.velocity.y = -OBSTACLE_SPEED;
    trap.body.velocity.x = 0;
    trap.add(trap);
}

function goToWelcome() {
    game.world.setBounds(0, 0, game.width, game.height);
    game.state.start('welcome');
}


