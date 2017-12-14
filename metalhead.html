<!doctype html>
<html>
<head>
 <meta charset="UTF-8">
 <title>Metalhead</title>
</head>
<body>
<h1>Metalhead</h1>
<p>Use w, a, d to move and enter to shoot.</p>
<canvas id='canvas' width='600' height='400'></canvas>
<script src='metalhead.js'></script>
<p align='left' onclick='editModeClicks++; toggleEditMode()'><input type='button' value='Edit'/></p>
<script language="JavaScript">
var can = document.getElementById('canvas');
var c = can.getContext('2d');

function mainLoop() {
  //var c = can.getContext('2d');
  updateGame();
  updateBackground();
  updateEnemies();
  updatePlayer();
  updatePlayerBullets();
  checkCollisions();

  drawBackground(c);
  drawEnemies(c);
  drawPlayer(c);
  drawPlayerBullets(c);
  drawOverlay(c);
}


// =========== player ============
function drawPlayer(c) {
  if(player.state == 'dead') return;
    
  if(player.state == 'hit') {
    c.fillStyle = 'white';
    c.fillRect(player.x, player.y, player.width, player.height);
    return;
  }

  c.fillStyle = 'brown';
  c.fillRect(player.x, player.y, player.width, player.height);
}

function drawPlayerBullets(c) {
  c.fillStyle = 'red';
  for(var i = 0; i < bullets.length; i++) {
    c.fillRect(bullets[i].x, bullets[i].y, bullets[i].width, bullets[i].height);
  }
}

// =========== background ============
function drawBackground(c) {
  c.fillStyle = background.color;
  c.fillRect(0, 0, can.width, can.height);
}

// =========== enemies ===============
function drawEnemies(c) {
  var enemy;
  for(var i in semitones) {
    enemy = semitones[i];
    if(enemy.state == 'alive') {
      c.fillStyle = enemy.color;
      c.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
    }
  }
}

// =========== overlay ===============
function drawOverlay(c) {

  // draw score
  c.fillStyle = 'white';
  c.font = '14pt Arial';
  c.fillText(player.counter, 10, 20);

  if(game.state == 'editing') {
    c.fillText(overlay.subtitle, 190, 250);
  }

  if(game.state == 'start') {
    c.fillText('press space to play', 190, 250);
    c.font = "Bold 40pt Arial";
    c.fillText('READY YOUR EARS', 30, 200);
  }

  if(game.state == 'over') {
    c.fillText(overlay.subtitle, 190, 250);
    c.font = "Bold 40pt Arial";
    c.fillText(overlay.title, 30, 200);
  }
  
  if(game.state == 'won') {
    c.fillText(overlay.subtitle, 190, 250);
    c.font = 'Bold 40pt Arial';
    c.fillText(overlay.title, 50, 200);
  }
}

checkEvents();
setInterval(mainLoop, 1000 / 30);
</script>
</body>
</html>

