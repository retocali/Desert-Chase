var mainState = {
    preload: function() {

    	makeBackground();
    	level();


    },
    create: function() {
        initializeGame();
    },
    update: function() {
        if (movesDone == MOVES) {
            moveObstacles();
            moveCars();
        }

    }
};

var EMPTY = 0;
var WALL = 1;
var OBSTACLE = 2;
var ENEMY = 3;
var PLAYER = 4;

var movesDone = 0;
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
    makePlayer(START_X, START_Y);

    // Put the player onto the board
    let xPos = START_X;
    let yPos = START_Y;
    
    // Put the enemy right below the player
    makeEnemy(START_X, START_Y+3);
}
// Creating Methods
function makePlayer(xPos, yPos) {
    // Put the player onto the board
    player = createSprite(xPos, yPos, 'truck', TILE_SIZE, 2*TILE_SIZE+MARGIN);
    player.pos = {x: xPos, y: yPos};
    board[player.pos.x][player.pos.y] = PLAYER;
    board[player.pos.x][player.pos.y+1] = PLAYER;
    player.anchor.setTo(0.5,0.25);
    player.inputEnabled = true;
    player.input.enableDrag();
    player.events.onDragStop.add(onDragStop, this);
    player.events.onDragStart.add(onDragStart, this);
    
}

function makeEnemy(xPos, yPos) {
    board[xPos][yPos] = ENEMY;
    let enemy = createSprite(xPos, yPos, 'car');
    enemy.pos = {x: xPos, yPos};
    enemy.scale.y *= -1;
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


// Moving Methods
var distance = 0;
function onDragStart(sprite, pointer) {
    distance = pointer.x;
}
function onDragStop(sprite, pointer) {
    if (movesDone < MOVES) {
        if (pointer.x > distance) {
            sprite.pos.x ++;
        } else if (pointer.x < distance) {
            sprite.pos.x --;
        }
        positionObject(player);
        movesDone++;
    }
    if (movesDone == MOVES) {
        player.input.disableDrag();
    }
}

function positionObject(character) {
    character.x = xLoc(character.pos.x);
    character.y = xLoc(character.pos.y);
}

function moveObstacles() {
    for (var i = 0; i < obstacles.length; i++) {
        var obstacle = obstacles[i];
        obstacle.pos.x++;
    }
}

function moveCars() {
    for (var i = 0; i < cars.length; i++) {
        var car = cars[i];
        car.pos.x++;
    }
}

function killPlayer() {
function level() {
    levelText = game.add.bitmapText(game.world.centerX, game.world.centerY + gameY/3, 'zigFont', "Level: " + LEVEL , 15);
    levelText.tint = 0x0000f9;   
}

function updateLevel() {

	    levelText.setText("Level: " + LEVEL, 20);

}