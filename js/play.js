
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

const OBSTACLE_SPEED = 2;
const OBSTACLE_SPEEDX = 15;
const OBSTACLE_COLOR = "#0360ff";
const OBSTACLE_WIDTH = 100;

//PHYSIX

const PROBABILITY_ACCELERATE = 0.7;
const GLOBAL_ACCELERATION = -0.1;
const THRESHOLD = -4;

// KEYCODES

const RIGHTARROW_KEYCODE = 39;
const LEFTARROW_KEYCODE = 37;
const UPARROW_KEYCODE = 38;
const DOWNARROW_KEYCODE = 40;

//#endregion

//#region GLOBALS

let global_speed = 2;
let obs;
let random;

let obstacle = new Image();
obstacle.src     = "assets/imgs/obstacle.png";

let gap;
let gaps = [2 , 1 , 3 , 0 , 0 , 0 , 1 ,2 , 1 ];

let navesita = new Image();
navesita.src     = "assets/imgs/nave.png";

let rightArrowPressed = false,
    leftArrowPressed = false,
    upArrowPressed = false,
    downArrowPressed = false;

let seconds, timeout, theChrono, lifes;
let continueGame = true;
let Currentlifes = 3;   

//#endregion

//window.onload = startGame;

//#region HANDLERS

function handlerOne(event)
{
    switch (event.keyCode) {
        case RIGHTARROW_KEYCODE:
            if (!rightArrowPressed) {
                rightArrowPressed = true;
                gameArea.obstacles.forEach(element => { element.setSpeedX(OBSTACLE_SPEEDX);});
            }
            break;
        case LEFTARROW_KEYCODE:
            if (!leftArrowPressed) {
                leftArrowPressed = true;
                gameArea.obstacles.forEach(element => { element.setSpeedX(-OBSTACLE_SPEEDX);});

            }
            break;
        case UPARROW_KEYCODE:
            if (!upArrowPressed) {
                upArrowPressed = true;
                theSquare.setSpeedY(-SQUARE_SPEED_Y);
            }
            break;
        case DOWNARROW_KEYCODE:
            if (!downArrowPressed) {
                downArrowPressed = true;
                theSquare.setSpeedY(SQUARE_SPEED_Y);
            }
            break;
        default:
            break;
    }
}

function handlerTwo(event) {
    
    switch (event.keyCode) {
        case RIGHTARROW_KEYCODE:
            rightArrowPressed = false;
            gameArea.obstacles.forEach(element => { element.setSpeedX(0);});
            break;
        case LEFTARROW_KEYCODE:
            leftArrowPressed = false;
            gameArea.obstacles.forEach(element => { element.setSpeedX(0);});
            break;
        case UPARROW_KEYCODE:
            upArrowPressed = false;
            theSquare.setSpeedY(0);
            break;
        case DOWNARROW_KEYCODE:
            downArrowPressed = false;
            theSquare.setSpeedY(0);
            break;
        default:
            break;
    }
}


//#endregion



function startGame() {

    gameArea.initialise();
    gameArea.setupLevel(0);
    gameArea.render();

    window.document.addEventListener("keydown", handlerOne);
    window.document.addEventListener("keyup", handlerTwo);

    seconds = 0;
    theChrono = document.getElementById("chrono");
    lifes = document.getElementById("lives");
    Currentlifes = 3;
}

function updateGame() {

    var velo = 5;
    let collision = false;

    global_accelerate();

    for (let i = 0; i < gameArea.obstacles.length; i++) 
    {
        if (theSquare.crashWith(gameArea.obstacles[i]))
        {
            collision = true;
            obs = i;
            break;
        }
    }

    if (collision)
    {
        if(gameArea.obstacles[obs].imagen != null)
        {

            rebound();
            if(gameArea.obstacles[obs].trap == true)
            punish();
        }
        else
        {
            endGame();
        }
    }
    else {

        gameArea.frameNumber += 1;
        for (let i = gameArea.obstacles.length - 1; i >= 0; i--) 
        {
            gameArea.obstacles[i].move();
            gameArea.obstacles[i].accelerate();
             if (gameArea.obstacles[i].y + OBSTACLE_WIDTH <= 0) 
             {
                 gameArea.removeObstacle(i);
            }
        }
        theSquare.setIntoArea(gameArea.canvas.width, gameArea.canvas.height);
        gameArea.clear();
        gameArea.render();
    }
}

