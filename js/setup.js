var setupState = {
    create: function() {
        console.log("Setup Beginning");
        game.state.start('menu');
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