class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    preload() {
        this.load.image("sky", "assets/sky.png");
        this.load.image("platform", "assets/platform.png");
        this.load.spritesheet(TEXTURES.players.warrior.walk, "assets/players/warrior/Run.png", {
            frameWidth: 96,
            frameHeight: 96
        })
        this.load.spritesheet(TEXTURES.players.warrior.idle, "assets/players/warrior/Idle.png", {
            frameWidth: 96,
            frameHeight: 96
        })
        this.load.spritesheet(TEXTURES.players.warrior.attack, "assets/players/warrior/Attack_1.png", {
            frameWidth: 96,
            frameHeight: 96
        })
    }

    create() {
        this.add.image(WIDTH / 2, HEIGHT / 2, "sky");

        this.platforms = this.physics.add.staticGroup();
        this.platforms.create(WIDTH / 2, HEIGHT * 2 / 3, "platform")

        // p1
        this.p1 = new Player(this,WIDTH/2,HEIGHT/2,TEXTURES.players.warrior.idle,"xX_ATP_Xx",1)
        this.p2 = new Player(this,WIDTH/2,HEIGHT/2,TEXTURES.players.warrior.idle,"DarthStorm",2)

        this.physics.add.collider(this.p1, this.platforms);
        this.physics.add.collider(this.p2, this.platforms);
        this.physics.add.collider(this.p1, this.p2.bullets,this.p1.damageCallback(this.p2));
        this.physics.add.collider(this.p2, this.p1.bullets,this.p2.damageCallback(this.p1));

        // animation
        this.anims.create({
            key: "walk",
            frames: this.anims.generateFrameNumbers(TEXTURES.players.warrior.walk, {
                start: 0,
                end: 5
            }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: "idle",
            frames: this.anims.generateFrameNumbers(TEXTURES.players.warrior.idle, {
                start: 0,
                end: 5
            }),
            frameRate: 6
        });

        this.anims.create({
            key: "attack",
            frames: this.anims.generateFrameNumbers(TEXTURES.players.warrior.attack, {
                start: 0,
                end: 3
            }),
            frameRate: 10,
            repeat: 1
        });

        // controls
        this.controls = {
            p1: this.input.keyboard.addKeys({ up: "up", left: "left", down: "down", right: "right", attack: "L"}),
            p2: this.input.keyboard.addKeys({ up: "W", left: "A", down: "S", right: "D", attack: "F"})
        };

        // UI ELEMENTS
        this.p1Health = this.add.text(30, HEIGHT-36, 'P1 HP 100/100', { fontFamily: 'Impact, monospace', fontSize:30});
        this.p2Health = this.add.text(WIDTH - 202, HEIGHT-36, 'P2 HP 100/100', { fontFamily: 'Impact, monospace', fontSize:30});
        this.p2Health.x = WIDTH - this.p2Health.width - 30
        
    }

    update() {
        this.p1.move(this.controls.p1)
        this.p2.move(this.controls.p2)
        this.p1.attack(this.controls.p1)
        this.p2.attack(this.controls.p2)
    }

    updateText(){

    }
}