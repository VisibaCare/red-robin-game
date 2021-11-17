import * as PIXI from "pixi.js"
import { Game } from "./Game"

export interface EnemyBullet {
    x: number
    y: number
    hitboxRadius: number
    destroying: boolean
    onUpdate(game: Game): void
    onCollideWithPlayer(): void
    onDraw(game: Game): void
    onDestroy(game: Game): void
}

abstract class BaseBullet implements EnemyBullet {
    readonly sprite: PIXI.Sprite
    readonly circle: PIXI.Graphics

    x: number
    y: number
    rotation: number
    hitboxRadius: number
    destroying: boolean

    constructor(game: Game) {
        this.sprite = new PIXI.Sprite(game.resources.enemyBulletTexture)
        this.sprite.anchor.set(0.5)
        this.sprite.scale.set(1/16)
        game.stage.addChild(this.sprite)
        this.circle = new PIXI.Graphics()
        game.stage.addChild(this.circle)

        this.x = 0
        this.y = 0
        this.rotation = 0
        this.hitboxRadius = 10
        this.destroying = false
    }

    abstract onUpdate(game: Game): void

    onCollideWithPlayer(): void {
        this.destroying = true
    }

    onDraw(game: Game): void {
        this.sprite.x = this.x
        this.sprite.y = this.y
        this.sprite.rotation = this.rotation - Math.PI / 2

        this.circle.visible = game.debug
        if (this.circle.visible) {
            this.circle.clear()
            this.circle.lineStyle(2, 0xFF0000)
            this.circle.drawCircle(0, 0, this.hitboxRadius)
            this.circle.x = this.x
            this.circle.y = this.y
        }
    }

    onDestroy(game: Game): void {
        game.stage.removeChild(this.sprite)
        this.sprite.destroy()
        game.stage.removeChild(this.circle)
        this.circle.destroy()
    }

    protected destroyIfOutsideScreen(game: Game): void {
        if (this.x < -100 || this.y < -100 || this.x > game.screen.width + 100 || this.y > game.screen.height + 100) {
            this.destroying = true
        }
    }
}

export class Level1Bullet extends BaseBullet {
    vx: number
    vy: number

    constructor(game: Game) {
        super(game)
        this.vx = 0
        this.vy = 0
    }

    onUpdate(game: Game): void {
        this.x += this.vx
        this.y += this.vy
        this.rotation = Math.atan2(this.vy, this.vx)

        this.destroyIfOutsideScreen(game)
    }
}
