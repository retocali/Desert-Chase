var bootState = {
    preload: function() {
        
    },
    create: function() {

        console.log("Booted!");
        game.state.start('load');
    }
};