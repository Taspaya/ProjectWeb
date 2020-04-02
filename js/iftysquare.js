const GAME_AREA_WIDTH = 800;
const GAME_AREA_HEIGHT = 500;
const SQUARE_SIZE = 40;
const SQUARE_COLOR = "#cc0000";
const SQUARE_SPEED_X = 0;
const SQUARE_SPEED_Y = 0;
const OBSTACLE_SPEED = 2;
const OBSTACLE_SPEEDX = 25;
const OBSTACLE_COLOR = "#0360ff";
const OBSTACLE_MIN_HEIGHT = 40;
const OBSTACLE_MAX_HEIGHT = GAME_AREA_HEIGHT - 100;
const OBSTACLE_WIDTH = 100;
const OBSTACLE_MIN_GAP = 55;
const OBSTACLE_MAX_GAP = GAME_AREA_HEIGHT - 100;
const PROBABILITY_OBSTACLE = 0.7;
const FRAME_OBSTACLE = 85;
const FPS = 30;
const CHRONO_MSG = "RANDOM: ";
const RIGHTARROW_KEYCODE = 39;
const LEFTARROW_KEYCODE = 37;
const UPARROW_KEYCODE = 38;
const DOWNARROW_KEYCODE = 40;
const GLOBAL_ACCELERATION = -0.05;

let global_speed = 2;
let obs;
let random;
let obstacle = new Image();
obstacle.src     = "imgs/obstacle.png";

let gap;

function global_accelerate()
{

    global_speed += GLOBAL_ACCELERATION;
}

class SquaredForm {

    constructor(x, y, width, height, color, speedY ,imagen = null) 
    {

        this.x = x; // 0 
        this.y = y; // screen height
        this.width = width; //screen width
        this.height = height; // 50
        this.color = color;
        this.speedX = 0;
        this.speedY = 0;
        this.imagen = imagen;
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

    initialise() {
        this.canvas.width = GAME_AREA_WIDTH;
        this.canvas.height = GAME_AREA_HEIGHT;
        this.context = this.canvas.getContext("2d");
        let theDiv = document.getElementById("gameplay");
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
}

let navesita = new Image();
navesita.src     = "imgs/nave.png";
let theSquare = new SquaredForm(GAME_AREA_WIDTH / 2, 100 , SQUARE_SIZE, SQUARE_SIZE, "#FF00CC", 0 ,navesita);


let rightArrowPressed = false,
    leftArrowPressed = false,
    upArrowPressed = false,
    downArrowPressed = false;

let seconds, timeout, theChrono, lifes;
let continueGame = true;
let Currentlifes = 3;
let gameArea = new GameArea(document.createElement("canvas"), theSquare, []);

window.onload = startGame;

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

function startGame() {
    gameArea.initialise();
    gameArea.render();

    window.document.addEventListener("keydown", handlerOne);
    window.document.addEventListener("keyup", handlerTwo);

    seconds = 0;
    timeout = window.setTimeout(updateChrono, 1000);
    theChrono = document.getElementById("chrono");
    lifes = document.getElementById("lives");
    Currentlifes = 3;
    lifes.innerHTML = Currentlifes;
    random = Math.random() * 10;
    random = Math.trunc(random) - 2;
    random = Math.abs(random);
}

function updateGame() {
    // Check collision for ending game

    var velo = 5;
    let collision = false;

    global_accelerate();
    for (let i = 0; i < gameArea.obstacles.length; i++) {
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
            punish();
        }
        else
        {
            endGame();
        }
    }
    else {

        random = Math.random() * 10;
        random = Math.trunc(random) - 2;
        random = Math.abs(random);
        // Increase count of frames
        gameArea.frameNumber += 1;
        // Let's see if new obstacles must be created
        if (gameArea.frameNumber >= FRAME_OBSTACLE)
            gameArea.frameNumber = 1;
        // First: check if the given number of frames has passed
        if (gameArea.frameNumber == 1) {
            
            let chance = Math.random();
            if (chance < PROBABILITY_OBSTACLE) {


            var _random = Math.random();
            if(_random > 0.75 )random = random+2;
            else if(_random > 0.5) random++;
            else if(_random >= 0.25) random--;
            else if(_random < 0.25 ) random = random - 2;
            
            if(random < 0) random = 0;
            if(random > 7) random = 7;
            
            for(var i = -10; i <= 17; i++)
            {
                var color = "#ffaaa5";
                //INSTANTIATE THE OBSTACLES THAT ARENT THE RANDOM ONE
                if(random != i) 
                {
                    let form = new SquaredForm( (OBSTACLE_WIDTH * i), gameArea.canvas.height, OBSTACLE_WIDTH , 25, color, global_speed ,obstacle);
                    gameArea.addObstacle(form);
                    form.setSpeedY(-OBSTACLE_SPEED)
                }
            }
            }
        }

        // delete the ones that goes outside the canvas
        for (let i = gameArea.obstacles.length - 1; i >= 0; i--) 
        {
            gameArea.obstacles[i].move();
            gameArea.obstacles[i].accelerate();
             if (gameArea.obstacles[i].y + OBSTACLE_WIDTH <= 0) {
                 gameArea.removeObstacle(i);
            }
        }


        // Move our hero
        // theSquare.move();
        // Our hero can't go outside the canvas
        theSquare.setIntoArea(gameArea.canvas.width, gameArea.canvas.height);
        gameArea.clear();
        gameArea.render();
    }
}

function updateChrono() {
    if (continueGame) {
        seconds++;
        let minutes = Math.floor(seconds / 60);
        let secondsToShow = seconds % 60;
        theChrono.innerHTML = CHRONO_MSG + " " + random;
        timeout = window.setTimeout(updateChrono, 1000);
    }
}

function endGame() {
    continueGame = false;
    clearInterval(gameArea.interval);
    window.document.removeEventListener("keydown", handlerOne);
    window.document.removeEventListener("keyup", handlerTwo);
}

function punish()
{
    global_speed = 2;
    seconds = seconds - 15;
    gameArea.removeObstacle(obs);
    Currentlifes =  Currentlifes - 1;
    lifes.innerHTML = Currentlifes;

    setTimeout(restartGame(), 1000);

    if(seconds < 0) seconds = 0;
    if(Currentlifes < 0) endGame();
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