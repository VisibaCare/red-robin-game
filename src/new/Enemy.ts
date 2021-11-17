import * as PIXI from "pixi.js"
import { StraightMovingBullet } from "./EnemyBullet"
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
        this.hp = 5
        this.maxHp = 5
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
            const bullet = new StraightMovingBullet(game)
            bullet.x = this.x
            bullet.y = this.y
            const v = Math.sqrt(this.vx ** 2 + this.vy ** 2)
            bullet.vx = (2 + v) * Math.cos(this.rotation)
            bullet.vy = (2 + v) * Math.sin(this.rotation)
            game.addEnemyBullet(bullet)
            this.shotTimer = 100
        }

        this.destroyIfOutsideScreen(game)
    }
}

export class AimingShootingEnemy extends BaseEnemy {
    sourceX: number
    sourceY: number
    targetX: number
    targetY: number
    movementT: number
    movementMaxT: number
    shotTimer: number

    constructor(game: Game) {
        super(game)
        this.sourceX = 0
        this.sourceY = 0
        this.targetX = 0
        this.targetY = 0
        this.movementT = 0
        this.movementMaxT = 120
        this.shotTimer = 0
        this.maxHp = 3
        this.hp = 3
    }

    onUpdate(game: Game): void {
        // Movement
        this.x = easeOutCubic(this.sourceX, this.targetX, this.movementT / this.movementMaxT)
        this.y = easeOutCubic(this.sourceY, this.targetY, this.movementT / this.movementMaxT)
        console.log(this)
        if (game.player != undefined) {
            this.rotation = Math.atan2(game.player.y - this.y, game.player.x - this.x)
        }

        if (this.shotTimer > 0) {
            this.shotTimer--
        }
        if (this.shotTimer <= 0) {
            this.spawnBullets(game)
            this.resetShotTimer()
        }
        if (this.movementT < this.movementMaxT) {
            this.movementT++
        }

        this.destroyIfOutsideScreen(game)
    }

    spawnBullets(game: Game): void {
        const bullet = new StraightMovingBullet(game)
        bullet.x = this.x
        bullet.y = this.y
        bullet.vx = (4) * Math.cos(this.rotation)
        bullet.vy = (4) * Math.sin(this.rotation)
        game.addEnemyBullet(bullet)
    }

    resetShotTimer(): void {
        this.shotTimer = 50
    }
}

export class AimingShotgunEnemy extends AimingShootingEnemy {
    override spawnBullets(game: Game): void {
        console.log("spawn")
        for (let i = 0; i < 3; i++) {
            const bullet = new StraightMovingBullet(game)
            bullet.x = this.x
            bullet.y = this.y
            const direction = this.rotation + 0.4 * (1 - i)
            bullet.vx = (4) * Math.cos(direction)
            bullet.vy = (4) * Math.sin(direction)
            game.addEnemyBullet(bullet)
        }
    }

    override resetShotTimer(): void {
        this.shotTimer = 100
    }
}

function easeOutCubic(a: number, b: number, t: number): number {
    const u = 1 - Math.pow(1 - t, 3)

    return (1 - u) * a + u * b
}
