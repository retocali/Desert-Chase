var loadState = {
    preload: function() {

    	var loadingMessage = game.add.bitmapText(game.world.centerX, game.world.centerY, 'zigFont', "Loading    ...", 24);
        loadingMessage.anchor.setTo(0.5,0.5);


        loadingMessage.text = "Loading Sounds ...";
        
        // Used to load the background music, game over and win sounds, and UI sounds
        game.load.audio('win!', 'assets/sounds/win.mp3');
        game.load.audio('lose', 'assets/sounds/gameover.wav');

        loadingMessage.text = "Loading UI ...";
        
        // Buttons
        game.load.spritesheet('buttons', "assets/sprites/buttons/buttons.png", 200, 200, 8);
        
        // Overlays
        game.load.image('gameOver', 'assets/sprites/menus/gameover.png');
        game.load.image('winScreen', 'assets/sprites/menus/youwin.png');
        game.load.image('helpScreen','assets/sprites/menus/help.jpg');
        game.load.image('creditPage', "assets/sprites/menus/credits.jpg");


        loadingMessage.text = "Loading Sprites ...";
        
        // The sprites
        game.load.image('car', 'assets/sprites/car.png');
        game.load.image('truck', 'assets/sprites/truck.png');
        game.load.image('obstacle', 'assets/sprites/obstacle.png');

    },
    create: function() {
        console.log("Loaded!");
        game.state.start('setup');
    }

};