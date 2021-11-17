import * as PIXI from "pixi.js"
import * as PIXIgif from '@pixi/gif'
import { Game } from "./Game"
import { PlayerBullet } from "./PlayerBullet"

export class Player {
    readonly sprite: PIXIgif.AnimatedGIF
    readonly circle: PIXI.Graphics

    x: number
    y: number
    hitboxRadius: number
    
    shotCooldown: number
    invulnerableCooldown: number

    hp: number
    maxHp: number
    
    constructor(game: Game) {
        this.sprite = game.resources.playerGif
        this.sprite.anchor.set(0.5, 0.6)
        this.sprite.scale.set(0.25)
        this.sprite.visible = true
        game.stage.addChild(this.sprite)
        this.circle = new PIXI.Graphics()
        game.stage.addChild(this.circle)

        this.x = game.screen.width / 8
        this.y = game.screen.height / 2
        this.hitboxRadius = 10
        this.shotCooldown = 0
        this.invulnerableCooldown = 0
        this.hp = 3
        this.maxHp = 3
    }

    onUpdate(game: Game): void {
        // Movement
        const inputSumX = (game.pressedKeys.has("ArrowLeft") ? -1 : 0) + (game.pressedKeys.has("ArrowRight") ? 1 : 0)
        const inputSumY = (game.pressedKeys.has("ArrowUp") ? -1 : 0) + (game.pressedKeys.has("ArrowDown") ? 1 : 0)
        const baseVelocity = game.pressedKeys.has("ShiftLeft") ? 3 : 6 // Move slower if you hold down shift
        const diagonalFactor = 1 / Math.sqrt(2)
        let vx: number
        let vy: number
        if (inputSumX < 0) {
            if (inputSumY < 0) {
                vx = -baseVelocity * diagonalFactor
                vy = -baseVelocity * diagonalFactor
            } else if (inputSumY > 0) {
                vx = -baseVelocity * diagonalFactor
                vy = baseVelocity * diagonalFactor
            } else {
                vx = -baseVelocity
                vy = 0
            }
        } else if (inputSumX > 0) {
            if (inputSumY < 0) {
                vx = baseVelocity * diagonalFactor
                vy = -baseVelocity * diagonalFactor
            } else if (inputSumY > 0) {
                vx = baseVelocity * diagonalFactor
                vy = baseVelocity * diagonalFactor
            } else {
                vx = baseVelocity
                vy = 0
            }
        } else {
            if (inputSumY < 0) {
                vx = 0
                vy = -baseVelocity
            } else if (inputSumY > 0) {
                vx = 0
                vy = baseVelocity
            } else {
                vx = 0
                vy = 0
            }
        }
        this.x = Math.min(Math.max(this.x + vx, 10), game.screen.width - 10)
        this.y = Math.min(Math.max(this.y + vy, 10), game.screen.height - 10)

        // Shooting
        if (this.shotCooldown > 0) {
            this.shotCooldown--
        }
        if (this.shotCooldown <= 0 && (game.pressedKeys.has("KeyZ") || game.pressedKeys.has("Space"))) {
            const bullet = new PlayerBullet(game)
            bullet.x = this.x
            bullet.y = this.y
            bullet.vx = 10
            bullet.vy = 0
            game.addPlayerBullet(bullet)
            game.playSound(game.resources.laserSound, 0.25)
            this.shotCooldown = 10
        }

        // Invulnerability
        if (this.invulnerableCooldown > 0) {
            this.invulnerableCooldown--;
        }
    }

    onCollideWithEnemyOrEnemyBullet(game: Game): void {
        if (this.invulnerableCooldown <= 0) {
            game.playSound(game.resources.explosion, 0.25)

            if (this.hp > 0) {
                this.hp--
            }
            if (this.hp <= 0) {
                game.end()

                return
            }

            this.invulnerableCooldown = 100
        }
    }

    onDraw(game: Game): void {
        this.sprite.x = this.x
        this.sprite.y = this.y
        // Invulnerability flashing
        this.sprite.visible = Math.floor(this.invulnerableCooldown / 4) % 2 === 0;

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
        // The sprite is shared; don't destroy it!
        game.stage.removeChild(this.circle)
        this.circle.destroy()
    }
}
