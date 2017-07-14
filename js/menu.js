var menuState = {

	create: function() {

	var nameLabel = game.add.text(game.world.centerX - gameX/5,game.world.centerY - gameY/10 ,"Road Warrior", {font: "50px Arial", fill: "#0ff0ff"});
	console.log("Menued...");

	// Start button
	gameStart = game.add.button(game.world.centerX - 200, game.world.centerY + 50, 'start', startClick, this);
	gameStart.scale.setTo(0.25,0.25);

	// Credit button
	credit = game.add.button(game.world.centerX - 200, game.world.centerY + 200, 'credit', creditClick, this)
	gameStart.scale.setTo(0.25,0.25);

	// Instruction button
	credit = game.add.button(game.world.centerX, game.world.centerY + 200, 'instruction', instructionClick, this)
	gameStart.scale.setTo(0.25,0.25);

	function startClick() {
		game.state.start('main');
	}	

	function creditClick() {
		game.state.start('credit');
	}

	function instructionClick() {
		game.state.start('instruction');
	}

	}
}