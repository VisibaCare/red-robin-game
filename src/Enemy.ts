import * as PIXI from "pixi.js"
import { Game } from "./Game"

export class Enemy {
    sprite: PIXI.Sprite
    hitboxRadius: number
    x: number
    y: number
    circle: PIXI.Graphics
    shouldDestroy: boolean
    vx: number
    vy: number
    hp: number
    shotTimer: number

    constructor(
        game: Game,
        texture: PIXI.Texture,
    ) {
        this.sprite = new PIXI.Sprite(texture)
        this.sprite.anchor.set(0.5)
        this.sprite.angle = -135
        this.sprite.scale.set(0.125)
        game.app.stage.addChild(this.sprite)
        this.hitboxRadius = 25
        this.x = 0
        this.y = 0
        this.shouldDestroy = false
        this.vx = 0
        this.vy = 0
        this.hp = 3
        this.shotTimer = 20

        const gr = new PIXI.Graphics();
        gr.lineStyle(2, 0xFF0000);
        gr.drawCircle(0, 0, this.hitboxRadius);

        this.circle = gr;
        game.app.stage.addChild(gr)
    }

    update(game: Game): void {
        this.x += this.vx
        this.y += this.vy
        if (this.shotTimer > 0) {
            this.shotTimer -= 1
        }
        if (this.shotTimer === 0) {
            game.spawnEnemyBullet(this.x, this.y, this.vx - 2, 0)
            this.shotTimer = 100
        }
        
        if (this.x < 0 || this.y < 0 || this.x >= game.app.screen.width || this.y >= game.app.screen.height) {
            this.shouldDestroy = true
        }
    }

    onCollideWithPlayerBullet(game: Game): void {
        this.hp -= 1
        if (this.hp === 0) {
            game.score += 1000
            this.shouldDestroy = true;
        }
    }

    onDraw(): void {
        this.circle.x = this.x;
        this.circle.y = this.y;

        this.sprite.x = this.x
        this.sprite.y = this.y

        // TODO: make this look good
        this.sprite.tint = this.hp === 3
            ? 0xFFFFFF
            : this.hp === 2
            ? 0xFF9999
            : this.hp === 1
            ? 0xFF6666
            : 0xFF0000
    }

    onDestroy(game: Game): void {
        game.app.stage.removeChild(this.sprite)
        game.app.stage.removeChild(this.circle)

        this.sprite.destroy()
        this.circle.destroy()
    }
}