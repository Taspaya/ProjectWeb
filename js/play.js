
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
const NUM_SLABS = 15;

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


let currentLevel = 2;
let juega ;

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

let letterPressed;
let letterAssigned;

let obstaclesGroup;
let virusGroup;
let pUpsGroup;
let bgGroup;
let trapsDancingGroup;
let trapsGroup;


let randomLetterPos, randomLetter;


let slabWhereToFix;
var style;
let letter;

let havePower = false;


let gap;
let gaps = [-2 , 1 , 3 , 0 , 0 , 0 , 1 , 2 , 1, 0, 1, 2, 3, 1, 0, -1, 2, 2, 1, 0];

let totalPlataformas;
let plataformasFinal = 0;

let haveShield = false;

let pups = [false , false , true , false , true , false , false , false , true ];

let rightArrowPressed = false,
    leftArrowPressed = false,
    upArrowPressed = false,
    downArrowPressed = false;

let seconds, timeout, theChrono, lifes;
let continueGame = true;
let Currentlifes = 3;   
let counter = 0;



let music;
var soundPower= true;

let wol = 'win';


let playState = {
    create: createPlay,
    update: updatePlay
};

function createPlay()
{
    style = { font: "32px Arial", fill: "#ff0044", wordWrap: true, wordWrapWidth: 40, align: "center", backgroundColor: "#ffff00" };
    letter = game.add.text(-50, -50, 'L', style);

    game.stage.backgroundColor = 0x050035;

    leftBTN = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
    rightBTN = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);

    indexWhereToFix = 0;
    ava = false;
    qBool = false;
    game.input.enabled = true;
    havePower = false;
    totalPlataformas = 20;

    shieldGroup = game.add.group();
    bgGroup = game.add.group();
    trapsDancingGroup = game.add.group();
    obstaclesGroup = game.add.group();
    virusGroup = game.add.group();
    pUpsGroup = game.add.group();
    trapsGroup = game.add.group();

    shieldGroup.enableBody = true;
    bgGroup.enableBody = true;
    trapsDancingGroup.enableBody = true;
    obstaclesGroup.enableBody = true;
    trapsGroup.enableBody = true;
    virusGroup.enableBody = true;
    pUpsGroup.enableBody = true;

    juega = true;
    music = game.add.audio('music');
    music.loopFull();
    

    
    createKeyControls();
    createBall();
    createHUD();
    //createLevelOne();
   // generateBg();
    levelGenerator(NUM_SLABS); //numSlabs, gaps ,traps, breakable, pups, shields
}

function updatePlay()
{
    qbtn();
    collisions();
    powerup();
    manageGravity();
    worldMovement();
    makeItDance();
    fixLetterToSlab(); //<------------------------------------------------------------
    deleteStuff();
    updateNumberPlatform(); // <-------------------------------------------------------------
}

//#region Phisics
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

function collapseTrap(ball, _trap)
{

    if(_trap.key == "trap" && !haveShield)
    {
        updateHealthBar(obstaclesGroup.children[0].body.velocity.y);
        let damage = game.add.audio('damage');
        damage.play();
        _trap.destroy();
    }
    else if(_trap.key == "trap" && haveShield) 
    {
        _trap.destroy();
        haveShield = false;
    }
    totalPlataformas--;
    hudPlatforms.setText(totalPlataformas);

}

function collapseVirus(ball, _virus)
{

    if(_virus.key == "virus")
    {
        
        updateHealthBar(obstaclesGroup.children[0].body.velocity.y);
        let damage = game.add.audio('damage');
        damage.play();
        _virus.destroy();
        
    }
 
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
            obstaclesGroup.children[i].body.velocity.y = (THRESHOLD + THRESHOLD/2);
        }

        for(let i = 0; i < virusGroup.children.length; i++)
        {
            game.physics.arcade.enable(virusGroup.children[i]);
            virusGroup.children[i].body.velocity.y = (THRESHOLD + THRESHOLD/2);
        }

        for(let i = 0; i < pUpsGroup.children.length; i++)
        {
            game.physics.arcade.enable(pUpsGroup.children[i]);
            pUpsGroup.children[i].body.velocity.y = (THRESHOLD + THRESHOLD/2);
        }

        for(let i = 0; i < trapsGroup.children.length; i++)
        {
            game.physics.arcade.enable(trapsGroup.children[i]);
            trapsGroup.children[i].body.velocity.y = (THRESHOLD + THRESHOLD/2);
        }
    
        for(let i = 0; i < shieldGroup.children.length; i++)
        {
            game.physics.arcade.enable(shieldGroup.children[i]);
            shieldGroup.children[i].body.velocity.y = (THRESHOLD + THRESHOLD/2);
        }
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


