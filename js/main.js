var mainState = {
    preload: function() {

    	makeBackground();
    	Darkness();
    	level();

    },
    create: function() {
        initializeGame();

        // to go back to Menu
        gameMenu = game.add.button(game.world.centerX + TILE_SIZE*(BOARD_WIDTH/2-1), game.world.centerY - TILE_SIZE*(BOARD_HEIGHT/2+1), 'menu', menuClick, this);
        gameMenu.anchor.setTo(0.5,0.5);
        gameMenu.scale.setTo(0.125,0.125);

        function menuClick() {
            gameReset();
        	if (volume) {
	            backgroundMusic.stop(); 
            }
            game.state.start('menu');
        }   

        function muteClick() {
            
            if (volume) {
                backgroundMusic.stop();
                muted.bringToTop();
                muted.visible = true;
                mute.visible = false;
                console.log('Pause');
            } else {

                backgroundMusic.play('',0,1,true, true);
                muted.visible = false;
                mute.visible = true;
                console.log('Play');

            }
            volume = !volume;
        }
        
        var mute_x = game.world.centerX - TILE_SIZE*(BOARD_WIDTH/2-1);
        var mute_y = game.world.centerY - TILE_SIZE*(BOARD_HEIGHT/2+1);
        
        mute = game.add.button(mute_x, mute_y, 'mute', muteClick, this);
        mute.anchor.setTo(0.5,0.5);
        mute.scale.setTo(0.3,0.3);

        muted = game.add.button(mute_x, mute_y, 'muted', muteClick, this);
        muted.anchor.setTo(0.5,0.5);
        muted.scale.setTo(0.3,0.3);

        if (volume) {
            mute.bringToTop();
            backgroundMusic.play();
        }

    },
    update: function() {
        desertBackground.tilePosition.y += 5;
        if (movesDone == MOVES) {
            eventCount++;


            game.time.events.add(TIME_GAP, moveBarriers, this);
            game.time.events.add(TIME_GAP*2, moveObstacles, this);
            game.time.events.add(TIME_GAP*3, moveCars, this);
            
            if (eventCount == 2) {
                game.time.events.add(TIME_GAP*4, runEvent, this);
                eventCount = 0;
            }
            
            
            game.time.events.add(TIME_GAP*5, detectCollisions, this);

            game.time.events.add(TIME_GAP*6, checkPlayer, this);
            movesDone = 0;  
        }
    },
    render: function() {
        // game.debug.text("Time until event: " + game.time.events.duration, 32, 32)
    }
};
// Board inidices values
var EMPTY = 0;
var BARRIER = 1;
var OBSTACLE = 2;
var ENEMY = 3;
var PLAYER = 4;

// Directions 
var UP = -1;
var DOWN = 1;
var LEFT = -1;
var RIGHT = 1;
var distanceX = 0;
var distanceY = 0;
var currentBarrierWidth = 1;
var eventCount = 0;
var TIME_GAP = Phaser.Timer.QUARTER/5;

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

function gameReset() {
    //board = [];
    cars = [];
    obstacles = [];
    barriers = [];
    events = [];
}
function runEvent() {
    var event = events.shift();
    switch (event[0]) {
        case "OBSTACLE":
            makeObstacle(Math.floor(Math.random()*(BOARD_WIDTH-2))+1, 0);
            break;
        case "CAR":
            makeEnemy(Math.floor(Math.random()*(BOARD_WIDTH-currentBarrierWidth))+currentBarrierWidth, BOARD_HEIGHT-1);
            break;
        case "SHRINK":
            currentBarrierWidth = Math.max(0, --currentBarrierWidth);
            break;
        case "GROW":
            currentBarrierWidth = Math.min(Math.floor(BOARD_WIDTH/2)-1, ++currentBarrierWidth); 
            break;
        default:
            break;
    }
    LEVEL++;
    updateLevel();
    event[1].destroy();
    makeEvent(0);
    updateEvents();
}

