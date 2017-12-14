// not implemented as of ff 42.0 import "../tones/tones.js";

// flow:
// - goals - hit the right notes, let the player design a level
// - feedback - =- points etc.
// - no distraction - use headphones
// - just right - balance

// simplicity:
// - core - less is more
// - limited choices - 
// - intuitive - guide the player a little bit
// - player's perspective - step by step
var r = 0, g = 0, b = 0;
var background = {
  color: 'black'
};

var game = {
  state: 'start',
  editMode: false,
};

var overlay = {
  counter: -1,
  title: 'Metalhead',
  subtitle: 'bar'
};

var player = {
  x: 60,
  y: 390,
  width: 10,
  height: 10,
  counter: 3,
};

var bullets = [];
var keyboard = {};
var mouse = [];
var mWheel = [];
var semitones = [];

var levelLength = 0;
function initLevel(level) {
  levelLength = level.length;
  for(var i = 0; i < level.length; i++) {
    semitones.push({
      x: level[i].x,
      y: level[i].y,
      width: level[i].width,
      height: level[i].height,
      state: level[i].state,
      color: level[i].color
    });
  }
}

var testlevel = [
  {x: 150, y: 375,
    width: 320, height: 25,
    speed: 1, state: 'alive', 
    color: 'grey'},
  {x: 300, y: 365,
    width: 10, height: 10,
    speed: 2, state: 'alive', 
    color: 'white'},
];

var levels = [testlevel];//[level00, level01];//, level02, level03, level04];
var levelIterator = 0;

// =========== Game ============
function updateGame() {
  if(game.state == 'playing' && semitones.length == 0) {
    game.state = 'won';
    if(player.counter >= levelLength / 1.33) {
      overlay.title = 'WELL PLAYED!';
    } else if(player.counter < levelLength / 1.33 && player.counter >= levelLength / 2) {
      overlay.title = 'HEY, TONES :P';
    } else if(player.counter < levelLength / 2 && player.counter >= levelLength / 4) {
      overlay.title = 'YOU DEAF???';
    } else {
      overlay.title = 'YOU RUINED IT.';
      levelIterator -= 1;
    }

    overlay.subtitle = 'press space to play next level';
    overlay.counter = 0;
    //player.counter = 0;
  }

  if(game.state == 'editing') {
    overlay.title = '';
    overlay.subtitle = 'play your new level notes';
  }

  if(game.state == 'over' && keyboard[32]) {
    game.state = 'start';
    background.color = 'black';
    player.y = 400;
    player.state = 'alive';
    player.counter = 100;
    overlay.counter = -1;
    //overlay.title = 'READY YOUR SPEAKERS';
  }

  if(game.state == 'won' && keyboard[32]) {
    game.state = 'start';

    if(levelIterator >= levels.length) 
      levelIterator = 0;

    initLevel(levels[levelIterator++]);
    player.y = 400;
    player.state = 'alive';
    overlay.counter = -1;
  }
    
  if(overlay.counter >= 0) {
    overlay.counter++;
  }  
}

//var language = (navigator.language || navigator.browserLanguage).split('-')[0];
function updatePlayer() {
  if(player.state == 'dead' || player.counter < 0) return;//<= 0) return;

  // jumo with w
  if(keyboard[87]) {
    player.y -= 10;
  }
  
  if(player.y >= 390) {
    player.y = 390;
  }

  // move left with a
  if(keyboard[65]) {
    player.x -= 5;
  }

  // move right with d
  if(keyboard[68]) {
    player.x += 5;
  }
  
  // shoot with enter
  if(keyboard[13]) {
    bullets.push({
      x: player.x,
      y: player.y,
      width: 3,
      height: 2,
      state: 'alive',
    });
    tones.play('c', 6);
  }
  
  player.y++;
}

function updatePlayerBullets() {
  for(var i = 0; i < bullets.length; i++) {
    if(bullets[i].state == 'alive') {
      bullets[i].x += 5;
    }
  }
}

