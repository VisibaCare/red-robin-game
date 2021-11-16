import * as PIXI from "pixi.js"
import { Game } from "./Game"

export class PlayerBullet {
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
        this.sprite.anchor.set(0.5)
        this.sprite.angle = -45
        this.sprite.scale.set(1 / 16)
        game.stage.addChild(this.sprite)

        this.x = 0
        this.y = 0
        this.vx = 0
        this.vy = 0
        this.hitboxRadius = 10
        this.shouldDestroy = false

        this.circle = new PIXI.Graphics()
        this.circle.lineStyle(2, 0xFF0000)
        this.circle.drawCircle(0, 0, this.hitboxRadius)
        game.stage.addChild(this.circle)
        this.circle.visible = game.isDebug
    }

    onUpdate(game: Game): void {
        // Movement
        this.x += this.vx
        this.y += this.vy

        if (this.x < -100 || this.y < -100 || this.x >= game.screen.width + 100 || this.y >= game.screen.height + 100) {
            this.shouldDestroy = true
        }
    }

    onCollideWithEnemy(): void {
        this.shouldDestroy = true
    }

    onDraw(): void {
        this.sprite.x = this.x
        this.sprite.y = this.y
        this.circle.x = this.x
        this.circle.y = this.y
    }

    onDestroy(game: Game): void {
        game.stage.removeChild(this.sprite)
        game.stage.removeChild(this.circle)
    }
}
