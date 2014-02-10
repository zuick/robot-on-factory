var game = new Phaser.Game(160, 160, Phaser.CANVAS, '', { preload: preload, create: create, update: update, render: render }, null, false, false);

function preload() {
    
    game.load.spritesheet('hero', 'assets/hero.png', 16, 16);
    game.load.tilemap('level1', 'assets/level1.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.tilemap('level2', 'assets/level2.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.tileset('tileset', 'assets/tileset.png', 16, 16);
}

function create() {
    

    map = game.add.tilemap('level2');
    tileset = game.add.tileset('tileset');
    tileset.setCollision( 4, true, true, true, true );
    tileset.setCollision( 5, true, true, true, true );
    layer1 = game.add.tilemapLayer(0, 0, 160, 160, tileset, map, 0);
    layer1.resizeWorld();
    
    
    heroXY = getObjectsPositionFromMap( map, 'characters', 9 )[0];
    player = game.add.sprite( heroXY.x * tileset.tileWidth, heroXY.y * tileset.tileHeight, 'hero');
    
    player.body.bounce.y = 0;
    player.body.gravity.y = 18;
    player.body.collideWorldBounds = true;
  
    player.animations.add('left', [0, 1], 7, true);
    player.animations.add('right', [3, 4], 7, true);
    player.body.setSize(8, 16, 7 ,2);
    
    cursors = game.input.keyboard.createCursorKeys();

    game.camera.follow( player );
}

function update() {
    game.physics.collide(player, layer1);
    
    //  Reset the players velocity (movement)
    player.body.velocity.x = 0;
 
    if (cursors.left.isDown)
    {
        //  Move to the left
        player.body.velocity.x = -100;
        
        player.animations.play('left');
    }
    else if (cursors.right.isDown)
    {
        //  Move to the right
        player.body.velocity.x = 100;
        //game.camera.x +=5;
        player.animations.play('right');
    }
    else
    {
        //  Stand still
        player.animations.stop();
 
        player.frame = 4;
    }
 
    //  Allow the player to jump if they are touching the ground.
    if (cursors.up.isDown && player.body.touching.down)
    {
        player.body.velocity.y = -350;
    }
    
}

function render(){
    //game.debug.renderCameraInfo(game.camera, 0, 32);
}

function getObjectsPositionFromMap( map, layerName, tileIndex ){
    var result = [];
    // find layer
    for( var i in map.layers ){
        var layer = map.layers[i];
        if( layer.name == layerName ){
            // find objects
            for( var k in layer.data ){
                for( var l in layer.data ){
                    if( layer.data[k][l] == tileIndex ){
                        result.push({x: l , y: k });
                    }         
                }
            }
            break;
        }
    }
    
    return result;
}