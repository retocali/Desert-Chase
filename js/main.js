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

            moveBarriers();

            moveObstacles();

            moveCars();
            
            runEvent();
            
            detectCollisions();

            [BARRIER, OBSTACLE, ENEMY].forEach(function(TYPE) {
                if (collision(player, TYPE)[0]) {
                    killPlayer(TYPE);
                } 
            }, this);

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

// Directions 
var LEFT = -1;
var RIGHT = 1;
var distanceX = 0;
var distanceY = 0;

var movesDone = 0;
var board = [];
var player;
var cars = [];
var obstacles = [];
var barriers = [];
var events = []

// Update Functions
function updateBoard() {
    // Assume the board is empty
    for (let x = 0; x < BOARD_WIDTH; x++) {
        for (let y = 0; y < BOARD_HEIGHT; y++) {
            board[x][y] = [EMPTY, EMPTY];
        }   
    }

    // Add Player
    board[player.pos.x][player.pos.y] = [PLAYER, player];
    board[player.pos.x][player.pos.y+1] = [PLAYER, player];
    
    // Add cars
    for (var i = 0; i < cars.length; i++) {
        let car = cars[i];
        board[car.pos.x][car.pos.y] = [ENEMY, car];
    }

    // Add obstacles
    for (var i = 0; i < obstacles.length; i++) {
        let obstacle = obstacles[i];
        board[obstacle.pos.x][obstacle.pos.y] = [OBSTACLE, obstacle];
        board[obstacle.pos.x-1][obstacle.pos.y] = [OBSTACLE, obstacle];
        board[obstacle.pos.x+1][obstacle.pos.y] = [OBSTACLE, obstacle];
    }
    // Add barrier
    for (var i = 0; i < barriers.length; i++) {
        let barrier = barriers[i];
        board[barrier.pos.x][barrier.pos.y] = [BARRIER, barrier];
    }
}

function runEvent() {
    var event = events.shift();
    if (event[0] == "OBSTACLE") {
        makeObstacle(Math.floor(Math.random()*(BOARD_WIDTH-2))+1, 0);
    } else if (event[0] == "CAR") {
        makeEnemy(Math.floor(Math.random()*BOARD_WIDTH), BOARD_HEIGHT-1);
    }
    event[1].destroy();
    makeEvent(0);
    updateEvents();
}

function detectCollisions() {
    // Check Collision
    updateBoard();
    for (var i = 0; i < cars.length; i++) {
        let car = cars[i];
        var collider = collision(car, ENEMY);
        if (collider[0] && collider[1] != car) {
            killObject(car, cars);
            killObject(collider[1], cars)
        }
        var collider = collision(car, OBSTACLE)
        if (collider[0]) {
            killObject(car, cars);
            killObject(collider[1], obstacles)
        }
        var collider = collision(car, BARRIER)
        if (collider[0]) {
            killObject(car, cars);
        }
    }
    updateBoard();
}


// Creating Methods
function initializeGame() {

    // Initialize the board as empty
    for (let x = 0; x < BOARD_WIDTH; x++) {
        board[x] = [];
        for (let y = 0; y < BOARD_HEIGHT; y++) {
            let tile = createSprite(x, y, 'desertTile');
            board[x][y] = [EMPTY, EMPTY];
        }
        
    }
    // Put the player onto the board
    makePlayer(START_X+0, START_Y+0);
    // Put the enemy right below the player
    makeEnemy(START_X, START_Y+3);

    for (let i = 0; i < EVENTS_SHOWN; i++) {
        makeEvent(i);
    }
}

function makePlayer(xPos, yPos) {
    // Put the player onto the board
    player = createSprite(xPos, yPos, 'truck', TILE_SIZE, 2*TILE_SIZE+MARGIN);
    player.pos = {x: xPos, y: yPos};

    player.gameWidth = 1;
    player.gameLength = 2;
    board[player.pos.x][player.pos.y] = [PLAYER, player];
    board[player.pos.x][player.pos.y+1] = [PLAYER, player];
    
    player.anchor.setTo(0.5,0.25);
    
    player.inputEnabled = true;
    player.input.enableDrag();
    player.events.onDragStop.add(onDragStop, this);
    player.events.onDragStart.add(onDragStart, this);

    function onDragStart(sprite, pointer) {
        distanceX = pointer.x;
        distanceY = pointer.y;
    }

    function onDragStop(sprite, pointer) {
        let x = sprite.pos.x;
        let y = sprite.pos.y;
        if (movesDone < MOVES) {
            if (pointer.x > distanceX && sprite.pos.x < BOARD_WIDTH-1) {
                movePlayer(RIGHT)
            } else if (pointer.x < distanceX && sprite.pos.x > 0) {
                movePlayer(LEFT)
            } else if (pointer.x-distanceX == 0){
                movesDone++;
            }
            reposition(player);
            updateBoard();
        }
        if (movesDone == MOVES) {
            player.input.disableDrag();
        }
    }
}

function makeEnemy(xPos, yPos) {
    let enemy = createSprite(xPos, yPos, 'car');
    
    board[xPos][yPos] = [ENEMY, enemy];
    enemy.gameWidth = 1;
    enemy.gameLength = 1;
    
    enemy.pos = {x: xPos, y: yPos};
    enemy.scale.y *= -1;
    cars.push(enemy);
}