function detectCollisions() {
    // Check Collision
    updateBoard();
    for (var i = 0; i < cars.length; i++) {
    	let crashed = false;
        let car = cars[i];
        var collider = collision(car, ENEMY);
        if (collider[0] && collider[1] != car) {
            killObject(car, cars);
            killObject(collider[1], cars)
            crashed = true;
        }
        var collider = collision(car, OBSTACLE)
        if (collider[0]) {
            killObject(car, cars);
            killObject(collider[1], obstacles)
			crashed = true;

        }
        var collider = collision(car, BARRIER)
        if (collider[0]) {
            killObject(car, cars);
			crashed = true;

        }

        if (crashed) {
        	let crash = createSprite(car.pos.x, car.pos.y, 'explosion', 1.5*TILE_SIZE, 1.5*TILE_SIZE);
        	crash.lifespan = 500;
			crashSound = game.add.audio('crash', volume, true);
			crashSound.play("",0,1,false);

        }
    }
    updateBoard();

}

function checkPlayer() {
    [BARRIER, OBSTACLE, ENEMY].forEach(function(TYPE) {
        if (collision(player, TYPE)[0]) {
            killPlayer(TYPE);
        } 
    }, this);
    player.input.enableDrag();
}

// Creating Methods
function initializeGame() {

    backgroundMusic.play();
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
        let x = pointer.x - distanceX;
        let y = pointer.y - distanceY;
        click = game.add.audio('click', volume);
        click.play();
    
        if (movesDone < MOVES) {
            if (Math.abs(x) > Math.abs(y)) { //Horizontal move
                if (x > 0 && sprite.pos.x < BOARD_WIDTH-1) {
                    movePlayer(RIGHT);
                } else if (x < 0 && sprite.pos.x > 0) {
                    movePlayer(LEFT);
                }
                reposition(player);
            } else if (Math.abs(x) < Math.abs(y)) {
                if (y > 0 && sprite.pos.y < BOARD_HEIGHT-sprite.gameLength && movesDone == 0) {
                    verticalMove(DOWN);
                } else if (y < 0 && sprite.pos.y > 0 && movesDone == 0) {
                    verticalMove(UP);
                }
                reposition(player);
            } else if (x == 0 && y == 0){
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
    cars.push(enemy);
}

function makeObstacle(xPos, yPos) {
    console.log(xPos, yPos)
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
    var num = Math.random();
    if (num < SPAWN_CHANCE) {
        if (num < OBSTACLE_SPAWN) {
            let event = createSprite(i+2, BOARD_HEIGHT+0.5, 'obstacle');
            events.push(["OBSTACLE", event]);
        } else {
            let event = createSprite(i+2, BOARD_HEIGHT+0.5, 'car');
            events.push(["CAR", event]);
        }
    } else {
        if (Math.random() < 0.5) {
            let event = createSprite(i+2, BOARD_HEIGHT+0.5, 'barrier');
            event.tint = 0x00ff00;
            events.push(["GROW", event])
        } else {
            let event = createSprite(i+2, BOARD_HEIGHT+0.5, 'barrier');
            event.tint = 0xff0000;
            events.push(["SHRINK", event])
        }
    }
}


// Moving Methods
function moveBarriers() {
    let x1 = 0;
    let x2 = BOARD_WIDTH-1;
    let y = 0;
    var dead_barriers = []
    for (var i = 0; i < barriers.length; i++) {
        let barrier = barriers[i];
        barrier.pos.y++;
        reposition(barrier);
        if (barrier.pos.y >= BOARD_HEIGHT) {
            dead_barriers.push(barrier);
        }
    }
    for (var i  = 0; i < dead_barriers.length; i++) {
        killObject(dead_barriers[i], barriers);    
    }
    for (var i = 0; i < currentBarrierWidth; i++) {
        makeBarrier(x1+i,y);
        makeBarrier(x2-i,y);    
    }
    
    console.log("Barriers Moved");
}

function moveObstacles() {
    var dead_obstacles = [];
    for (var i = 0; i < obstacles.length; i++) {
        let obstacle = obstacles[i];
        obstacle.pos.y++;
        reposition(obstacle)
        if (obstacle.pos.y >= BOARD_HEIGHT) {
            dead_obstacles.push(obstacle);
        }
    }
    for (var i = 0; i < dead_obstacles.length; i++) {
        killObject(dead_obstacles[i], obstacles);
    }
    detectCollisions();
    console.log("Obstacles Moved");
}

function moveCars() {
    var dead_cars = []
    for (var i = 0; i < cars.length; i++) {
        let car = cars[i];
        car.pos.y--;
        reposition(car);
        if (car.pos.y < 0) {
            dead_cars.push(car);
        }       
    }
    for (var i = 0; i < dead_cars.length; i++) {
        killObject(dead_cars[i], cars);
    }
    detectCollisions();
    console.log("Cars Moved");
}

function movePlayer(direction) {
    player.pos.x += direction;
    if (collision(player,BARRIER)[0] || collision(player,OBSTACLE)[0]) {
        player.pos.x -= direction;
        reposition(player);
        return;
    }
    if (collision(player,ENEMY)[0]) {
        front = pushCar(player.pos.x, player.pos.y, direction);
        back = pushCar(player.pos.x, player.pos.y+1, direction);
        if (!front && !back) {
            player.pos.x -= direction;
            movesDone--;
        }
        reposition(player)
    }
    movesDone++;
}

function verticalMove(direction) {
    player.pos.y += direction;
    if (collision(player,BARRIER)[0] || collision(player,OBSTACLE)[0]) {
        player.pos.y -= direction;
        reposition(player);
        return;
    }
    movesDone += 2;
}

function pushCar(x, y, direction) {
    if (board[x][y][0] != ENEMY || player.pos.x == BOARD_WIDTH-1 || player.pos.x == 0) {
        return false;
    }
    let car = board[x][y][1];
    if (direction == LEFT) {
        car.pos.x = Math.max(--car.pos.x, 0);
    } else if (direction == RIGHT) {
        car.pos.x = Math.min(++car.pos.x, BOARD_WIDTH-1);
    }
    reposition(car);
    detectCollisions();
    return true;
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
    player.input.disableDrag();
	let explosion = createSprite(player.pos.x, player.pos.y, 'explosion', 2*TILE_SIZE, 2*TILE_SIZE);
	explosionSound = game.add.audio('explosionSound', volume, true);
    explosionSound.play("",0,1,false);
    gameReset();
	game.time.events.add(Phaser.Timer.SECOND, function() { game.state.start('lose');}, this);
	// add some type of delay here
    
}

function killObject(object, objects) {
    objects.splice(objects.indexOf(object), 1);
    object.destroy();
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
    levelText = game.add.bitmapText(game.world.centerX, game.world.centerY-TILE_SIZE*(BOARD_HEIGHT/2+1), 'zigFont', "MILE: " + LEVEL , 20);
    levelText.anchor.setTo(0.5,0.5);
    levelText.tint = 0x0000f9;   
}

function updateLevel() {
	levelText.setText("MILE: " + LEVEL, 20);
	if (LEVEL == 50) {
		game.state.start('win');
	}
}

function updateEvents() {
    for (let i = 0; i < events.length; i++) {
        let event = events[i];
        event[1].x = xLoc(i+2)
    }
}

// Making the black spot

function Darkness() {
    let darknessUp = game.add.sprite(0, 0, 'black');
    darknessUp.scale.setTo(gameX/darknessUp.width, (game.world.centerY-(BOARD_HEIGHT/2*TILE_SIZE)-5)/darknessUp.height);

    let darknessDown = game.add.sprite(0, (game.world.centerY+(BOARD_HEIGHT/2*TILE_SIZE)+5), 'black')
    darknessDown.scale.setTo(gameX/darknessUp.width, (game.world.centerY+(BOARD_HEIGHT/2*TILE_SIZE))/darknessUp.height);
}
