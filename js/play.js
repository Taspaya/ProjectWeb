
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

const OBSTACLE_SPEED = 100;
const OBSTACLE_SPEEDX = 150;
const OBSTACLE_COLOR = "#0360ff";
const OBSTACLE_WIDTH = 100;

//PHYSIX

const PROBABILITY_ACCELERATE = 0.7;
const GLOBAL_ACCELERATION = 3;
const THRESHOLD = -500;

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
let qBTN;
let qBool;

let cursors;

let global_speed = 2;
let obs;
let random;

let obstaclesGroup;
let virusGroup;
let pUpsGroup;
let trapsGroup;
let trapsDancingGroup;

let havePower = false;

let gap;
let gaps    =       [-2 , 1 , 3 , 0 , 0 , 0 , 1 , 2 , 1 ];
let gapsTwo =       [-2 , 1 , 3 , 0 , 0 , 0 , 1 , 2 , 1 ];

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

let playState = {
    create: createPlay,
    update: updatePlay
};

function createPlay()
{
    leftBTN = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
    rightBTN = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);

    qBool = false;
    game.input.enabled = true;
    havePower = false;
    obstaclesGroup = game.add.group();
    virusGroup = game.add.group();
    pUpsGroup = game.add.group();
    trapsGroup = game.add.group();
    trapsDancingGroup = game.add.group();
    trapsDancingGroup.enableBody = true;
    trapsGroup.enableBody = true;
    obstaclesGroup.enableBody = true;
    virusGroup.enableBody = true;
    pUpsGroup.enableBody = true;
    createKeyControls();
    createBall();
    createHUD();
    createLevelTwo();
    //createLevelOne();
}

function updatePlay()
{
    if(qBTN.isDown)
    {
        if(qBool) qBool = false;
        else qBool = true;
    }

    game.physics.arcade.overlap(obstaclesGroup,ball, rebound, null, this);
    game.physics.arcade.overlap(virusGroup, ball, collapseVirus, null, this);
    game.physics.arcade.overlap(pUpsGroup, ball, getPowerUp, null, this);
    game.physics.arcade.overlap(trapsGroup, ball, collapseTrap, null, this);

    powerup();
    manageGravity();

    if (juega) ball.animations.play('pelota');

    if (leftBTN.isDown || game.input.mousePointer.x > game.width/2 && qBool) 
    {
        MoveLeft();
    }
    else if (rightBTN.isDown || game.input.mousePointer.x < game.width/2 && qBool) 
    {
        MoveRight();
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
        for(let i = 0; i < trapsGroup.children.length; i++)
        {
            game.physics.arcade.enable(trapsGroup.children[i]);
            trapsGroup.children[i].body.velocity.x = 0;
        }
    }

  makeItDance(); // ESTO ESTA MAL EN EL UPDATE, HAY QUE PONER UN BOOL
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
    for(let i = 0; i < trapsGroup.children.length; i++)
    {
        game.physics.arcade.enable(trapsGroup.children[i]);
        trapsGroup.children[i].body.velocity.y = trapsGroup.children[i].body.velocity.y - GLOBAL_ACCELERATION;
    }
}

function virusDance(virus) 
{
  
    // define the camera offset for the quake
    var rumbleOffset = 50;
    
    // we need to move according to the camera's current position
    var properties = {
      x: virus.x - rumbleOffset
    };
    
    // we make it a relly fast movement
    var duration = 100;
    // because it will repeat
    var repeat = 4;
    // we use bounce in-out to soften it a little bit
    var ease = Phaser.Easing.Bounce.InOut;
    var autoStart = false;
    // a little delay because we will run it indefinitely
    var delay = 1000;
    // we want to go back to the original position
    var yoyo = true;
    
    var dance = game.add.tween(virus).to(properties, duration, ease, autoStart, delay, 4, yoyo);
    
    // we're using this line for the example to run indefinitely
    dance.onComplete.addOnce(virusDance);
    
    // let the earthquake begins
    dance.start();
}
  
function makeItDance()
{
    for(let i = 0; i < virusGroup.length; i++)
    {
        if(ball.body.y > virusGroup.children[i].body.y - 50 && ball.body.y < virusGroup.children[i].body.y + 50 ) virusDance(virusGroup.children[i].body);
    }
}

function createLevelOne()
{

    let distance = game.height;

    for(let i = 0; i < gaps.length ; i++)
    {
        createobstaclesGroup(distance,gaps[i], pups[i], 2, true);
        createVirus(0,distance - 80);

        distance = distance + 450;
    }    

    createobstaclesGroup(distance, 19, null, null,false);
}

function createLevelTwo()
{

    let distance = game.height;

    for(let i = 0; i < gapsTwo.length ; i++)
    {
        createobstaclesGroup(distance,gapsTwo[i], pups[i], 2, true);
        createVirus(0,distance - 80);

        distance = distance + 450;
    }

    createobstaclesGroup(distance, 19, null, null,false);
}

