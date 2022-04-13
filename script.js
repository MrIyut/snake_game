var canvas, context, game_loop, joc_activ;
var fps = 8;
var poate_da_restart = false;

var highscore = 0;

var marimea_grilei = (marimea_celulei = 20); // 20 x 20 = 400
var nextX = (nextY = 0);

// sarpele default
var defaultmarime = 1;
var marime = defaultmarime;
var coada = [];
var sarpeX = (sarpeY = 10);
var directie = "";

// pozitia initiala a marului
var marX = (marY = 15);

const CULOARE_CANVAS_BORDER = "white";
const CULOARE_CANVAS_BKG = "black";
const CULOARE_SARPE = "lightgreen";
const CULOARE_SARPE_BORDER = "darkgreen";
const CULOARE_TEXT = "white";
const CULOARE_CAP = "#20661f";

window.onload = function () {
  canvas = document.getElementById("canvas");
  context = canvas.getContext("2d");
  context.font = "15px sans-serif";

  document.addEventListener("keydown", keyDownEvent);

  game_loop = porneste(fps);
};

function porneste(fps) {
  joc_activ = true;
  poate_da_restart = false;
  document.getElementById("status").innerHTML = "<small>Game Started</small>";
  document.getElementById("score").innerHTML = "";
  document.getElementById("restart").innerHTML = "";
  return setInterval(render, 1000 / fps);
}

function restart(fps) {
  poate_da_restart = false;
  nextX = 0;
  nextY = 0;

  // reseteaza sarpele
  defaultmarime = 1;
  marime = defaultmarime;
  coada = [];
  sarpeX = 10;
  sarpeY = 10;
  directie = "";
  // reseteaza marul
  marX = 15;
  marY = 15;
  joc_activ = true;
  document.getElementById("status").innerHTML = "<small>Game Started</small>";
  document.getElementById("score").innerHTML = "";
  document.getElementById("restart").innerHTML = "";
  return setInterval(render, 1000 / fps);
}

function piua() {
  clearInterval(game_loop);
  joc_activ = false;
  document.getElementById("status").innerHTML = "<small>Game Paused</small>";
}

function endGame(score) {
  clearInterval(game_loop);
  joc_activ = false;
  poate_da_restart = true;
  if (highscore < score) {
    highscore = score;
    context.fillStyle = CULOARE_TEXT;
    context.fillText("Highscore: " + highscore, 300, 395);
  }
  document.getElementById("status").innerHTML = "<small>Game Over</small>";
  document.getElementById("score").innerHTML = "<h2>Score: " + score + "</h2>";
  document.getElementById("restart").innerHTML = "<h4>space pentru restart.</h4>";
}

//game_loop
function render() {
  // mutam sarpele in pozitia urmatoare
  sarpeX += nextX;
  sarpeY += nextY;

  // repozitionam capul sarpelui daca iese din grila
  if (sarpeX < 0) {
    sarpeX = marimea_grilei - 1;
  }
  if (sarpeX > marimea_grilei - 1) {
    sarpeX = 0;
  }

  if (sarpeY < 0) {
    sarpeY = marimea_grilei - 1;
  }
  if (sarpeY > marimea_grilei - 1) {
    sarpeY = 0;
  }

  // e capul sarpelui in acelasi loc cu marul?
  if (sarpeX == marX && sarpeY == marY) {
    marime++;
    marX = Math.floor(Math.random() * marimea_grilei);
    marY = Math.floor(Math.random() * marimea_grilei);
  }

  // desenam fundalul
  context.fillStyle = CULOARE_CANVAS_BKG;
  context.strokestyle = CULOARE_CANVAS_BORDER;
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.strokeRect(0, 0, canvas.width, canvas.height);

  // desenam sarpele
  context.fillStyle = CULOARE_SARPE;
  context.strokestyle = CULOARE_SARPE_BORDER;
  for (var i = 0; i < coada.length; i++) {
    if (i == coada.length - 1) {
      context.fillStyle = CULOARE_CAP;
    }

    context.fillRect(
      coada[i].x * marimea_celulei,
      coada[i].y * marimea_celulei,
      marimea_celulei,
      marimea_celulei
    );

    context.strokeRect(coada[i].x * marimea_celulei, coada[i].y * marimea_celulei, marimea_celulei, marimea_celulei);

    // a intrat cu capul in propria coada?
    if (coada[i].x == sarpeX && coada[i].y == sarpeY) {
      if (marime > defaultmarime) {
        endGame(marime);
      }
      marime = defaultmarime;
    }
  }

  // desenam marul
  context.fillStyle = "red";
  context.fillRect(marX * marimea_celulei, marY * marimea_celulei, marimea_celulei, marimea_celulei);

  context.fillStyle = CULOARE_TEXT;
  context.fillText("Score: " + marime, 10, 395);

  if (highscore > 0) {
    context.fillStyle = CULOARE_TEXT;
    context.fillText("Highscore: " + highscore, 300, 395);
  }


  // stergem ultimul element al cozii si introducem noua pozitie a capului
  coada.push({ x: sarpeX, y: sarpeY });
  while (coada.length > marime) {
    coada.shift();
  }
}

function stanga() {
  if (directie == "dreapta")
    return;
  directie = "stanga";
  nextX = -1;
  nextY = 0;
}
function dreapta() {
  if (directie == "stanga")
    return;
  directie = "dreapta";
  nextX = 1;
  nextY = 0;
}
function sus() {
  if (directie == "jos")
    return;
  directie = "sus";
  nextX = 0;
  nextY = -1;
}
function jos() {
  if (directie == "sus")
    return;
  directie = "jos";
  nextX = 0;
  nextY = 1;
}

// input
function keyDownEvent(key) {
  switch (key.keyCode) {
    case 37: //sagetutza stanga
      stanga();
      break;
    case 38: //sagetutza sus
      sus();
      break;
    case 39: //sagetutza dreapta
      dreapta();
      break;
    case 40: //sagetutza jos
      jos();
      break;
    case 87: //W
      sus();
      break;
    case 83: //S
      jos();
      break;
    case 68: //D
      dreapta();
      break;
    case 65: //A
      stanga();
      break;
    case 32: // space
      if (joc_activ == true) {
        piua();
      }
      else {
        if (poate_da_restart == false)
          game_loop = porneste(fps);
        else
          game_loop = restart(fps);
      }
      break;
  }
}
