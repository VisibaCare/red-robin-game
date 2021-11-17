import * as PIXI from "pixi.js"
import { Level1Bullet } from "./EnemyBullet"
import { Game } from "./Game"

export interface Enemy {
    x: number
    y: number
    hitboxRadius: number
    destroying: boolean
    onUpdate(game: Game): void
    onCollideWithPlayerBullet(game: Game): void
    onDraw(game: Game): void
    onDestroy(game: Game): void
}

abstract class BaseEnemy implements Enemy {
    readonly sprite: PIXI.Sprite
    readonly circle: PIXI.Graphics

    x: number
    y: number
    rotation: number
    hitboxRadius: number
    destroying: boolean
    hp: number
    maxHp: number
    scoreValue: number

    constructor(game: Game) {
        this.sprite = new PIXI.Sprite(game.resources.enemyTexture)
        this.sprite.anchor.set(0.5)
        this.sprite.scale.set(1/8)
        game.stage.addChild(this.sprite)
        this.circle = new PIXI.Graphics()
        game.stage.addChild(this.circle)

        this.x = 0
        this.y = 0
        this.rotation = 0
        this.hitboxRadius = 25
        this.hp = 3
        this.maxHp = 3
        this.scoreValue = 1000
        this.destroying = false
    }

    abstract onUpdate(game: Game): void

    onCollideWithPlayerBullet(game: Game): void {
        if (this.hp > 0) {
            this.hp--
        }
        if (this.hp <= 0) {
            game.score += 1000
            this.destroying = true
        }
    }

    onDraw(game: Game): void {
        this.sprite.x = this.x
        this.sprite.y = this.y
        this.sprite.rotation = this.rotation + Math.PI / 4

        this.circle.visible = game.debug
        if (this.circle.visible) {
            this.circle.clear()
            this.circle.lineStyle(2, 0xFF0000)
            this.circle.drawCircle(0, 0, this.hitboxRadius)
            this.circle.x = this.x
            this.circle.y = this.y
        }

        const colorFactor = this.hp / this.maxHp
        this.sprite.tint = PIXI.utils.rgb2hex([1, colorFactor, colorFactor])
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

export class SimpleShootingEnemy extends BaseEnemy {
    vx: number
    vy: number
    shotTimer: number

    constructor(game: Game) {
        super(game)
        this.vx = 0
        this.vy = 0
        this.shotTimer = 0
    }

    onUpdate(game: Game): void {
        // Movement
        this.x += this.vx
        this.y += this.vy
        this.rotation = Math.atan2(this.vy, this.vx)

        if (this.shotTimer > 0) {
            this.shotTimer--
        }
        if (this.shotTimer <= 0) {
            const bullet = new Level1Bullet(game)
            bullet.x = this.x
            bullet.y = this.y
            bullet.vx = this.vx * 1.5
            bullet.vy = this.vy * 1.5
            game.addEnemyBullet(bullet)
            this.shotTimer = 100
        }

        this.destroyIfOutsideScreen(game)
    }
}