function createKeyControls()
{
    rightBTN = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
    leftBTN = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
    qBTN = game.input.keyboard.addKey(Phaser.Keyboard.Q);
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

function createobstaclesGroup(distance,gap, powerup, trap, breakable)
{
    for(let i = -500,  j = -10; j < 18; i = i + 80, j++)
    {
        if(j == trap)
        {
            createTrap(i,game.height + distance);
        }
        else if(j != gap )
        createObstacle(i, game.height + distance, breakable);
        else if (j == gap && powerup)
        createPowerUp(i,  game.height + distance);
    }
}

function getPowerUp(ball, _pup)
{
    if(_pup.key = "pup" && havePower == false)
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

function collapseTrap(ball, _trap)
{

    if(_trap.key == "trap")
    {
        updateHealthBar(.5);

        // AQUI ANMACIÓN DE DAÑO O LO QUE SEA

        _trap.destroy();
    }

}

function collapseVirus(ball, _virus)
{
    if(_virus.key == "virus")
    {
        updateHealthBar(.5);

        // AQUI ANMACIÓN DE DAÑO O LO QUE SEA
        
        _virus.destroy();

    }

    collapseTrap(ball, _virus);

}


function rebound(ball, _obstacle)
{

    if(_obstacle.key == "slab" || _obstacle.key == "slab_end" )
    {
        havePower = false;
        if(_obstacle.body.velocity.y < THRESHOLD && _obstacle.key == "slab" ) _obstacle.destroy();

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
        for(let i = 0; i < trapsGroup.children.length; i++)
        {            
            game.physics.arcade.enable(trapsGroup.children[i]);
            trapsGroup.children[i].body.velocity.y = OBSTACLE_SPEED; 
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

function createObstacle(x,y, breakable)
{
    if(breakable == false)
    {
        obstacle = game.add.sprite(x,y, 'slab_end');
    }
    else
    {
        obstacle = game.add.sprite(x,y, 'slab');
    }
    game.physics.arcade.enable(obstacle);
    obstacle.width = 80;
    obstacle.height = 20;

    obstacle.body.velocity.y = -OBSTACLE_SPEED;
    obstaclesGroup.add(obstacle);

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
    trap = game.add.sprite(x,  y, 'trap');
    game.physics.arcade.enable(trap);
    trap.width = 80;
    trap.height = 20;
    trap.body.velocity.y = -OBSTACLE_SPEED;
    trap.body.velocity.x = 0;
    trapsGroup.add(trap);
}

function goToWelcome() {
    game.world.setBounds(0, 0, game.width, game.height);
    game.state.start('welcome');
}

function MoveRight()
{

    for(let i = 0; i < obstaclesGroup.children.length; i++)
    {
        game.physics.arcade.enable(obstaclesGroup.children[i]);
        obstaclesGroup.children[i].body.velocity.x =  -  OBSTACLE_SPEEDX;
    }

    for(let i = 0; i < virusGroup.children.length; i++)
    {
        game.physics.arcade.enable(virusGroup.children[i]);
        virusGroup.children[i].body.velocity.x = - OBSTACLE_SPEEDX;
    }

    for(let i = 0; i < pUpsGroup.children.length; i++)
    {
        game.physics.arcade.enable(pUpsGroup.children[i]);
        pUpsGroup.children[i].body.velocity.x = - OBSTACLE_SPEEDX;
    }

    for(let i = 0; i < trapsGroup.children.length; i++)
    {
        game.physics.arcade.enable(trapsGroup.children[i]);
        trapsGroup.children[i].body.velocity.x = - OBSTACLE_SPEEDX;

    }

    
}

function MoveLeft()
{

    for(let i = 0; i < obstaclesGroup.children.length; i++)
    {
        game.physics.arcade.enable(obstaclesGroup.children[i]);
        obstaclesGroup.children[i].body.velocity.x =  OBSTACLE_SPEEDX;
    }

    for(let i = 0; i < virusGroup.children.length; i++)
    {
        game.physics.arcade.enable(virusGroup.children[i]);
        virusGroup.children[i].body.velocity.x =  OBSTACLE_SPEEDX;
    }

    for(let i = 0; i < pUpsGroup.children.length; i++)
    {
        game.physics.arcade.enable(pUpsGroup.children[i]);
        pUpsGroup.children[i].body.velocity.x = OBSTACLE_SPEEDX;
    }

    
    for(let i = 0; i < trapsGroup.children.length; i++)
    {
        game.physics.arcade.enable(trapsGroup.children[i]);
        trapsGroup.children[i].body.velocity.x =  OBSTACLE_SPEEDX;
    }
}