function updateBackground() {
  //console.log('background.color: '+ background.color);
  background.color = "rgb("+ r-- +", "+ g-- +", "+ b-- +")";
}

// ============== Enemy =============
function updateEnemies() {
  //create new enemies the first time through
  if(game.state == 'start' && keyboard[32]) {
    enemyBullets = [];
    game.state = 'playing';
  }
    
  //for each enemy
  var enemy;
  for(var i = 0; i < semitones.length; i++) {
    enemy = semitones[i];
    if(!enemy) continue;
    if(enemy && enemy.state == 'alive') {
      //enemy.counter++;
      //enemy.y++;
      enemy.x --;
    }
  }

  //remove the ones that are off the screen
  semitones = semitones.filter(function(enemy) {
    //return enemy.x + enemy.width > 0;
    return enemy.y < 600;//enemy.y < 400 ; //+ enemy.height > 0;
  });
}

// =========== check for collisions ===
function checkCollisions() {
  if(player.state == 'dead') return;

// counter = -1; harmful, white
// counter = 0; harmless, grey
// counter = 1; collectable, green
  var enemy;
  for(var i = 0; i < semitones.length; i++) {
    enemy = semitones[i];
    if(collided(enemy, player)) {
      if(enemy.color == 'white') {
        player.state = 'hit';
        player.counter -= 1;
      } else if(enemy.color == 'grey') {
        player.y = enemy.y - player.height;
      } else if(enemy.color == 'green') {
        player.counter += 1;
        enemy.x = -enemy.width;
      }

      if(player.counter <= 0) {
        player.state = 'dead';
        levelIterator = 0;
        game.state = 'over';
        overlay.title = 'DROPPED THE BEAT';
        overlay.subtitle = 'press space to play again';
      }
    }
  }
  for(var j = 0; j < bullets.length; j++) {
    if(collided(enemy, bullets[j])) {
      enemy.state = 'dead';
      bullets[j].state = 'dead';
    }
  }
}

function collided(a, b) {    
  // check for horizontal collision
  if(b.x + b.width >= a.x && b.x < a.x + a.width) {
    // check for vertical collision
    if(b.y + b.height >= a.y && b.y < a.y + a.height) {
      return true;
    }
  }
    
  // check a inside b
  if(b.x <= a.x && b.x + b.width >= a.x+a.width) {
    if(b.y <= a.y && b.y + b.height >= a.y + a.height) {
      return true;
    }
  }
    
  // check b inside a
  if(a.x <= b.x && a.x + a.width >= b.x+b.width) {
    if(a.y <= b.y && a.y + a.height >= b.y+b.height) {
      return true;
    }
  }
    
  return false;
}

// ========= Edit mode =======================
var editModeClicks = 1;
function toggleEditMode() {
  if(editModeClicks % 2 == 0) {
    game.state = 'editing';
    game.editMode = true;
  } else {
    game.state = 'start'
    game.editMode = false;
  }
}
 
// ============ Events ========================
var timestamp = Date.now();
var deltaTimestamp = 0;
function checkEvents() {
  attachEvent(document, 'keydown', function(e) {
    //if(game.editMode == true) {
      //deltaTimestamp = Date.now() - timestamp;
      console.log('keycode: '+ e.keyCode +', character: '+ e.key); //String.fromCharCode(e.keyCode));
      //console.log('tone.x: '+ Math.floor(deltaTimestamp / (1000 / 30)));
      //console.log('tone.y: '+ player.y);
      //console.log('timestamp: '+ timestamp +', delta: '+ deltaTimestamp);
    //}

    keyboard[e.keyCode] = true;
  });
  attachEvent(document, 'keyup', function(e) {
    keyboard[e.keyCode] = false;
  });

  attachEvent(document, 'mousedown', function(e) {
    console.log('mouse down event');
  });

  attachEvent(document, 'mousemove', function(e) {
    mouse.push(e.clientX);
    //console.log('mouse move event');
    //console.log('mouse movementx: '+ e.movementX);
  });

  attachEvent(document, 'wheel', function(e) {
    console.log('mouse wheel event');
    console.log('mouse wheel deltaY: '+ e.deltaY);
    mWheel.push(e.deltaY);
  });
}

