var menuState = {

	create: function() {
		
	click = game.add.audio('click', volume);

	var nameLabel = game.add.text(game.world.centerX - gameX/5,game.world.centerY - gameY/3.7 ,"Road Warrior", {font: "64px Arial", fill: "#0ff0ff"});
	console.log("Menued...");

	// Start button
	gameStart = game.add.button(game.world.centerX - 200, game.world.centerY - gameY/5.5, 'start', startClick, this);
	gameStart.scale.setTo(0.25,0.25);

	// Credit button
	credit = game.add.button(game.world.centerX - 200, game.world.centerY, 'credit', creditClick, this)
	gameStart.scale.setTo(0.25,0.25);

	// Instruction button
	credit = game.add.button(game.world.centerX, game.world.centerY, 'instruction', instructionClick, this)
	gameStart.scale.setTo(0.25,0.25);

    // BGM
    backgroundMusic = game.add.audio('bgm', volume, true);


    // Win/Lose Music
	winSound = game.add.audio('win', volume, true);
	loseSound = game.add.audio('lose', volume, true);


	function startClick() {
    	click.play();
		game.state.start('main');
	}	

	function creditClick() {
		click.play();
		game.state.start('credit');
	}

	function instructionClick() {
		click.play();
		game.state.start('instruction');
	}

	}
}