function rebound(ball, _obstacle)
{ 
    if(_obstacle.key == 'finalPlatform' && currentLevel == 1) gotoLvl2();

    if((_obstacle.key == "slab" || _obstacle.key == "slab_end") && havePower )
    {
       if(_obstacle.key = "slab") _obstacle.destroy();
       havePower = false;
    }
    if(_obstacle.key == "slab" || _obstacle.key == "slab_end" ) //<--------------------------------
    {
        havePower = false;
        soundPower=true;
        if(_obstacle.body.velocity.y < THRESHOLD && _obstacle.key == "slab" ) {
            let breakObastacle = game.add.audio('break');
            breakObastacle.play();
            _obstacle.loadTexture('platform', true);
            _obstacle.animations.add('break', [0, 1, 2, 3, 4], 10, false);
            _obstacle.animations.play('break');
        }

        for(let i = 0; i < obstaclesGroup.children.length; i++)
        {
            game.physics.arcade.enable(obstaclesGroup.children[i]);
            obstaclesGroup.children[i].body.velocity.y = OBSTACLE_SPEED;       
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
}


function collisions()
{
    game.physics.arcade.overlap(obstaclesGroup,ball, rebound, null, this);
    game.physics.arcade.overlap(virusGroup, ball, collapseVirus, null, this);
    game.physics.arcade.overlap(pUpsGroup, ball, getPowerUp, null, this);
    game.physics.arcade.overlap(trapsGroup, ball, collapseTrap, null, this);
    game.physics.arcade.overlap(shieldGroup, ball, collapseShield, null, this);

}

//#endregion

//#region HUD

function createHUD() {
    hudGroup = game.add.group();
    hudGroup.create(5, 5, 'heart');
    hudGroup.create(50, 15, 'healthholder');
    healthBar = hudGroup.create(50,15,'healthbar');
    hudNamePlayer=game.add.text(5,45,nombreJugador,{fill: '#FFFFFF', fontSize: 20});
    hudPlatforms=game.add.text(345,760,totalPlataformas,{fill: '#FFFFFF', fontSize: 20});
    hudlevel=game.add.text(300,760, currentLevel,{fill: '#FFFFFF', fontSize: 20});
    hudGroup.create(320, 700, 'powerUp');
    hudGroup.add(hudNamePlayer);

    hudGroup.fixedToCamera = true;
    healthValue = max_vida;
}


function fixLetterToSlab(_letter)
{
    if(ava)
    {
        console.log(letterPressed + "   " + letter.text)
        if(letterPressed != undefined)
        if(letterPressed.toLowerCase() == letter.text) 
        {
            game.add.tween(slabWhereToFix).to( { alpha: 0 }, 2000, Phaser.Easing.Linear.None, true, 0, 1000, true);
            letterPressed = null;
        }
        letter.x = Math.floor(slabWhereToFix.x + slabWhereToFix.width / 2);
        letter.y = Math.floor(slabWhereToFix.y + slabWhereToFix.height / 2);
    }
    else
    {
        letter.x = Math.floor(-20);
        letter.y = Math.floor(-20);
    }
    if (currentLevel == 2){
        if(slabWhereToFix.alpha < 0.5)
        {
            ava = false;
            slabWhereToFix.destroy();
        }
    }
} 


function updateHealthBar(damage) {

    let maxLife = healthBar.scale.x;
    healthBar.scale.x -= -(0.0005 * damage); 
    if (healthBar.scale.x > maxLife) healthBar.scale.x = maxLife;
    if (healthBar.scale.x <= 0){
        healthBar.scale.x = 0;
        juega = false;
        ball.animations.stop(null, true);
        ball.animations.add('muerte', [0,1,2,3,4], 10, false);
        ball.loadTexture('playerDeath', true);
        ball.animations.play('muerte');

        let die = game.add.audio('death');
        die.play();
        game.time.events.add(500, startEndState, this);
        wol = 'loss';
    }

}


//#endregion

//#region CREATE

function createKeyControls()
{
    game.input.keyboard.onPressCallback = function(e) { letterPressed = e;   }

    rightBTN = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
    leftBTN = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
    qBTN = game.input.keyboard.addKey(Phaser.Keyboard.Q);
}

function createLevelOne()
{

    let distance = game.height;

    for(let i = 0; i < gaps.length ; i++)
    {
        createobstaclesGroup(distance, gaps[i], pups[i], 2, true);
        createVirus(0, distance - 80);

        distance = distance + 450;
    }    

    createobstaclesGroup(distance, 19, null, null, false);
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
        createTrap(i,game.height + distance);
        else if(j != gap )
        createObstacle(i, game.height + distance, breakable);
        else if (j == gap && powerup)
        createPowerUp(i,  game.height + distance);
    }
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

function createObtacleGroupWithLetter(distance, text)
{
    let rnd;
    rnd = game.rnd.integerInRange(1,NUM_SLABS-1);


    for(let x = -150, i = 0; i < NUM_SLABS + 1; i++, x = x + obstacle.width) 
    {
        createObstacle(x, distance, false);
        if(i == rnd)    slabWhereToFix = obstacle;
    }

    ava = true;
    
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

//#endregion


function resetAll(){
    for (let i=0; i < obstaclesGroup.children.length; i++) obstaclesGroup.children[i].destroy();
    for (let i=0; i < trapsGroup.children.length; i++) trapsGroup.children[i].destroy();
    for (let i=0; i < virusGroup.children.length; i++) virusGroup.children[i].destroy();
    for (let i=0; i < pUpsGroup.children.length; i++) pUpsGroup.children[i].destroy();
    totalPlataformas = 20;
    //healthBar.scale.x = maxLife;
    havePower = false;
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
             if(ball.body.y > virusGroup.children[i].body.y - 50 && ball.body.y < virusGroup.children[i].body.y + 50 ) virusDance(virusGroup.children[i].body);
    }
}

function powerup(){
    var icon = hudGroup.children[3];


    if (havePower){
        icon.visible = true;
        if(soundPower){
            let power = game.add.audio('power');
            power.play();
            soundPower=false;
        }
    }
    else icon.visible = false;
  
}

function startEndState(){
    game.state.start('end');
}

function worldMovement()
{
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
}

function qbtn()
{
    if(qBTN.isDown)
    {
        if(qBool) qBool = false;
        else qBool = true;
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

function levelGenerator(numSlabs )
{
    let gap;
    let trap;
    let pup;
    let virus,viruspos, virusDancing;
    let _shield;
    
    randomLetter =   String.fromCharCode(game.rnd.integerInRange(97,122));

    if(currentLevel == 1) virusDancing = false;
    else virusDancing = true;

    let y = game.height / 2;
    if(currentLevel == 2 ) randomLetterPos = 1;//game.rnd.integerInRange(1, 20 - 1);
    if(currentLevel == 2) _shield = game.rnd.integerInRange(1, numSlabs - 1);


    for(let j  = 0 ; j < 20; j++ )
    {
        viruspos = (game.rnd.integerInRange(-100, 800));
        virus = game.rnd.integerInRange(0, 1); 
        pup = game.rnd.integerInRange(0, 1);
        gap = game.rnd.integerInRange(1, numSlabs - 1);
        trap = game.rnd.integerInRange(1, numSlabs - 1);


        if(trap == gap && trap != 5) trap = 5;
        else if (trap == gap && trap != 4 )trap = 4;

        if(j != randomLetterPos)
        {
            for(let x = -150, i = 0; i < NUM_SLABS; i++, x = x + obstacle.width) 
            {
                if(virus == 1)
                {
                    createVirus (viruspos, y , virusDancing);
                    virus = 0;
                }
                if(i == trap)   createTrap(x,y);
                if(i != gap && i != trap)    createObstacle(x,y);
                if(pup == 1 && i == gap) 
                {
                    if(currentLevel == 1)createPowerUp(x,y);
                    else createshield(x,y);
                }
            }
        }
        else
        {
           createObtacleGroupWithLetter(y, randomLetter, 5*obstacle.width);
           letterAssigned = randomLetter; 
           letter.setText(randomLetter);   
           randomLetterPos = null;
        }
        y = y + 300
    }


    for(let x = -150, i = 0; i < numSlabs; i++, x = x + obstacle.width) 
    {
        createObstacle(x, y, false);
        obstacle.key = 'finalPlatform';
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


function gotoLvl2()
{

currentLevel = 2;
game.destroy();
startGame();
}

/*function goToWelcome() {
    game.world.setBounds(0, 0, game.width, game.height);
    game.state.start('welcome');
}*/

function updateNumberPlatform(){

    if (totalPlataformas > 0){
        if (trapsGroup.children[0].body.y < ball.body.y){
            totalPlataformas--;
            trapsGroup.children[0].destroy();
            hudPlatforms.setText(totalPlataformas);
        }
    }

    plataformasFinal = 20 - totalPlataformas;

    //console.log(trapsGroup.children[0].body.y);
    //console.log(ball.body.y);

}

