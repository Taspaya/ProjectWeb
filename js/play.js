
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

const OBSTACLE_SPEED = 200;
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

let currentLevel = 1;

var indexWhereToFix;
var style;
let letter;

let ava;

let juega = true;

let virus;

let pUp;

let trap;

let star;
let ball;
let rightBTN;
let leftBTN;
let qBTN;
let fbtn;
let qBool;

let cursors;

let global_speed = 2;
let obs;
let random;


let bgGroup;
let shieldGroup;
let obstaclesGroup;
let virusGroup;
let pUpsGroup;
let trapsGroup;
let trapsDancingGroup;

let havePower = false;
let haveShield = false;

let gap;
let gaps    =       [-2 , 1 , 3 , 0 , 0 , 0 , 1 , 2 , 1 ];
let gapsTwo =       ['L' , 1 , 3 , 0 , 0 , 0 , 1 , 2 , 1 ];

let totalPlataformas = 10;

let pups = [false , false , true , false , true , false , false , false , true ];
let pupsTwo = [false , false , false , false , false , false , false , false , false ];

let rightArrowPressed = false,
    leftArrowPressed = false,
    upArrowPressed = false,
    downArrowPressed = false;

let seconds, timeout, theChrono, lifes;
let continueGame = true;
let Currentlifes = 3;   
let counter = 0;

//#endregion


let playState = {
    create: createPlay,
    update: updatePlay
};

function createPlay()
{
    game.stage.backgroundColor = 0x050035;
    leftBTN = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
    rightBTN = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);

    ava = false;
    qBool = false;
    game.input.enabled = true;
    havePower = false;
    shieldGroup = game.add.group();
    bgGroup = game.add.group();
    obstaclesGroup = game.add.group();
    virusGroup = game.add.group();
    pUpsGroup = game.add.group();
    trapsGroup = game.add.group();
    trapsDancingGroup = game.add.group();
    shieldGroup.enableBody = true;
    bgGroup.enableBody = true;
    trapsDancingGroup.enableBody = true;
    trapsGroup.enableBody = true;
    obstaclesGroup.enableBody = true;
    virusGroup.enableBody = true;
    pUpsGroup.enableBody = true;

    
    generateBg();
    createKeyControls();
    createBall();
    style = { font: "32px Arial", fill: "#ff0044", wordWrap: true, wordWrapWidth: ball.width, align: "center", backgroundColor: "#ffff00" };
    createHUD();


    levelGenerator(15); //numSlabs, gaps ,traps, breakable, pups, shields 
    //createLevelTwo();
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
    game.physics.arcade.overlap(shieldGroup, ball, collapseShield, null, this);

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
        for(let i = 0; i < shieldGroup.children.length; i++)
        {
            game.physics.arcade.enable(shieldGroup.children[i]);
            shieldGroup.children[i].body.velocity.x =  0;
        }
    }

    makeItDance();    
    //fixLetterToSlab();
    deleteStuff();


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
    for(let i = 0; i < bgGroup.children.length; i++)
    {
        game.physics.arcade.enable(bgGroup.children[i]);
        bgGroup.children[i].body.velocity.y = bgGroup.children[i].body.velocity.y - GLOBAL_ACCELERATION;
    }    
    for(let i = 0; i < shieldGroup.children.length; i++)
    {
        game.physics.arcade.enable(shieldGroup.children[i]);
        shieldGroup.children[i].body.velocity.y = shieldGroup.children[i].body.velocity.y - GLOBAL_ACCELERATION;
    }
}

function virusDance(virus) 
{
    if(virus.x - ball.x > 0) 
    virus.velocity.x = -150;
    else 
    virus.velocity.x = 150;   
}
  
function makeItDance()
{
    for(let i = 0; i < virusGroup.length; i++)
    {
        if(virusGroup.children[i].isDancing)
        {       
             if(ball.body.y > virusGroup.children[i].body.y - 50 && ball.body.y < virusGroup.children[i].body.y + 50 ) 
            { 
                    virusDance(virusGroup.children[i].body);
            }
        }

    }
}

function createLevelOne()
{

    let distance = game.height;

    for(let i = 0; i < gaps.length ; i++)
    {
        createobstaclesGroup(distance,gaps[i], pups[i], 2, true);
        createVirus(0,distance - 40);
        distance = distance + 450;
    }    

    createobstaclesGroup(distance, 19, null, null,false);
}

