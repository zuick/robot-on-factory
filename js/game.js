GameManager.levelConstructor = function( levelName ){
    return function( game ){
        this.game = game;
        this.create = function(){
            this.enableFullscreen();
            
            this.game.stage.backgroundColor = '#000';
            this.map = this.game.add.tilemap( levelName );
            this.map.addTilesetImage('tileset', 'tileset');
            this.map.setCollision( [4,5,6] );
            this.mapLayer = this.map.createLayer('ground');
            this.mapLayer.resizeWorld();
            
            this.player = this.createPlayer();
            this.enemies = this.createEnemies();
            
            this.cursors = this.game.input.keyboard.createCursorKeys();
            
            this.game.camera.follow( this.player );
        }
        this.update = function(){
            this.game.physics.collide(this.player, this.mapLayer, this.checkPlayerCollisions, null, this.game );

            //  Reset the players velocity (movement)
            this.player.body.velocity.x = 0;

            if (this.cursors.left.isDown)
            {
                //  Move to the left
                this.player.body.velocity.x = - GameManager.player.speed;

                this.player.animations.play('left');
            }
            else if (this.cursors.right.isDown)
            {
                //  Move to the right
                this.player.body.velocity.x = GameManager.player.speed;
                //game.camera.x +=5;
                this.player.animations.play('right');
            }
            else
            {
                //  Stand still
                this.player.animations.stop();

                this.player.frame = 4;
            }

            //  Allow the player to jump if they are touching the ground.
            if (this.cursors.up.isDown && this.player.body.onFloor() )
            {
                this.player.body.velocity.y = -GameManager.player.jump;
            }
        }
        this.getObjectsPositionFromMap = function ( map, layerName, tileIndex ){
            var result = [];
            // find layer
            for( var i in map.layers ){
                var layer = map.layers[i];
                if( layer.name == layerName ){
                    // find objects
                    for( var k in layer.data ){
                        for( var l in layer.data ){
                            if( layer.data[k][l] && layer.data[k][l].index == tileIndex ){
                                result.push({x: l , y: k });
                            }         
                        }
                    }
                    break;
                }
            }

            return result;
        }
    
        this.checkPlayerCollisions = function ( player, object ){
            if( object.tile.index == 4 ) {
                this.state.start( GameManager.nextLevel() );
            }
        }
        
        this.enableFullscreen = function(){
            Phaser.Canvas.setSmoothingEnabled(this.game.context, false)
            this.game.stage.fullScreenScaleMode = Phaser.StageScaleMode.SHOW_ALL;
            game.input.onDown.add( function(){ this.game.stage.scale.startFullScreen(); }, this);
        }
        
        this.createPlayer = function(){
            var heroXY = this.getObjectsPositionFromMap( this.map, 'characters', GameManager.player.tileIndex )[0];
            var player = this.game.add.sprite( heroXY.x * this.map.tileWidth, heroXY.y * this.map.tileHeight, 'hero');
            player.body.bounce.y = GameManager.player.bounce;
            player.body.gravity.y = GameManager.player.gravity;
            player.body.collideWorldBounds = true;
            player.animations.add('left', [1,2,0], 7, true);
            player.animations.add('right', [4,3,5], 7, true);
            return player;
        }
        
        this.createEnemies = function(){
            var enemies = this.game.add.group();
            var enemiesXY = this.getObjectsPositionFromMap( this.map, 'characters', GameManager.enemy.tileIndex );
            for( var i in enemiesXY ){
                enemies.create( enemiesXY[i].x * this.map.tileWidth, enemiesXY[i].y * this.map.tileHeight, 'enemy' );
            }
            return enemies;
        }
    }
}