function attachEvent(node, name, func) {
  if(node.addEventListener) {
    node.addEventListener(name, func, false);
  } else if(node.attachEvent) {
    node.attachEvent(name, func);
  }
}

// ============ Tones ============
(function(window) {
    var tones = {
        context: new (window.AudioContext || window.webkitAudioContext)(),
        attack: 1,
        release: 100,
        volume: 1,
        type: "saw",


        playFrequency: function(freq) {
            this.attack = this.attack || 1;
            this.release = this.release || 1;
            var envelope = this.context.createGain();
            envelope.gain.setValueAtTime(this.volume, this.context.currentTime);
            envelope.connect(this.context.destination);

            envelope.gain.setValueAtTime(0, this.context.currentTime);
            envelope.gain.setTargetAtTime(this.volume, this.context.currentTime, this.attack / 1000);
            if(this.release) {
                envelope.gain.setTargetAtTime(0, this.context.currentTime + this.attack / 1000, this.release / 1000);
                setTimeout(function() {
                    osc.stop();
                    osc.disconnect(envelope);
                    envelope.gain.cancelScheduledValues(tones.context.currentTime);
                    envelope.disconnect(tones.context.destination);

                }, this.attack * 10 + this.release * 10);
            }

            var osc = this.context.createOscillator();
            osc.frequency.setValueAtTime(freq, this.context.currentTime);
            osc.type = this.type;
            osc.connect(envelope);
            osc.start();
        },

        /** 
         * Usage: 
         * notes.play(440);     // plays 440 hz tone
         * notes.play("c");     // plays note c in default 4th octave
         * notes.play("c#");    // plays note c sharp in default 4th octave
         * notes.play("eb");    // plays note e flat in default 4th octave
         * notes.play("c", 2);  // plays note c in 2nd octave
         */
        play: function(freqOrNote, octave) {
            if(typeof freqOrNote === "number") {
                this.playFrequency(freqOrNote);
            }
            else if(typeof freqOrNote === "string") {
                if(octave == null) {
                    octave = 4;
                }
                this.playFrequency(this.map[octave][freqOrNote.toLowerCase()]);
            }
        },

        getTimeMS: function() {
            return this.context.currentTime * 1000;
        },

        map: [{
            // octave 0
            "c": 16.351,
            "c#": 17.324,
            "db": 17.324,
            "d": 18.354,
            "d#": 19.445,
            "eb": 19.445,
            "e": 20.601,
            "f": 21.827,
            "f#": 23.124,
            "gb": 23.124,
            "g": 24.499,
            "g#": 25.956,
            "ab": 25.956,
            "a": 27.5,
            "a#": 29.135,
            "bb": 29.135,
            "b": 30.868
        },
        {
            // octave 1
            "c": 32.703,
            "c#": 34.648,
            "db": 34.648,
            "d": 36.708,
            "d#": 38.891,
            "eb": 38.891,
            "e": 41.203,
            "f": 43.654,
            "f#": 46.249,
            "gb": 46.249,
            "g": 48.999,
            "g#": 51.913,
            "ab": 51.913,
            "a": 55,
            "a#": 58.27,
            "bb": 58.27,
            "b": 61.735
        },
        {                    
            // octave 2
            "c": 65.406,
            "c#": 69.296,
            "db": 69.296,
            "d": 73.416,
            "d#": 77.782,
            "eb": 77.782,
            "e": 82.407,
            "f": 87.307,
            "f#": 92.499,
            "gb": 92.499,
            "g": 97.999,
            "g#": 103.826,
            "ab": 103.826,
            "a": 110,
            "a#": 116.541,
            "bb": 116.541,
            "b": 123.471
        },
        {                    
            // octave 3
            "c": 130.813,
            "c#": 138.591,
            "db": 138.591,
            "d": 146.832,
            "d#": 155.563,
            "eb": 155.563,
            "e": 164.814,
            "f": 174.614,
            "f#": 184.997,
            "gb": 184.997,
            "g": 195.998,
            "g#": 207.652,
            "ab": 207.652,
            "a": 220,
            "a#": 233.082,
            "bb": 233.082,
            "b": 246.942
        },
        {                    
            // octave 4
            "c": 261.626,
            "c#": 277.183,
            "db": 277.183,
            "d": 293.665,
            "d#": 311.127,
            "eb": 311.127,
            "e": 329.628,
            "f": 349.228,
            "f#": 369.994,
            "gb": 369.994,
            "g": 391.995,
            "g#": 415.305,
            "ab": 415.305,
            "a": 440,
            "a#": 466.164,
            "bb": 466.164,
            "b": 493.883
        },
        {                    
            // octave 5
            "c": 523.251,
            "c#": 554.365,
            "db": 554.365,
            "d": 587.33,
            "d#": 622.254,
            "eb": 622.254,
            "e": 659.255,
            "f": 698.456,
            "f#": 739.989,
            "gb": 739.989,
            "g": 783.991,
            "g#": 830.609,
            "ab": 830.609,
            "a": 880,
            "a#": 932.328,
            "bb": 932.328,
            "b": 987.767
        },
        {                    
            // octave 6
            "c": 1046.502,
            "c#": 1108.731,
            "db": 1108.731,
            "d": 1174.659,
            "d#": 1244.508,
            "eb": 1244.508,
            "e": 1318.51,
            "f": 1396.913,
            "f#": 1479.978,
            "gb": 1479.978,
            "g": 1567.982,
            "g#": 1661.219,
            "ab": 1661.219,
            "a": 1760,
            "a#": 1864.655,
            "bb": 1864.655,
            "b": 1975.533
        },
        {                    
            // octave 7
            "c": 2093.005,
            "c#": 2217.461,
            "db": 2217.461,
            "d": 2349.318,
            "d#": 2489.016,
            "eb": 2489.016,
            "e": 2637.021,
            "f": 2793.826,
            "f#": 2959.955,
            "gb": 2959.955,
            "g": 3135.964,
            "g#": 3322.438,
            "ab": 3322.438,
            "a": 3520,
            "a#": 3729.31,
            "bb": 3729.31,
            "b": 3951.066
        },
        {                    
            // octave 8
            "c": 4186.009,
            "c#": 4434.922,
            "db": 4434.922,
            "d": 4698.636,
            "d#": 4978.032,
            "eb": 4978.032,
            "e": 5274.042,
            "f": 5587.652,
            "f#": 5919.91,
            "gb": 5919.91,
            "g": 6271.928,
            "g#": 6644.876,
            "ab": 6644.876,
            "a": 7040,
            "a#": 7458.62,
            "bb": 7458.62,
            "b": 7902.132
        },
        {                    
            // octave 9
            "c": 8372.018,
            "c#": 8869.844,
            "db": 8869.844,
            "d": 9397.272,
            "d#": 9956.064,
            "eb": 9956.064,
            "e": 10548.084,
            "f": 11175.304,
            "f#": 11839.82,
            "gb": 11839.82,
            "g": 12543.856,
            "g#": 13289.752,
            "ab": 13289.752,
            "a": 14080,
            "a#": 14917.24,
            "bb": 14917.24,
            "b": 15804.264
        }]
    };

    // need to create a node in order to kick off the timer in Chrome.
    tones.context.createGain();

    if (typeof define === "function" && define.amd) {
        define(tones);
    } else {
       window.tones = tones;
    }

}(window));