function createLevelTwo()
{

    let distance = game.height;

    for(let i = 0; i < gapsTwo.length ; i++)
    {
        if(gapsTwo[i] != 'L')
        {
            createobstaclesGroup(distance,gapsTwo[i], pupsTwo[i], 2, true);
            createVirus(0,distance - 40);
        }
        else
        {
            createObtacleGroupWithLetter(distance, "L", 6)
        }

        if(i == 2) createshield(obstaclesGroup.children[8].x,distance);
        distance = distance + 450;
    }

    createobstaclesGroup(distance, 19, null, null,false);
}


function createKeyControls()
{
    rightBTN = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
    leftBTN = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
    qBTN = game.input.keyboard.addKey(Phaser.Keyboard.Q);
    fbtn = game.input.keyboard.addKey(Phaser.Keyboard.L);
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

function createobstaclesGroup(distance, gap, powerup, trap, breakable)
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

function createObtacleGroupWithLetter(distance, text, index)
{
    for(let i = -500,  j = -10; j < 18; i = i + 80, j++)
    {
        createObstacle(i, game.height + distance, false);
    }

    ava = true;
    letter = game.add.text(0, 0, text, style)
    indexWhereToFix = 8;
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
            obstaclesGroup.children[i].body.velocity.y = THRESHOLD;
        }
    
        for(let i = 0; i < virusGroup.children.length; i++)
        {
            game.physics.arcade.enable(virusGroup.children[i]);
            virusGroup.children[i].body.velocity.y = THRESHOLD;
        }
    
        for(let i = 0; i < pUpsGroup.children.length; i++)
        {
            game.physics.arcade.enable(pUpsGroup.children[i]);
            pUpsGroup.children[i].body.velocity.y = THRESHOLD;
        }
        for(let i = 0; i < trapsGroup.children.length; i++)
        {
            game.physics.arcade.enable(trapsGroup.children[i]);
            trapsGroup.children[i].body.velocity.y = THRESHOLD;
        }
    }
}

function powerup(){
    
    var icon = hudGroup.children[3];
 
    if (havePower)
    {
        icon.visible = true;
    }
    else icon.visible = false;
  
}

function collapseShield(ball, shield )
{

    if(shield.key = "shield" && haveShield == false)
    {
        haveShield = true;
        shield.destroy();
        
        for(let i = 0; i < obstaclesGroup.children.length; i++)
        {
            game.physics.arcade.enable(obstaclesGroup.children[i]);
            obstaclesGroup.children[i].body.velocity.y = obstaclesGroup.children[i].body.velocity.y -  10;
        }
    
        for(let i = 0; i < virusGroup.children.length; i++)
        {
            game.physics.arcade.enable(virusGroup.children[i]);
            virusGroup.children[i].body.velocity.y = virusGroup.children[i].body.velocity.y - 10;
        }
    
        for(let i = 0; i < pUpsGroup.children.length; i++)
        {
            game.physics.arcade.enable(pUpsGroup.children[i]);
            pUpsGroup.children[i].body.velocity.y = pUpsGroup.children[i].body.velocity.y - 10;
        }
        for(let i = 0; i < pUpsGroup.children.length; i++)
        {
            game.physics.arcade.enable(pUpsGroup.children[i]);
            pUpsGroup.children[i].body.velocity.y = pUpsGroup.children[i].body.velocity.y - 10;
        }
        for(let i = 0; i < shieldGroup.children.length; i++)
        {
            game.physics.arcade.enable(shieldGroup.children[i]);
            shieldGroup.children[i].body.velocity.y = shieldGroup.children[i].body.velocity.y - 10;
        }




    }
}

