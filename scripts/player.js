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
        console.log(this.marker);
        this.setSize(26, 47).setOffset(35, 50);
        this.setCollideWorldBounds(true);

        this.attackcd = 0;
        this.direction = 1;
        this.airtime = 999;
        
        this.health = 100;


        this.bullets = scene.physics.add.staticGroup();

    }
    
    move(controls){
        this.attackcd --;
        this.airtime ++;
        if (this.body.touching.down) {
            this.airtime = 0;
        }
        
        //p1 move
        if (this.attackcd < 10) {
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
            if (controls.up.isDown && this.airtime < 10) {
                this.setVelocityY(-300);
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
        if (controls.attack.isDown && this.attackcd < 0) {
            this.attackcd = 20;
            // summon sword hb
            this.scene.time.addEvent({
                delay: 250,
                callback: () => {
                    let attackhb = this.scene.add.rectangle(this.x + this.direction * 20, this.y+10, 35, 40, 0xff0000,0.1)
                    attackhb.damage = 40;
                    this.bullets.add(attackhb);
                    this.scene.time.addEvent({
                        delay: 4,
                        callback: () => {
                            this.bullets.remove(attackhb, true, true);
                        },
                        callbackScope: this
                    });
                }
            })
            this.anims.play("attack");
        }
    }
    
    damageCallback(other){
        return (self,attackhb) => {
            this.takeDamage(attackhb.damage)
            other.bullets.remove(attackhb,true,true)
            
            if (this.number = 1) {
                this.scene.p1Health.text = "P1 HP " + this.health.toString() + "/100"
                this.scene.p2Health.text = "P2 HP " + other.health.toString() + "/100"
            } else {
                this.scene.p2Health.text = "P2 HP " + this.health.toString() + "/100"
                this.scene.p1Health.text = "P1 HP " + other.health.toString() + "/100"
            }
        }
    }


    takeDamage(damage){
        this.health -= damage
        if (this.health <= 0) {
            // wow so cool
            document.write(this.name + " LOST GG")
        }
    }
}