
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
const GLOBAL_ACCELERATION = -0.1;
const THRESHOLD = -4;

// KEYCODES

const RIGHTARROW_KEYCODE = 39;
const LEFTARROW_KEYCODE = 37;
const UPARROW_KEYCODE = 38;
const DOWNARROW_KEYCODE = 40;

//#endregion

//#region GLOBALS

let ball;
let rightBTN;
let leftBTN;

let global_speed = 2;
let obs;
let random;

let obstaclesGroup;

//let obstacles;

//let obstacle = new Image();
//obstacle.src     = "assets/imgs/obstacle.png";

let gap;
let gaps = [2 , 1 , 3 , 0 , 0 , 0 , 1 , 2 , 1 ];


let navesita = new Image();
navesita.src     = "assets/imgs/nave.png";

let rightArrowPressed = false,
    leftArrowPressed = false,
    upArrowPressed = false,
    downArrowPressed = false;

let seconds, timeout, theChrono, lifes;
let continueGame = true;
let Currentlifes = 3;   
let counter = 0;


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


//#region old version
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
//#endregion

let playState = {
    create: createPlay,
    update: updatePlay
};

function createPlay()
{
    obstaclesGroup = game.add.group();
    obstaclesGroup.enableBody = true;
    createKeyControls();
    createBall();
    manageGravity();
    game.time.events.loop(Phaser.Timer.SECOND, updateCounter, this);
}

function updatePlay()
{
    game.physics.arcade.overlap(obstaclesGroup,ball, rebound, null, this);
    manageGravity();

}

function manageGravity()
{

    for(let i = 0; i < obstaclesGroup.children.length; i++)
    {
        game.physics.arcade.enable(obstaclesGroup.children[i]);
        obstaclesGroup.children[i].body.velocity.y = obstaclesGroup.children[i].body.velocity.y -
        1;
    }
}

function updateCounter() {

    counter++;
    if (counter > 1) {
        counter = 0;
        createobstaclesGroup(2)
    }

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
    ball.width =40;
    ball.height = 40;
    //ball.anchor.setTo(0.05, 0.05);
    game.physics.arcade.enable(ball); 

    //ball.body.collideWorldBounds = true;
    //createobstaclesGroup(4);

}


function createobstaclesGroup(gap)
{
    for(let i = 0,  j = 0; j < 8; i = i + 50, j++)
    {
        if(j != gap)
        createObstacle(i, game.height);
    }

}
function rebound(ball, _obstacle)
{
    if(_obstacle.key = "slab")
    {
        for(let i = 0; i < obstaclesGroup.children.length; i++)
        {
            game.physics.arcade.enable(obstaclesGroup.children[i]);
            obstaclesGroup.children[i].body.velocity.y = OBSTACLE_SPEED;
        }
    }
}

function createObstacle(x,y)
{
    obstacle = game.add.sprite(x,y, 'slab');
    game.physics.arcade.enable(obstacle);
    obstacle.width = 50;
    obstacle.body.velocity.y = -OBSTACLE_SPEED;
    obstaclesGroup.add(obstacle);

}


function createLevel()
{
   
}


function goToWelcome() {
    game.world.setBounds(0, 0, game.width, game.height);
    game.state.start('welcome');
}