function collapseTrap(ball, _trap)
{

    if(_trap.key == "trap" && !haveShield)
    {
        updateHealthBar(.5);
        // AQUI ANMACIÓN DE DAÑO O LO QUE SEA
        _trap.destroy();
    }
    else if(_trap.key == "trap" && haveShield) 
    {
        _trap.destroy();
        haveShield = false;
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

    if((_obstacle.key == "slab" || _obstacle.key == "slab_end") && !havePower )
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
        for(let i = 0; i < bgGroup.children.length; i++)
        {            
            game.physics.arcade.enable(bgGroup.children[i]);
            bgGroup.children[i].body.velocity.y = OBSTACLE_SPEED; 
        }    
        for(let i = 0; i < shieldGroup.children.length; i++)
        {            
            game.physics.arcade.enable(shieldGroup.children[i]);
            shieldGroup.children[i].body.velocity.y = OBSTACLE_SPEED; 
        }    
    }
    if((_obstacle.key == "slab" || _obstacle.key == "slab_end") && havePower )
    {
       if(_obstacle.key = "slab") _obstacle.destroy();
       havePower = false;
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

function fixLetterToSlab()
{
    
    if(ava)
    {
        if(fbtn.isDown) 
        {
            game.add.tween(obstaclesGroup.children[indexWhereToFix]).to( { alpha: 0 }, 2000, Phaser.Easing.Linear.None, true, 0, 1000, true);

        }
        letter.x = Math.floor(obstaclesGroup.children[indexWhereToFix].x + obstaclesGroup.children[indexWhereToFix].width / 2);
        letter.y = Math.floor(obstaclesGroup.children[indexWhereToFix].y + obstaclesGroup.children[indexWhereToFix].height / 2);
    }
    else
    {
        letter.x = Math.floor(-20);
        letter.y = Math.floor(-20);
    }
    if(obstaclesGroup.children[indexWhereToFix].alpha < 0.5)
    {
        ava = false;
        obstaclesGroup.children[indexWhereToFix].destroy();
    }
}

function createVirus(x,y, isDancing)
{
    virus = game.add.sprite(x, y - 30,'virus');
    virus.isDancing = isDancing;    
    game.physics.arcade.enable(virus);
    virus.width = 40;
    virus.height = 30;
    virus.body.velocity.y = -OBSTACLE_SPEED;
    virus.body.velocity.x = 0;
    virusGroup.add(virus);
}

function createshield(x,y)
{
    pUp = game.add.sprite(x + 15,  y - 15,'shield');
    game.physics.arcade.enable(pUp);
    pUp.width = 60;
    pUp.height = 60;
    pUp.body.velocity.y = -OBSTACLE_SPEED;
    pUp.body.velocity.x = 0;
    shieldGroup.add(pUp);
}

function createPowerUp(x, y, level2)
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

function goToWelcome() 
{
    game.world.setBounds(0, 0, game.width, game.height);
    game.state.start('welcome');
}

function generateBg()
{

    for(let i = 0; i < 700; i++)
    {
        star = game.add.sprite(game.rnd.integerInRange(0, game.width),  game.rnd.integerInRange(0, game.height + 20000), 'star');
        game.physics.arcade.enable(star);
        star.width = 10;
        star.height = 10;
        star.body.velocity.y = -OBSTACLE_SPEED;
        bgGroup.add(star);
    }

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

    for(let i = 0; i < shieldGroup.children.length; i++)
    {
        game.physics.arcade.enable(shieldGroup.children[i]);
        shieldGroup.children[i].body.velocity.x =  - OBSTACLE_SPEEDX;
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
    
    for(let i = 0; i < shieldGroup.children.length; i++)
    {
        game.physics.arcade.enable(shieldGroup.children[i]);
        shieldGroup.children[i].body.velocity.x =  OBSTACLE_SPEEDX;
    }
    
}

function deleteStuff()
{

    for(let i = 0; i < obstaclesGroup.children.length; i++)
        if(obstaclesGroup.children[i].y < 0) obstaclesGroup.children[i].destroy();

    for(let i = 0; i < virusGroup.children.length; i++)
        if(virusGroup.children[i].y < 0) virusGroup.children[i].destroy();

    for(let i = 0; i < pUpsGroup.children.length; i++)
        if(pUpsGroup.children[i].y < 0) pUpsGroup.children[i].destroy();
     
    for(let i = 0; i < trapsGroup.children.length; i++)
        if(trapsGroup.children[i].y < 0) trapsGroup.children[i].destroy();

        
    for(let i = 0; i < bgGroup.children.length; i++)
        if(bgGroup.children[i].y < 0) bgGroup.children[i].destroy();

}

function levelGenerator(numSlabs ,traps, breakable, pups, shields )
{
    let gap;
    let trap;
    let pup;
    let virus,viruspos, virusDancing;

    if(currentLevel == 1) virusDancing = false;
    else virusDancing = true;

    let y = game.height / 2;

    for(let j  = 0 ; j < 20; j++ )
    {  
        viruspos = (game.rnd.integerInRange(-100, 800));
        virus = game.rnd.integerInRange(0, 1); 
        pup = game.rnd.integerInRange(0, 1);
        gap = game.rnd.integerInRange(1, numSlabs - 1);
        trap = game.rnd.integerInRange(1, numSlabs - 1);
        if(trap == gap) trap = 5;
        
        for(let x = -150, i = 0; i < numSlabs; i++, x = x + obstacle.width) 
        {
            if(virus == 1) createVirus (viruspos, y , virusDancing);
            if(i == trap)   createTrap(x,y);
            if(i != gap && i != trap)    createObstacle(x,y);
            if(pup == 1 && i == gap) createPowerUp(x,y);
            if(virus == 1) createVirus()  
        }
        y = y + 300
    }
 
}