function makeObstacle(xPos, yPos) {
    let obstacle = createSprite(xPos, yPos, 'obstacle', TILE_SIZE*3+MARGIN*2, TILE_SIZE);
    
    obstacle.gameWidth = 3;
    obstacle.gameLength = 1;
    
    board[xPos][yPos] = [OBSTACLE, obstacle];
    board[xPos-1][yPos] = [OBSTACLE, obstacle];
    board[xPos+1][yPos] = [OBSTACLE, obstacle];
    
    obstacle.pos = {x: xPos, y: yPos};
    obstacles.push(obstacle);
}

function makeBarrier(xPos, yPos) {
	let barrier = createSprite(xPos, yPos, 'barrier');
    
    barrier.gameWidth = 1;
    barrier.gameLength = 1;
    board[xPos][yPos] = [BARRIER, barrier];
    
    barrier.pos = {x: xPos, y: yPos};
    barriers.push(barrier);
}

function makeEvent(i) {
    if (Math.random() < SPAWN_CHANCE) {
        let event = createSprite(i+1, BOARD_HEIGHT+0.5, 'obstacle');
        events.push(["OBSTACLE", event]);
    } else {
        let event = createSprite(i+1, BOARD_HEIGHT+0.5, 'car');
        events.push(["CAR", event]);
    }
}


// Moving Methods
function moveBarriers() {
    let x = 0;
    let z = 6;
    let y = -1;
    makeBarrier(x,y);
    makeBarrier(z,y);

    for (var i = 0; i < barriers.length; i++) {
        let barrier = barriers[i];
        barrier.pos.y++;
        if (barrier.pos.y >= BOARD_HEIGHT) {
            killObject(barrier, barriers)
        }
        reposition(barrier)
    }
    detectCollisions();
}

function moveObstacles() {
    for (var i = 0; i < obstacles.length; i++) {
        let obstacle = obstacles[i];
        obstacle.pos.y++;
        reposition(obstacle)
        if (obstacle.pos.y >= BOARD_HEIGHT) {
            killObject(obstacle, obstacles)
        }
    }
    detectCollisions();
}

function moveCars() {
    for (var i = 0; i < cars.length; i++) {
        let car = cars[i];
        car.pos.y--;
        reposition(car);
        if (car.pos.y < 0) {
            killObject(car, cars);
        }       
    }
    detectCollisions();
}

function movePlayer(direction) {
    player.pos.x += direction;
    if (collision(player,BARRIER)[0] || collision(player,OBSTACLE)[0]) {
        player.pos.x -= direction;
        reposition(player);
        return;
    }
    if (collision(player,ENEMY)[0]) {
        pushCar(player.pos.x, player.pos.y, direction);
        pushCar(player.pos.x, player.pos.y+1, direction);
    }
    movesDone++;
}

function pushCar(x, y, direction) {
    if (board[x][y][0] != ENEMY) {return;}
    let car = board[x][y][1];
    if (direction == LEFT) {
        car.pos.x = Math.max(--car.pos.x, 0);
    } else if (direction == RIGHT) {
        car.pos.x = Math.min(++car.pos.x, BOARD_WIDTH-1);
    }
    reposition(car);
}

function collision(character, OBJECT) {
    let x = character.pos.x;
    let y = character.pos.y;

    for (let w = Math.ceil(-character.gameWidth/2); w <= Math.floor(character.gameWidth/2); w++) {
        for (let l = 0; l < character.gameLength; l++) {
            if (x+w < 0 || x+w >= BOARD_WIDTH
             || y+l < 0 || y+l >= BOARD_HEIGHT) {
                continue;
            }
            if (board[x+w][y+l][0] == OBJECT) {
                return [true, board[x+w][y+l][1]];
            }
        }
    }
    return [false, null];
}

// Custom Phaser-based Functions
function killPlayer(TYPE) {
    console.log("You're dead, nerd!");
}

function killObject(object, objects) {
    objects.splice(objects.indexOf(object), 1);
    object.destroy();
    delete object;
}

function reposition(character) {
    character.x = xLoc(character.pos.x);
    character.y = yLoc(character.pos.y);
}

function createSprite(x, y, sprite, sizeX = TILE_SIZE, sizeY = TILE_SIZE) {
    let customSprite = game.add.sprite(xLoc(x), yLoc(y), sprite);
    customSprite.anchor.setTo(0.5, 0.5);
    customSprite.scale.setTo(sizeX/customSprite.width, sizeY/customSprite.height);
    return customSprite;
}

function xLoc(x) {
    return game.world.centerX+TILE_SIZE * (x-Math.floor(BOARD_WIDTH/2))+x*MARGIN;
}

function yLoc(y) {
    return game.world.centerY+TILE_SIZE * (y-Math.floor(BOARD_HEIGHT/2))+y*MARGIN;
}

// UI Functions
function level() {
    levelText = game.add.bitmapText(game.world.centerX, game.world.centerY + gameY/3, 'zigFont', "Level: " + LEVEL , 15);
    levelText.tint = 0x0000f9;   
}

function updateLevel() {
	levelText.setText("Level: " + LEVEL, 20);
}

function updateEvents() {
    for (let i = 0; i < events.length; i++) {
        let event = events[i];
        event[1].x = xLoc(i+1)
    }
}
