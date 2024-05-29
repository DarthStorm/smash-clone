class Bullet extends Phaser.Physics.Arcade.Sprite {
    // if i decide to use matter.js someday change this
    constructor(scene, x, y, texture, type = "", owner = new Player()) {
        super(scene, x, y, texture);
        this.type=type;
        this.owner = owner;
        this.direction = this.owner.direction
        this.scene = scene;
        this.speed = 300;
        this.damage = 5;

        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);

        this.anims.play("bullet");
    }

    update(){
        this.setVelocityX(this.speed * this.direction);
        if (Math.sign(this.direction) == -1) {
            this.setFlipX(true);    
        }
        this.setVelocityY(-20)
        
        this.anims.play("bullet")
    }
}