function endGame() {
    continueGame = false;
    clearInterval(gameArea.interval);
    window.document.removeEventListener("keydown", handlerOne);
    window.document.removeEventListener("keyup", handlerTwo);
}

function rebound()
{

    global_speed = 2;

    for (let i = gameArea.obstacles.length - 1; i >= 0; i--) 
    {
        gameArea.obstacles[i].y = gameArea.obstacles[i].y + 1;
        gameArea.obstacles[i].speedY = 20;
    }
    if(global_speed < THRESHOLD)
    gameArea.removeObstacle(obs);


}

function punish(_i)
{
 

    Currentlifes =  Currentlifes - 1;
    lifes.innerHTML = Currentlifes;
}

function restartGame()
{
    for (let i = gameArea.obstacles.length - 1; i >= 0; i--)
    {
        gameArea.removeObstacle(i);
    }

    theSquare.y = 100;
    theSquare.x = gameArea.canvas.width / 2;
}






function global_accelerate()
{
    let chance = Math.random();
    if (chance < PROBABILITY_ACCELERATE) global_speed += GLOBAL_ACCELERATION;
}

class SquaredForm {

    constructor(x, y, width, height, color, speedY ,imagen = null, trap = false) 
    {

        this.x = x; 
        this.y = y;
        this.width = width; 
        this.height = height; 
        this.color = color;
        this.speedX = 0;
        this.speedY = speedY;
        this.imagen = imagen;
        this.trap = trap;
    }

    setSpeedX(speedX) {
        this.speedX = speedX;
    }
    setSpeedY(speedY) {
        this.speedY = speedY;
    }
    render(ctx) 
    {

    if(this.imagen == null)
    {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    else
    {
        ctx.drawImage (this.imagen, this.x,this.y, this.width, this.height);
    }
    }

    accelerate()
    {
        this.speedY = global_speed; 
    }
    move() {

        this.x += this.speedX;
        this.y += this.speedY;
    }

    setIntoArea(endX, endY) {
        this.x = Math.min(Math.max(0, this.x), (endX - this.width));
        this.y = Math.min(Math.max(0, this.y), (endY - this.height));
    }

    crashWith(obj) {
        // detect collision with the bounding box algorithm
        let myleft = this.x;
        let myright = this.x + this.width;
        let mytop = this.y;
        let mybottom = this.y + this.height;
        let otherleft = obj.x;
        let otherright = obj.x + obj.width;
        let othertop = obj.y;
        let otherbottom = obj.y + obj.height;
        let crash = true;
        if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) ||
            (myleft > otherright)) {
            crash = false;
        }
        return crash;
    }
}

class GameArea {
    constructor(canvas, hero, obstacles) {
        this.canvas = canvas;
        this.hero = hero;
        this.obstacles = obstacles;
        this.context = null;
        this.interval = null;
        this.frameNumber = undefined;
    }

    initialise() 
    {
        this.canvas.width = GAME_AREA_WIDTH;
        this.canvas.height = GAME_AREA_HEIGHT;
        this.context = this.canvas.getContext("2d");
        let theDiv = document.getElementById("platformGameStage");
        theDiv.appendChild(this.canvas);
        this.interval = setInterval(updateGame, 1000 / FPS);
        this.frameNumber = 0;
    }

    render() {
        for (const obstacle of this.obstacles) {
            obstacle.render(this.context);
        }
        this.hero.render(this.context);
    }
    clear() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    addObstacle(obstacle) {
        this.obstacles.push(obstacle);
    }

    removeObstacle(i) {
        this.obstacles.splice(i, 1);
    }

    setupLevel(o)
    {
        let index = 0;
        switch(o)
        {
            case 0:
            
            
            for(var j = 301; j <= 3200; j++)
            {

                if(j == 3200)
                {
                    for(var i = -4; i <= 7; i++) 
                    {
                        if(i != gaps[index])
                        {
                            var color = "#4cd3c2";
                            let form = new SquaredForm( (OBSTACLE_WIDTH * i), j, OBSTACLE_WIDTH , 25, color, global_speed);
                            gameArea.addObstacle(form);
                            form.setSpeedY(-OBSTACLE_SPEED)
                        }
                    }
                }
                else if(j % 300 == 0)
                {
                    console.log("STRUCTURE: " + index);
                    // THIS FOR GENERATES THE STRUCTURE
                    for(var i = -4; i <= 7; i++) 
                    {
                        if(i != gaps[index])
                        {
                            var color = "#4cd3c2";
                            let form = new SquaredForm( (OBSTACLE_WIDTH * i), j, OBSTACLE_WIDTH , 25, color, global_speed ,obstacle);
                            gameArea.addObstacle(form);
                            form.setSpeedY(-OBSTACLE_SPEED)
                        }
                    }
                    index++;
                }
            }
                break;
            default:
                break;
        }
    }
}


