var loadState = {
    preload: function() {

    	// var loadingMessage = game.add.bitmapText(game.world.centerX, game.world.centerY, 'calibri   ', "Loading    ...", 24);
        // loadingMessage.anchor.setTo(0.5,0.5);


        // loadingMessage.text = "Loading Sounds ...";
        
        // // Used to load the background music, game over and win sounds, and UI sounds
        // game.load.audio('winSound', 'assets/sounds/win.mp3');
        // game.load.audio('loseSound', 'assets/sounds/gameover.wav');

        // loadingMessage.text = "Loading UI ...";

        //background image
        game.load.image('gameOver', 'assets/sprites/menus/desertBackground.png');


        // Overlays
        game.load.image('gameOver', 'assets/sprites/menus/gameover.png');
        game.load.image('winScreen', 'assets/sprites/menus/youwin.png');


        // loadingMessage.text = "Loading Sprites ...";
        
        // The sprites
        game.load.image('car', 'assets/sprites/car.png');
        game.load.image('truck', 'assets/sprites/truck.png');
        game.load.image('obstacle', 'assets/sprites/obstacle.png');
        game.load.image('desertTile', 'assets/sprites/desertTile.png');

    },
    create: function() {
        console.log("Loaded!");
        game.state.start('setup');
    }

};