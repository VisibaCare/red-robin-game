import * as PIXI from "pixi.js"
import * as PIXIgif from '@pixi/gif';
import { Player } from "./Player"
import { PlayerBullet } from "./PlayerBullet"
import { Enemy } from "./Enemy"
import { EnemyBullet } from "./EnemyBullet";
import { Background } from "./Background";

export interface GameResources {
    playerGif: PIXIgif.AnimatedGIF
    playerBulletTexture: PIXI.Texture
    enemyTexture: PIXI.Texture
    backgroundTexture: PIXI.Texture
}

export class Game {
    time: number
    score: number

    app: PIXI.Application
    player: Player
    background: Background
    enemies: Enemy[]
    resources: GameResources

    pressedKeys: Set<string>

    playerBullets: PlayerBullet[]
    enemyBullets: EnemyBullet[]

    debugElement: HTMLParagraphElement

    constructor(
        app: PIXI.Application,
        resources: GameResources,
    ) {
        this.score = 0
        this.resources = resources
        this.app = app
        this.player = new Player(this)
        this.background = new Background(this, resources.backgroundTexture)
        this.enemies = []
        this.time = 0
        this.pressedKeys = new Set()

        window.addEventListener("keydown", e => {
            this.pressedKeys.add(e.code)
        })
        window.addEventListener("keyup", e => {
            this.pressedKeys.delete(e.code)
        })

        this.playerBullets = []
        this.enemyBullets = []

        this.debugElement = document.createElement("p")
        this.debugElement.style.whiteSpace = "pre"
        document.body.appendChild(this.debugElement)

        this.spawnEnemyBullet(0, 100, 2, 0)
    }

    update(): void {
        this.player.onUpdate(this)
        this.background.update(this)
        for (const playerBullet of this.playerBullets) {
            playerBullet.onUpdate(this)
        }
        for (const enemy of this.enemies) {
            enemy.update(this)
        }
        for (const enemyBullet of this.enemyBullets) {
            enemyBullet.onUpdate(this)
        }

        // check for collisions
        for (const enemy of this.enemies) {

            for (const playerBullet of this.playerBullets) {

                if (this._hasCollided(playerBullet, enemy)) {
                    // collision detected!
                    enemy.onCollideWithPlayerBullet(this)
                    playerBullet.onCollideWithEnemy()
                    console.log('collided');
                }
            }

            if (!enemy.shouldDestroy) {
                if (this._hasCollided(enemy, this.player)) {
                    // collision detected!
                    this.player.onCollideWithEnemy()
                    console.log('player collided');
                }
            }
        }

        if (this.time % 30 === 0) {
            this._spawnEnemy()
        }

        // Remove all destroyed player bullets
        for (let i = 0; i < this.playerBullets.length; i++) {
            const playerBullet = this.playerBullets[i]!
            if (playerBullet.shouldDestroy) {
                playerBullet.onDestroy(this)
                this.playerBullets.splice(i, 1)
            }
        }
        // Enemies
        for (let i = 0; i < this.enemies.length; i++) {
            const enemy = this.enemies[i]!
            if (enemy.shouldDestroy) {
                enemy.onDestroy(this)
                this.enemies.splice(i, 1)
            }
        }
        // Enemy bullets
        for (let i = 0; i < this.enemyBullets.length; i++) {
            const enemyBullet = this.enemyBullets[i]!
            if (enemyBullet.shouldDestroy) {
                enemyBullet.onDestroy(this)
                this.enemyBullets.splice(i, 1)
            }
        }

        this.time++

        this.debugElement.textContent = `
Player bullet count: ${this.playerBullets.length}
Score: ${this.score}
HP: ${this.player.hp}
Invulnerable: ${this.player.invulnerableAfterDamageCooldown > 0} 
`
    }

    spawnPlayerBullet(x: number, y: number): void {
        const bullet = new PlayerBullet(this)
        bullet.x = x
        bullet.y = y
        bullet.vx = 10
        this.playerBullets.push(bullet)
    }

    spawnEnemyBullet(x: number, y: number, vx: number, vy: number): void {
        const bullet = new EnemyBullet(this)
        bullet.x = x
        bullet.y = y
        bullet.vx = vx
        bullet.vy = vy
        this.enemyBullets.push(bullet)
    }

    draw(): void {
        this.player.onDraw()
        for (const playerBullet of this.playerBullets) {
            playerBullet.onDraw()
        }
        for (const enemy of this.enemies) {
            enemy.onDraw()
        }
        for (const enemyBullet of this.enemyBullets) {
            enemyBullet.onDraw()
        }
    }

    private _spawnEnemy(): void {
        const x = this.app.screen.width
        const y = (this.app.screen.height * 0.8) * Math.random() + this.app.screen.height * 0.1
        const vx = -(1 + Math.random() * 9)
        const vy = Math.random() * 4 - 2
        const enemy = new Enemy(this, this.resources.enemyTexture)
        this.enemies.push(enemy)
        enemy.x = x
        enemy.y = y
        enemy.vx = vx
        enemy.vy = vy
        enemy.sprite.x = enemy.x
        enemy.sprite.y = enemy.y
        enemy.circle.x = enemy.x
        enemy.circle.y = enemy.y
        console.log(enemy)
    }

    private _hasCollided(first: { x: number, y: number, hitboxRadius: number }, second: { x: number, y: number, hitboxRadius: number }): boolean {

        var dx = (first.x + first.hitboxRadius) - (second.x + second.hitboxRadius);
        var dy = (first.y + first.hitboxRadius) - (second.y + second.hitboxRadius);
        var distance = Math.sqrt(dx * dx + dy * dy);

        return distance < first.hitboxRadius + second.hitboxRadius;
    }
}

