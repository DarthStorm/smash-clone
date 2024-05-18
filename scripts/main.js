// code
let config = {
    type: Phaser.AUTO,
    width: WIDTH,
    height: HEIGHT,
    scene: [GameScene],
    physics: {
        default: "arcade",
        arcade: {
            gravity: {
                y: 1400,
            },
            debug: true,
        }
    },
};

let game = new Phaser.Game(config);