var instructionState = {

	create: function() {

		credit = game.add.sprite(game.world.centerX - 4*TILE_SIZE, game.world.centerY -3*TILE_SIZE , 'instructionPage');
		credit.scale.setTo(0.8,0.8);

		let text = game.add.text(game.world.centerX - 3.7*TILE_SIZE,game.world.centerY + 3*TILE_SIZE ,"Click anywhere to go back to menu!", {font: "18px Arial", fill: "#0ff0ff"});

		game.input.onDown.add(click, this);

		function click() {

			game.state.start("menu");

		}

	}
	
}