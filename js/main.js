var mainState = {
    preload: function() {

    	makeBackground();
    	level();


    },
    create: function() {
        initializeGame();
    },
    update: function() {
                
    }
};

var EMPTY = 0;
var WALL = 1;
var OBSTACLE = 2;
var ENEMY = 3;
var PLAYER = 4;


var board = [];
var player;
var cars = [];
var obstacles = [];

function initializeGame() {

    // Initialize the board as empty
    for (let x = 0; x < BOARD_WIDTH; x++) {
        board[x] = [];
        for (let y = 0; y < BOARD_HEIGHT; y++) {
            board[x][y] = EMPTY;
            let tile = createSprite(x, y, 'desertTile');
        }
        
    }
    // Put the player onto the board
    player = createSprite(START_X, START_Y, 'truck', TILE_SIZE, 2*TILE_SIZE)
    player.pos = {x: START_X, y: START_Y};
    player.anchor.setTo(0.5,0.25)
    board[player.pos.x][player.pos.y] = PLAYER;

    // Put the enemy right below the player
    makeEnemy(player.pos.x, player.pos.y-2);

}

function updateBoard() {

}

function makeEnemy(xPos, yPos) {
    board[xPos][yPos] = ENEMY;
    let enemy = createSprite(xPos, yPos, 'car');
    enemy.pos = {x: xPos, yPos};
    cars.push(enemy);
}

function makeObstacle(xPos, yPos) {
    board[xPos][yPos] = OBSTACLE;
    let obstacle = createSprite(xPos, yPos, 'obstacle', TILE_SIZE*3, TILE_SIZE);
    obstacle.pos = {x: xPos, yPos};
    obstacles.push(obstacle);
}

function createSprite(x, y, sprite, sizeX = TILE_SIZE, sizeY = TILE_SIZE) {
    let customSprite = game.add.sprite(xLoc(x), yLoc(y), sprite);
    customSprite.anchor.setTo(0.5, 0.5);
    customSprite.scale.setTo(sizeX/customSprite.width, sizeY/customSprite.height);
    console.log(customSprite.width, customSprite.height, sprite);
    return customSprite;
}

function xLoc(x) {
    return game.world.centerX+TILE_SIZE * (x-BOARD_WIDTH/2)+x*MARGIN;
}
function yLoc(y) {
    return game.world.centerY+TILE_SIZE * (y-BOARD_HEIGHT/2)+y*MARGIN;
}

function level() {
    levelText = game.add.bitmapText(game.world.centerX, game.world.centerY + gameY/3, 'zigFont', "Level: " + LEVEL , 15);
    levelText.tint = 0x0000f9;   
}

function updateLevel() {

	    levelText.setText("Level: " + LEVEL, 20);

}