var gameX = 800;
var gameY = 800;
var canvas_x = window.innerWidth;
var canvas_y = window.innerHeight;
var scaleRatio = Math.min(canvas_x/gameX, canvas_y/gameY);

var desertBackground;

var game = new Phaser.Game(gameX*scaleRatio, gameY*scaleRatio, Phaser.CANVAS);

game.state.add('boot', bootState);
game.state.add('load', loadState);
game.state.add('main', mainState);
game.state.add('setup',setupState);

game.state.start('boot');