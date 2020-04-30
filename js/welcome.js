const DEFAULT_DAMAGE = 10;
const DEFAULT_HEALTH = 10; 
const DEFAULT_TIME = 480;
const DEFAULT_JUMPS_TO_KILL = 2;
const DEFAULT_PLAYER_DEATH_TIME_PENALTY = 15;

let damage = DEFAULT_DAMAGE;
let healthAid = DEFAULT_HEALTH;
let secondsToGo = DEFAULT_TIME;
let jumpsToKill = DEFAULT_JUMPS_TO_KILL;
let playerDeathTimePenalty = DEFAULT_PLAYER_DEATH_TIME_PENALTY;

let aboutScreen = document.getElementById("aboutScreen");
aboutScreen.style.display = "none";


let instructionScreen = document.getElementById("instructionsScreen");
instructionScreen.style.display = "none";

let playerScreen = document.getElementById("playerScreen");
playerScreen.style.display = "none";

let button2 = document.getElementById("button2");

let albondiga = document.getElementById("albondiga");


button.disabled = true;
//button2.disabled = true;

let nombreJugador = null;

let initialState = 
{
  
};


let mainTween, downTween1, downTween2;
let btnAbout, btnConfig, btnPlay;
let levelToPlay;


function moveToAboutScreen()
{
    let initialScreen = document.getElementById("initialScreen");
    initialScreen.style.display = "none";

    let aboutScreen = document.getElementById("aboutScreen");
    aboutScreen.style.display = "inline-block";
}


function moveToInstructionsScreen()
{
    let initialScreen = document.getElementById("initialScreen");
    initialScreen.style.display = "none";

    let instructionsScreen = document.getElementById("instructionsScreen");
    instructionsScreen.style.display = "inline-block";
}

function moveToPlayerScreen()
{
    let initialScreen = document.getElementById("initialScreen");
    initialScreen.style.display = "none";

    let playerScreen = document.getElementById("playerScreen");
    playerScreen.style.display = "inline-block";

}

function onDownTweenCompleted(object, tween) 
{
    if (tween === downTween1)
        downTween2.start();
    else
        downTween1.start();
}

function elegirNombre(numero, nombreElegido){


    if (numero != 0){
        nombreJugador = nombreElegido;
        window.alert(nombreJugador);
    }
    else{
        nombreJugador=prompt('Ingrese su nombre:','');
        window.alert(nombreJugador);
    }


    if (nombreJugador != null) { 
        button.disabled = false;
        var botonDesactivado = document.getElementById("button");
        botonDesactivado.style.opacity = 1;
        botonDesactivado.style.cursor = "pointer";
        button2.disabled = false;
        button2.style.opacity = 1;
        button2.style.cursor = "pointer";
    }

}

function avisame(){window.alert("ñaaaaaa");}

function onPlayButtonPressed() {
    // Add the instruction required to start the 'play' state

    //game.state.add('about', initState);
    game.state.add('config', playState);
    game.state.add('play', hofState);
}

function awake()
{
    let initialScreen = document.getElementById("initialScreen");
    let endScreen = document.getElementById("endScreen");
    let aboutScreen = document.getElementById("aboutScreen");
    let instructionScreen = document.getElementById("instructionsScreen");
    let playerScreen = document.getElementById("playerScreen");


    initialScreen.style.display = "block";
    

    let theAbout = document.getElementById("aboutScreen");
    theAbout.style.display = "none";

    let theInstruction = document.getElementById("instructionsScreen");
    theInstruction.style.display = "none"
    
    let thePlayer = document.getElementById("playerScreen");
    thePlayer.style.display = "none"


}
