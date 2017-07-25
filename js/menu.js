var menuState = {

	create: function() {
	

	click = game.add.audio('click', volume);

    nameLabelDesert = game.add.bitmapText(game.world.centerX, game.world.centerY - TILE_SIZE*5, 'zigFont', "Desert", 72);
    nameLabelDesert.anchor.setTo(0.5,0.5);
    nameLabelDesert.tint = 0x00bbff;   

    nameLabelChase = game.add.bitmapText(game.world.centerX, game.world.centerY - TILE_SIZE*4, 'zigFont', "Chase", 72);
    nameLabelChase.anchor.setTo(0.5,0.5);
    nameLabelChase.tint = 0x00bbff;  

	console.log("Menued...");

	// Start button
	gameStart = game.add.button(game.world.centerX, game.world.centerY - 2*TILE_SIZE, 'start', startClick, this);
	gameStart.anchor.setTo(0.5,0.5);
	gameStart.scale.setTo(0.5,0.5);

	// Instruction button
	instruction = game.add.button(game.world.centerX, +0.75*TILE_SIZE +game.world.centerY, 'instruction', instructionClick, this)
	instruction.anchor.setTo(0.5,0.5);
	instruction.scale.setTo(0.5,0.5);

	// Credit button
	credit = game.add.button(game.world.centerX, game.world.centerY + 3.5*TILE_SIZE, 'credit', creditClick, this)
	credit.anchor.setTo(0.5,0.5);
	credit.scale.setTo(0.5,0.5);

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