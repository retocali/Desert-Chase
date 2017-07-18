var winState = {

    create: function() {

        console.log("Win!");

		var winText = game.add.text(game.world.centerX - gameX/5,game.world.centerY - TILE_SIZE*5,"Click on the You Win to start new level", {font: "20px Arial", fill: "#0ff0ff"});

		// Start button
		gameStart = game.add.button(game.world.centerX - 5.5*TILE_SIZE, game.world.centerY -5*TILE_SIZE , 'winScreen', winClick, this);
		gameStart.scale.setTo(0.75,0.75);

		winMusic();

		// Win on Click function
		function winClick() {
			game.state.start('lose');
		}	

	    function winMusic() {
	    	winSound.play("",0,1,false);
		}

    }
};