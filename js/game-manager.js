var GameManager = {
    player: {
        bounce: 0.01,
        gravity: 1000,
        speed: 120,
        jump: 390,
        tileIndex: 9,
        enemyHit: 40
    },
    enemy: {
        bounce: 0.1,
        gravity: 1000,
        speed: 50,
        tileIndex: 10,
    },
    width: 480,
    height: 320,
    levels: [ 'level3' ],
    currentLevel: 0,
    nextLevel: function(){
        this.currentLevel++;
        return ( this.currentLevel < this.levels.length ) ? this.levels[ this.currentLevel ] : "end";
    }
};


