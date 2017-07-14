var instructionState = {

	create: function() {

		credit = game.add.sprite(game.world.centerX - 200 , game.world.centerY - 100, 'instructionPage');
		credit.scale.setTo(0.5,0.5);
		let text = game.add.text(game.world.centerX - gameX/5,game.world.centerY - gameY/8 ,"Click anywhere to go back to menu!", {font: "15px Arial", fill: "#0ff0ff"});

		game.input.onDown.add(click, this);

		function click() {

			game.state.start("menu");

		}

	}
	
}