let theSquare = new SquaredForm(GAME_AREA_WIDTH / 2, 100 , SQUARE_SIZE, SQUARE_SIZE, "#FF00CC", 0 ,navesita);
let gameArea = new GameArea(document.createElement("canvas"), theSquare, []);
let levelsData = ['assets/levels/level01.json', 'assets/levels/level02.json'];

let playState = {
    preload: loadPlayAssets,
    create: gameArea.setupLevel(0),
    update: updateLevel
};


function loadPlayAssets() {
    loadSprites();
    loadImages();
    loadSounds();
    loadLevel(levelToPlay);
}

function loadSprites() {
    //game.load.spritesheet('collector', 'assets/imgs/dude.png', 32, 48);
    //game.load.spritesheet('enemy', 'assets/imgs/enemySprite.png', 55, 53, 15);
}

function loadImages() {
    //game.load.image('bgGame', 'assets/imgs/bgPlay.jpg');
    //game.load.image('exit', 'assets/imgs/exit.png');
    //game.load.image('ground', 'assets/imgs/platform.png');
    //game.load.image('star', 'assets/imgs/star.png');
    //game.load.image('aid', 'assets/imgs/firstaid.png');
    //game.load.image('healthHolder', 'assets/imgs/health_holder.png');
    //game.load.image('healthBar', 'assets/imgs/health_bar.png');
    //game.load.image('heart', 'assets/imgs/heart.png');
}

function loadSounds() {
    //game.load.audio('damaged', 'assets/snds/hurt1.wav');
    //game.load.audio('collectstar', 'assets/snds/cling.wav');
    //game.load.audio('getaid', 'assets/snds/wooo.wav');
    //game.load.audio('hitenemy', 'assets/snds/snare.wav');
    //game.load.audio('outoftime', 'assets/snds/klaxon4-dry.wav');
    //game.load.audio('levelpassed', 'assets/snds/success.wav');
}

function loadLevel(level) {
    //game.load.text('level', levelsData[level - 1], true);
}



function createSounds() {
    //soundDamaged = game.add.audio('damaged');
    //soundCollectStar = game.add.audio('collectstar');
    //soundGetAid = game.add.audio('getaid');
    //soundHitEnemy = game.add.audio('hitenemy');
    //soundOutOfTime = game.add.audio('outoftime');
    //soundLevelPassed = game.add.audio('levelpassed');
}

function createAids() {
    //firstAids = game.add.group();
    //firstAids.enableBody = true;
    //firstAids.createMultiple(MAX_AIDS, 'aid');
    //firstAids.forEach(setupItem, this);
}

function createStars() {
    // similar to the code above
}

function createPlatform(element) {
    // similar to the code of createGround
}

function setupAid(aid, floorY) {
    let item = firstAids.getFirstExists(false);
    if (item)
        item.reset(aid.x, floorY - AID_STAR_Y_OFFSET);
}

function setupStar(star, floorY) {
    let item = stars.getFirstExists(false);
    if (item) {
        item.reset(star.x, floorY - AID_STAR_Y_OFFSET);
        totalNumOfStars += 1;
    }
}

function createHUD() {
    //hudGroup = game.add.group();
    //hudGroup.create(5, 5, 'heart');
    //hudGroup.create(50, 5, 'healthHolder');
    //healthBar = hudGroup.create(50, 5, 'healthBar');
    //hudTime = game.add.text(295, 5, setRemainingTime(remainingTime), {
    //    font: 'bold 14pt Sniglet',
    //    fill: '#b60404'
    //});
    //hudGroup.add(hudTime);
    //hudGroup.fixedToCamera = true;
    //healthValue = MAX_HEALTH;
}

function updateLevel() {

}

function endGame() {
    clearLevel();
    goToWelcome();
}

function nextLevel() {
    clearLevel();
    levelToPlay += 1;
    if (levelToPlay > levelsData.length)
        goToWelcome();
    else {
        game.input.enabled = true;
        game.state.start('play');
    }
}

function goToWelcome() {
    game.world.setBounds(0, 0, game.width, game.height);
    game.state.start('welcome');
}