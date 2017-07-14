var mainState = {
    preload: function() {

    	makeBackground();
    	level();

    },
    create: function() {
        initializeGame();
        makeBarrier(0,0);
        makeBarrier(6,0);

    },
    update: function() {
        if (movesDone == MOVES) {

            moveObstacles();
            
            moveCars();

            moveBarriers();

            runEvent();
            movesDone = 0;
            player.input.enableDrag();
        }

    }
};
// Board inidices values
var EMPTY = 0;
var BARRIER = 1;
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
    makePlayer(START_X+0, START_Y+0);

    // Put the player onto the board
    
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
    enemy.pos = {x: xPos, y: yPos};
    //enemy.scale.y *= -1;
    cars.push(enemy);
}

function makeObstacle(xPos, yPos) {
    board[xPos][yPos] = OBSTACLE;
    let obstacle = createSprite(xPos, yPos, 'obstacle', TILE_SIZE*3+MARGIN*2, TILE_SIZE);
    obstacle.pos = {x: xPos, y: yPos};
    obstacles.push(obstacle);
}

function makeBarrier(xPos, yPos) {
    board[xPos][yPos] = BARRIER;
	let barrier = createSprite(xPos, yPos, 'barrier');
    barrier.pos = {x: xPos, y: yPos};
	
}

function moveBarriers() {
    x++
    y++
    makeBarrier(x,y);
}

function createSprite(x, y, sprite, sizeX = TILE_SIZE, sizeY = TILE_SIZE) {
    let customSprite = game.add.sprite(xLoc(x), yLoc(y), sprite);
    customSprite.anchor.setTo(0.5, 0.5);
    customSprite.scale.setTo(sizeX/customSprite.width, sizeY/customSprite.height);
    return customSprite;
}

function xLoc(x) {
    return game.world.centerX+TILE_SIZE * (x-BOARD_WIDTH/2)+x*MARGIN;
}
function yLoc(y) {
    return game.world.centerY+TILE_SIZE * (y-BOARD_HEIGHT/2)+y*MARGIN;
}

function runEvent() {
    if (Math.random() < SPAWN_CHANCE) {
        makeObstacle(Math.floor(Math.random()*BOARD_WIDTH), 0);
    } else {
        makeEnemy(Math.floor(Math.random()*BOARD_WIDTH), BOARD_HEIGHT-1);
    }
}



// Moving Methods
var distanceX = 0;
var distanceY = 0;
function onDragStart(sprite, pointer) {
    distanceX = pointer.x;
    distanceY = pointer.y;
}
function onDragStop(sprite, pointer) {
    if (movesDone < MOVES) {
        if (pointer.x > distanceX && sprite.pos.x < BOARD_WIDTH-1) {
            sprite.pos.x++;
            movesDone++;
        } else if (pointer.x < distanceX && sprite.pos.x > 0) {
            sprite.pos.x--;
            movesDone++;
        } else if (pointer.x-distanceX == 0){
            movesDone++;
        }
        reposition(player);
    }
    if (movesDone == MOVES) {
        player.input.disableDrag();
    }
}

function reposition(character) {
    character.x = xLoc(character.pos.x);
    character.y = yLoc(character.pos.y);
}

function moveObstacles() {
    for (var i = 0; i < obstacles.length; i++) {
        let obstacle = obstacles[i];
        obstacle.pos.y++;
        if (obstacle.pos.y >= BOARD_HEIGHT) {
            obstacle.destroy();
        }
        reposition(obstacle)
    }
}

function moveCars() {
    for (var i = 0; i < cars.length; i++) {
        let car = cars[i];
        car.pos.y--;
        if (car.pos.y < 0) {
            car.destroy();
        }
        reposition(car);
    }
}

function killPlayer() {

}

function level() {
    levelText = game.add.bitmapText(game.world.centerX, game.world.centerY + gameY/3, 'zigFont', "Level: " + LEVEL , 15);
    levelText.tint = 0x0000f9;   
}

function updateLevel() {
	levelText.setText("Level: " + LEVEL, 20);
}
