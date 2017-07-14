var gameX = 900;
var gameY = 900;
var canvas_x = window.innerWidth;
var canvas_y = window.innerHeight;
var scaleRatio = Math.min(canvas_x/gameX, canvas_y/gameY);

var desertBackground;

var game = new Phaser.Game(gameX*scaleRatio, gameY*scaleRatio, Phaser.CANVAS);

// Game Constants
var BOARD_HEIGHT = 7;
var BOARD_WIDTH  = 7;
var START_X = 3;
var START_Y = 3;
var MOVES = 2;
var SPAWN_CHANCE = 0.2; // Chance that a obstacle is spawned instead of a car

// Level
var LEVEL = 1;
var levelText;

// UI Constants
var TILE_SIZE = 100*scaleRatio;    
var MARGIN = 10*scaleRatio;


game.state.add('boot', bootState);
game.state.add('load', loadState);
game.state.add('main', mainState);
game.state.add('setup',setupState);

game.state.start('boot');