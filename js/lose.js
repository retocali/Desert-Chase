var loseState = {

    create: function() {

        console.log("Lose!");

		var loseText = game.add.text(game.world.centerX - gameX/5,game.world.centerY  ,"Click on the Game Over to restart the game", {font: "20px Arial", fill: "#0ff0ff"});

		// Start button
		gameStart = game.add.button(game.world.centerX - 5*TILE_SIZE, game.world.centerY -5*TILE_SIZE , 'loseScreen', loseClick, this);
		gameStart.scale.setTo(1,1);

		// Lose on Click function
		function loseClick() {
			game.state.start('menu');
		}	

    }
};