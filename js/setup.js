var setupState = {
    create: function() {
        console.log("Setup Beginning");
        game.state.start('main');
    }
};

function makeBackground() {
    // Sets up the background
    game.scale.pageAlignHorizontally = true; 
    game.scale.pageAlignVertically = true; 
    game.scale.refresh();
    desertBackground = game.add.image(game.world.centerX, game.world.centerY, 'desertBackground');
    desertBackground.anchor.setTo(0.5, 0.5);
    desertBackground.scale.setTo(gameX*scaleRatio/desertBackground.width,gameY*scaleRatio/desertBackground.height);
    // desertBackground.sendToBack();

}


// function makeUI() {
 
//     // Game Over screen
//     gameDone = game.add.sprite(game.world.centerX, game.world.centerY, 'loseScreen');
//     gameDone.scale.setTo(1.2 * scaleRatio,1.2*scaleRatio);
//     gameDone.anchor.setTo(0.5,0.5);
//     gameDone.visible = false;

//     // You Win! Screen
//     youWin = game.add.sprite(-0.1*TILE_SIZE+game.world.centerX, game.world.centerY + 0.75*TILE_SIZE, 'winScreen');
//     youWin.scale.setTo(1.25*scaleRatio,1.5*scaleRatio);
//     youWin.anchor.setTo(0.5,0.5);
//     youWin.visible = false;
//     youWin.inputEnabled = false;
// }