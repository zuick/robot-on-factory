GameManager.levelConstructor = function( levelName ){
    return function( game ){
        this.game = game;
        this.render = function(){
        }
        this.create = function(){
            this.enableFullscreen();
            
            this.game.stage.backgroundColor = '#000';
            this.map = this.game.add.tilemap( levelName );
            this.map.addTilesetImage('tileset', 'tileset');
            this.map.setCollision( [4,5,6,7,8] );
            this.mapLayer = this.map.createLayer('ground');
            this.mapLayer.resizeWorld();
            
            this.enemies = this.createEnemies();
            this.player = this.createPlayer();
            this.lifts = this.createLifts();
            
            this.cursors = this.game.input.keyboard.createCursorKeys();
            this.key1 = game.input.keyboard.addKey(Phaser.Keyboard.ONE);
            this.key1.onDown.add(this.changeTile, this);
            
            this.key2 = game.input.keyboard.addKey(Phaser.Keyboard.TWO);
            this.key2.onDown.add( function(){ this.findAndDestroyTileLines( 'ground', [5,6,7,8]); }.bind(this), this);
            
            this.game.camera.follow( this.player );
        }
        this.update = function(){
            this.game.physics.collide(this.player, this.mapLayer, this.checkPlayerCollisions, null, this.game );
            this.game.physics.collide(this.player, this.enemies, this.checkPlayerCollisions, this.processPlayerEnemyCollisions, this.game );
            this.game.physics.collide(this.player, this.lifts);
            this.game.physics.collide(this.lifts, this.mapLayer);
            this.game.physics.collide(this.enemies, this.mapLayer);
            this.game.physics.collide(this.enemies, this.enemies, null, this.processEnemiesCollisions, this.game );
            
            //  Reset the players velocity (movement)
            this.player.body.velocity.x = 0;
            
            if( !this.player.dead ){
                if (this.cursors.left.isDown){
                    //  Move to the left
                    this.player.body.velocity.x = - GameManager.player.speed;
                    this.player.animations.play('left');
                }else if (this.cursors.right.isDown){
                    //  Move to the right
                    this.player.body.velocity.x = GameManager.player.speed;
                    this.player.animations.play('right');
                }else{
                    //  Stand still
                    this.player.animations.stop();

                    this.player.frame = 4;
                }
            }
            
            //  Allow the player to jump if they are touching the ground.
            if (this.cursors.up.isDown && this.player.body.onFloor() ){
                this.player.body.velocity.y = -GameManager.player.jump;
            }
            
            this.enemies.forEach( function( enemy ){
                enemy.moveLogic();
            }, this.game)
            
            this.lifts.forEach( function( lift ){
                lift.moveLogic();
            }, this.game)
        }
        
        this.getObjectsPositionFromMap = function ( map, layerName, tileIndex ){
            var result = [];
            // find layer
            for( var i in map.layers ){
                var layer = map.layers[i];
                if( layer.name == layerName ){
                    // find objects
                    for( var k in layer.data ){
                        for( var l in layer.data[k] ){
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
        this.changeTile = function(){
            this.map.putTile( 5, Math.floor( this.player.x / this.map.tileWidth ), Math.floor( this.player.y / this.map.tileHeight ) + 2, "ground");
            this.map.setCollision( [4,5,6,7,8] );
        }
        this.destroyTileLine = function( row, layer, tileIndexes ){
            for( var i in layer.data[row] ){
                var tileIndex = Math.floor( Math.random() * tileIndexes.length );
                this.map.putTile( tileIndexes[tileIndex], i, parseInt( row ), layer.name );
                if( layer.data[row][i] ) layer.data[row][i].collides = false;
            }
            this.map.setCollision( [4,5,6,7,8] );
        }
        this.findAndDestroyTileLines = function( layerName, tileIndexes ){
            for( var i in this.map.layers ){
                var layer = this.map.layers[i];
                if( layer.name == layerName ){
                    for( var k in layer.data ){
                        for( var l in layer.data[k] ){
                            // check if tile collidable
                            if( layer.data[k][l] && tileIndexes.indexOf( layer.data[k][l].index ) >= 0 ){
                                // check if it last tile in row
                                if( l == layer.data[k].length - 1 ){
                                    this.destroyTileLine( k, layer, [1,2,3] );
                                }
                            }else{
                                break;
                            }
                        }
                    }
                }
            }
        }
        this.processEnemiesCollisions = function( enemyA, enemyB ){
            if( enemyA.dead || enemyB.dead ) return false;
            else return true;
        }
        
        this.processPlayerEnemyCollisions = function( player, enemy ){
            if( enemy.dead || player.dead ) return false;
            else return true;
        }
    
        this.checkPlayerCollisions = function ( player, object ){
            if( object.tile && object.tile.index == 4 ) {
                this.state.start( GameManager.nextLevel() );
            }else if( object.key == 'enemy' ){
                if( object.body.touching.up ){
                    player.body.velocity.y = -GameManager.player.jump;
                    object.death();
                }else{
                    player.death();
                }
                
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
            player.body.setRectangle( 26, 27, 3, 6 );
            player.animations.add('left', [1,2,0], 7, true);
            player.animations.add('right', [4,3,5], 7, true);
            player.animations.add('death', [6,7], 3, false);
            player.death = function(){
                this.dead = true;
                this.body.velocity.y = -180;
                this.body.bounce.y = 0.3;
                this.animations.play('death');
                setTimeout( function(){ game.state.start(GameManager.levels[0]) }, 1000 );
            }
            return player;
        }
        this.createLifts = function(){
            var lifts = this.game.add.group();
            var liftsXY = this.getObjectsPositionFromMap( this.map, 'movable', GameManager.lift.tileIndex );
            for( var i in liftsXY ){
                var lift = lifts.create( liftsXY[i].x * this.map.tileWidth, liftsXY[i].y * this.map.tileHeight, 'lift' );
                lift.vx = GameManager.lift.speed;
                lift.body.velocity.x = lift.vx;
                lift.body.collideWorldBounds = true;
                lift.body.immovable = true;
                
                lift.moveLogic = function(){
                    if( this.body.velocity.x == 0 && !this.dead){ 
                        this.vx = - this.vx;
                        this.body.velocity.x = this.vx;
                    }
                }
            }
            return lifts;
        }
        this.createEnemies = function(){
            var enemies = this.game.add.group();
            var enemiesXY = this.getObjectsPositionFromMap( this.map, 'characters', GameManager.enemy.tileIndex );
            for( var i in enemiesXY ){
                var enemy = enemies.create( enemiesXY[i].x * this.map.tileWidth, enemiesXY[i].y * this.map.tileHeight, 'enemy' );
                enemy.vx = GameManager.enemy.speed;
                enemy.body.velocity.x = enemy.vx;
                enemy.body.bounce.y = GameManager.enemy.bounce;
                enemy.body.gravity.y = GameManager.enemy.gravity;
                enemy.body.collideWorldBounds = true;
                enemy.body.setRectangle( 26, 27, 3, 6 );
                enemy.animations.add('death', [6], 5, false);
                enemy.animations.add('left', [1,2,0], 7, true);
                enemy.animations.add('right', [4,3,5], 7, true);
                enemy.animations.play('right');
                enemy.body.immovable = true;
                enemy.frame = 3;
                enemy.death = function(){
                    this.animations.play('death');
                    this.dead = true;
                    this.body.velocity.x = 0;
                }
                
                enemy.moveLogic = function(){
                    if( this.body.velocity.x == 0 && !this.dead){ 
                        this.vx = - this.vx;
                        this.body.velocity.x = this.vx;
                        if( this.vx > 0 ) this.animations.play('right');
                        else this.animations.play('left');
                    }
                }
            }
            return enemies;
        }
    }
}