import * as PIXI from "pixi.js"
import * as PIXIgif from '@pixi/gif';
import { Game } from "./Game"

export class Player {
    readonly sprite: PIXIgif.AnimatedGIF
    readonly circle: PIXI.Graphics

    x: number
    y: number
    readonly hitboxRadius: number
    shotCooldown: number
    invulnerableAfterDamageCooldown: number
    hp: number

    constructor(game: Game) {
        this.sprite = game.resources.playerGif
        this.sprite.anchor.set(0.5, 0.6)
        this.sprite.scale.set(0.25)
        this.sprite.visible = true
        game.stage.addChild(this.sprite)
        this.x = 50
        this.y = game.screen.height / 2
        this.hitboxRadius = 10
        this.shotCooldown = 0
        this.invulnerableAfterDamageCooldown = 0
        this.hp = 3

        this.circle = new PIXI.Graphics()
        this.circle.lineStyle(2, 0xFF0000)
        this.circle.drawCircle(0, 0, this.hitboxRadius)
        game.stage.addChild(this.circle)
        this.circle.visible = game.isDebug
    }

    onUpdate(game: Game): void {
        // Movement
        const inputX = (game.pressedKeys.has("ArrowLeft") ? -1 : 0) + (game.pressedKeys.has("ArrowRight") ? 1 : 0)
        const inputY = (game.pressedKeys.has("ArrowUp") ? -1 : 0) + (game.pressedKeys.has("ArrowDown") ? 1 : 0)

        const velocity = game.pressedKeys.has("ShiftLeft") ? 3 : 6
        const diagonalFactor = 0.7071067811865476
        let vx: number
        let vy: number
        if (inputX < 0) {
            if (inputY < 0) {
                vx = -velocity * diagonalFactor
                vy = -velocity * diagonalFactor
            } else if (inputY > 0) {
                vx = -velocity * diagonalFactor
                vy = velocity * diagonalFactor
            } else {
                vx = -velocity
                vy = 0
            }
        } else if (inputX > 0) {
            if (inputY < 0) {
                vx = velocity * diagonalFactor
                vy = -velocity * diagonalFactor
            } else if (inputY > 0) {
                vx = velocity * diagonalFactor
                vy = velocity * diagonalFactor
            } else {
                vx = velocity
                vy = 0
            }
        } else {
            if (inputY < 0) {
                vx = 0
                vy = -velocity
            } else if (inputY > 0) {
                vx = 0
                vy = velocity
            } else {
                vx = 0
                vy = 0
            }
        }

        this.x = Math.min(Math.max(this.x + vx, 10), game.screen.width - 11)
        this.y = Math.min(Math.max(this.y + vy, 10), game.screen.height - 11)

        // Shooting
        if (this.shotCooldown > 0) {
            this.shotCooldown--
        }
        if (this.shotCooldown === 0 && (game.pressedKeys.has("KeyZ") || game.pressedKeys.has("Space"))) {
            game.spawnPlayerBullet(this.x, this.y)
            game.playSound(game.resources.laserSound, 0.25)
            this.shotCooldown = 10
        }

        if (this.invulnerableAfterDamageCooldown > 0) {
            this.invulnerableAfterDamageCooldown--;
        }
    }

    onCollideWithEnemy(game: Game): void {
        if (this.invulnerableAfterDamageCooldown === 0) {

            game.playSound(game.resources.explosion, 0.25)
            this.hp -= 1;

            if (this.hp === 0) {
                game.gameOver = true;
            }

            this.invulnerableAfterDamageCooldown = 100;
        }
    }

    onDraw(): void {
        this.sprite.x = this.x
        this.sprite.y = this.y
        this.circle.x = this.x
        this.circle.y = this.y

        this.sprite.visible = Math.floor(this.invulnerableAfterDamageCooldown / 4) % 2 == 0;
    }

    onDestroy(game: Game): void {
        game.stage.removeChild(this.sprite)
        game.stage.removeChild(this.circle)
    }
}
