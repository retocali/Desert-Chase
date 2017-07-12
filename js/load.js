var loadState = {
    preload: function() {


    },
    create: function() {
        console.log("Loaded!");
        game.state.start('setup');
    }

};