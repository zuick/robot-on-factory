var game = new Phaser.Game(640, 320, Phaser.CANVAS, '', { preload: preload, create: create, update: update, render: render });

function preload() {
    
    game.load.spritesheet('hero', 'assets/hero.png', 16, 16);
    game.load.tilemap('level', 'assets/random.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.tileset('ground', 'assets/tileset.png', 16, 16);
}

function create() {
    

    map = game.add.tilemap('level');
    gr = game.add.tileset('ground');
    gr.setCollision( 2, true, true, true, true );
    gr.setCollision( 3, true, true, true, true );
    layer1 = game.add.tilemapLayer(0, 0, 320, 160, gr, map, 0);
    //game.world.setBounds(0, 0, 480, 320);
    
    player = game.add.sprite(0, 0, 'hero');
    
    player.body.bounce.y = 0;
    player.body.gravity.y = 9;
    player.body.collideWorldBounds = true;
  
    player.animations.add('left', [0, 1], 7, true);
    player.animations.add('right', [3, 4], 7, true);
    player.body.setSize(8, 16,7 ,2);
    
    cursors = game.input.keyboard.createCursorKeys();
    
    Phaser.Canvas.setSmoothingEnabled(game.context, false);
    
   
    layer1.scale.setTo(2,2);
    player.scale.setTo(2,2);
    
    //game.camera.follow( player );
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
    game.debug.renderSpriteBody(player);

}

