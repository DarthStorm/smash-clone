/*
Player 1: move with UpDownLeftRight, atk = J,K,L
Player 2: move with WASD, atk = F,G,H



*/ 


class Player extends Phaser.Physics.Arcade.Sprite {
    // if i decide to use matter.js someday change this
    constructor(scene, x, y, texture, name = "", number = 0) {
        super(scene, x, y, texture);
        this.name = name
        this.number = number
        this.scene = scene
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);

        this.marker = scene.add.text(this.x,this.y-60, this.name, {fontFamily:"Impact,monospace"})
        this.markerYOffset = this.marker
        this.setSize(26, 47).setOffset(35, 50);
        this.setCollideWorldBounds(true);

        this.attack1cd = 0;
        this.attack2cd = 0;
        this.attack3cd = 0;
        this.direction = 1;
        this.airtime = 999;
        this.jumpCount = 0;
        this.canDoubleJump = false;
        this.maxjumps = 2; // can change to 3
        this.jumping = 0;
        
        this.health = 100;


        this.projectiles = scene.physics.add.group();
        this.melee = scene.physics.add.group();


        console.log(this)
    }
    
    move(controls){
        this.attack1cd --;
        this.attack2cd --;
        this.attack3cd --;
        this.airtime ++;
        if (this.body.onFloor()) {
            this.airtime = 0;

            this.canDoubleJump = false;
        }

        if (this.airtime < 10) {
            this.jumpCount = 0;
        }
        
        //p1 move
        if (this.attack1cd < 10) {
            if (controls.left.isDown) {
                this.setVelocityX(-200);
                this.direction = -1
                this.setFlipX(true);
                this.anims.play("walk", true);
            } else if (controls.right.isDown) {
                this.setVelocityX(200);
                this.direction = 1
                this.setFlipX(false);
                this.anims.play("walk", true);
            } else {
                this.setVelocityX(0);
                this.anims.play("idle", true);
            }
            if (controls.up.isDown) {
                this.jumping++;
                console.log(this.jumping);
                if (this.jumping == 1){
                    // jumping
                    this.airtime = 30; //larger than threshold, 10

                    if (this.jumpCount == 0) {
                        // initial jump
                        this.setVelocityY(-500); 
                        this.jumpCount++;
                        console.log("jump 1");
                    } else if (this.jumpCount == 1 && !this.canDoubleJump) {
                        // double jump
                        this.setVelocityY(-500);
                        this.jumpCount++;
                        this.canDoubleJump = true;
                        console.log("jump 2");
                    }
                }
            } else {
                this.jumping = 0;
            }
        } else {
            if (this.airtime < 10) {
                this.setVelocityX(50 * this.direction)
            } else {
                this.setVelocityX(200 * this.direction)
            }
        }

        this.marker.x = this.x
        this.marker.y = this.y - 60
    }

    attack(controls){
        if (controls.attack1.isDown && this.attack1cd < 0) {
            this.attack1cd = 20;
            // summon sword hb
            this.scene.time.addEvent({
                delay: 250,
                callback: () => {
                    let attackhb = this.scene.add.rectangle(this.x + this.direction * 20, this.y+10, 35, 40, 0xff0000,0.1)
                    attackhb.damage = 20;
                    this.melee.add(attackhb);
                    this.scene.time.addEvent({
                        delay: 1,
                        callback: () => {
                            this.melee.remove(attackhb, true, true);
                        },
                        callbackScope: this
                    });
                }
            })


            this.anims.play("attack");
        } else if (controls.attack2.isDown && this.attack2cd < 0) {
            this.attack2cd = 30;
            // summon sword hb
            let bullet = new Bullet(this.scene,this.x + this.direction * 20, this.y+10, TEXTURES.bullets.bullet,"playerbullet",this)
            this.projectiles.add(bullet)
        }
        if (controls.attack3.isDown) {
            console.log(this);
        }
    }
    
    damageCallback(other){
        return (self,attack) => {
            console.log("owo");
            this.takeDamage(attack.damage)
            attack.destroy();
            
            if (this.number == 1) {
                this.scene.p1Health.text = "P1 HP " + this.health.toString() + "/100"
            } else {
                this.scene.p2Health.text = "P2 HP " + this.health.toString() + "/100"
            }

        }
    }


    takeDamage(damage){
        this.health -= damage
        if (this.health <= 0) {
            // wow so cool
            document.write(this.name + " LOST GG")
            [1,2,3][5]
        }
    }
}