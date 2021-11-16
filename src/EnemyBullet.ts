import * as PIXI from "pixi.js"
import { Game } from "./Game"

export class EnemyBullet {
    readonly sprite: PIXI.Sprite
    readonly circle: PIXI.Graphics

    x: number
    y: number
    vx: number
    vy: number
    readonly hitboxRadius: number
    
    shouldDestroy: boolean

    constructor(game: Game) {
        this.sprite = new PIXI.Sprite(game.resources.playerBulletTexture)
        this.sprite.tint = 0x00FFFF
        this.sprite.anchor.set(0.5)
        this.sprite.angle = 90
        this.sprite.scale.set(1 / 16)
        game.app.stage.addChild(this.sprite)

        this.x = 0
        this.y = 0
        this.vx = 0
        this.vy = 0
        this.hitboxRadius = 10
        this.shouldDestroy = false

        this.circle = new PIXI.Graphics()
        this.circle.lineStyle(2, 0xFF0000)
        this.circle.drawCircle(0, 0, this.hitboxRadius)
        game.app.stage.addChild(this.circle)
    }

    onUpdate(game: Game): void {
        // Movement
        this.x += this.vx
        this.y += this.vy

        if (this.x < 0 || this.y < 0 || this.x >= game.app.screen.width || this.y >= game.app.screen.height) {
            this.shouldDestroy = true
        }
    }

    onCollideWithPlayer(): void {
        this.shouldDestroy = true
    }

    onDraw(): void {
        this.sprite.x = this.x
        this.sprite.y = this.y
        this.circle.x = this.x
        this.circle.y = this.y
    }

    onDestroy(game: Game): void {
        game.app.stage.removeChild(this.sprite)
        game.app.stage.removeChild(this.circle)
    }
}
