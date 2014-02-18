GameManager.Preloader = function (game) {
	this.game = game;
};

GameManager.Preloader.prototype = {

	preload: function () {
                this.game.load.spritesheet('hero', 'assets/hero.png', 32, 32);
                this.game.load.spritesheet('enemy', 'assets/enemy.png', 32, 32);
                this.game.load.image('dead-enemy', 'assets/dead-enemy.png', 32, 32);
                this.game.load.image('start-button', 'assets/start-button.png', 80, 20);
                this.game.load.tilemap('level2', 'assets/level2.json', null, Phaser.Tilemap.TILED_JSON);
                this.game.load.image('tileset', 'assets/tileset.png');
                
	},
        
	create: function () {
            this.game.state.start(GameManager.levels[0]);
	}

}

