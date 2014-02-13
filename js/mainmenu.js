GameManager.MainMenu = function (game) {
    //	Our main menu
    this.game = game;
};

GameManager.MainMenu.prototype = {
    create: function () {
        this.game.world.setBounds( 0, 0, GameManager.width, GameManager.height );
        this.game.stage.backgroundColor = '#717171';
        button = this.game.add.button(this.game.world.centerX, 100, 'start-button', this.startGame, this, 2, 1, 0);
        button.anchor.setTo(0.5, 0.5);
    },

    startGame: function () {
        this.game.state.start( GameManager.levels[0] );
    },
}


