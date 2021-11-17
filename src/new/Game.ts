import * as PIXI from "pixi.js"
import { PlayerBullet } from "./PlayerBullet"
import { Background } from "./Background"
import { GameResources } from "./GameResources"
import { Player } from "./Player"
import { Enemy, Level1Enemy } from "./Enemy"
import { EnemyBullet } from "./EnemyBullet"

export class Game {
    readonly stage: PIXI.Container
    readonly screen: PIXI.Rectangle
    readonly resources: GameResources
    readonly audioContext: AudioContext

    readonly pressedKeys: Set<string>
    debug: boolean
    playing: boolean

    background?: Background
    player?: Player
    playerBullets: PlayerBullet[]
    enemies: Enemy[]
    enemyBullets: EnemyBullet[]

    time: number
    score: number

    private readonly _keydownCallback: (e: KeyboardEvent) => void
    private readonly _keyupCallback: (e: KeyboardEvent) => void

    constructor(
        stage: PIXI.Container,
        screen: PIXI.Rectangle,
        resources: GameResources,
        audioContext: AudioContext,
    ) {
        this.stage = stage
        this.screen = screen
        this.resources = resources

        this.audioContext = audioContext
        this.pressedKeys = new Set()

        this.debug = false
        this.playing = false

        this.background = undefined
        this.player = undefined
        this.playerBullets = []
        this.enemies = []
        this.enemyBullets = []

        this.time = 0
        this.score = 0

        this._keydownCallback = e => {
            // Prevent scrolling the scrollbar
            if (e.code === "ArrowUp" || e.code === "ArrowDown") {
                e.preventDefault()
            }

            this.pressedKeys.add(e.code)
        }
        this._keyupCallback = e => this.pressedKeys.delete(e.code)
    }

    start(): void {
        window.addEventListener("keydown", this._keydownCallback)
        window.addEventListener("keyup", this._keyupCallback)
        
        this.background = new Background(this)
        this.player = new Player(this)

        this.time = 0

        this.debug = false
        this.playing = true
    }

    update(): void {
        this.background?.onUpdate(this)
        this.player?.onUpdate(this)
        this.playerBullets.forEach(b => b.onUpdate(this))
        this.enemies.forEach(e => e.onUpdate(this))
        this.enemyBullets.forEach(eb => eb.onUpdate(this))

        // Collision check
        for (const enemy of this.enemies) {
            for (const playerBullet of this.playerBullets) {
                if (this._hasCollided(enemy, playerBullet)) {
                    enemy.onCollideWithPlayerBullet(this)
                    playerBullet.onCollideWithEnemy()
                }
            }
            if (!enemy.destroying && this.player != undefined && this._hasCollided(enemy, this.player)) {
                this.player.onCollideWithEnemyOrEnemyBullet(this)
            }
        }
        if (this.player != undefined) {
            for (const enemyBullet of this.enemyBullets) {
                if (this._hasCollided(enemyBullet, this.player)) {
                    enemyBullet.onCollideWithPlayer()
                    this.player.onCollideWithEnemyOrEnemyBullet(this)
                }
            }
        }

        // Remove all destroyed elements
        this.playerBullets = this.playerBullets.filter(pb => {
            if (pb.destroying) {
                pb.onDestroy(this)
            }

            return !pb.destroying
        })
        this.enemies = this.enemies.filter(e => {
            if (e.destroying) {
                e.onDestroy(this)
            }

            return !e.destroying
        })
        this.enemyBullets = this.enemyBullets.filter(eb => {
            if (eb.destroying) {
                eb.onDestroy(this)
            }

            return !eb.destroying
        })

        this.time++
        if (this.time % 30 === 0) {
            // Spawn a random enemy
            const x = this.screen.width + 100
            const y = (0.8 * this.screen.height) * Math.random() + 0.1 * this.screen.height
            const vx = -1 - Math.random() * 9
            const vy = 2 - Math.random() * 4
            const enemy = new Level1Enemy(this)
            enemy.x = x
            enemy.y = y
            enemy.vx = vx
            enemy.vy = vy
            this.addEnemy(enemy)
        }

        // Debug
        if (this.pressedKeys.has("KeyD")) {
            this.debug = !this.debug
            this.pressedKeys.delete("KeyD")
        }
    }

    draw(): void {
        this.player?.onDraw(this)
        // background doesn't use onDraw
        this.playerBullets.forEach(pb => pb.onDraw(this))
        this.enemies.forEach(e => e.onDraw(this))
        this.enemyBullets.forEach(eb => eb.onDraw(this))
    }

    end(): void {
        window.removeEventListener("keydown", this._keydownCallback)
        window.removeEventListener("keyup", this._keyupCallback)
        this.pressedKeys.clear()

        this.background?.onDestroy(this)
        this.background = undefined
        this.player?.onDestroy(this)
        this.player = undefined
        this.playerBullets.forEach(pb => pb.onDestroy(this))
        this.playerBullets.length = 0
        this.enemies.forEach(e => e.onDestroy(this))
        this.enemies.length = 0
        this.enemyBullets.forEach(eb => eb.onDestroy(this))
        this.enemyBullets.length = 0

        this.playing = false

        console.log(this)
    }

    addPlayerBullet(playerBullet: PlayerBullet): void {
        this.playerBullets.push(playerBullet)
    }

    addEnemy(enemy: Enemy): void {
        this.enemies.push(enemy)
    }

    addEnemyBullet(enemyBullet: EnemyBullet): void {
        this.enemyBullets.push(enemyBullet)
    }

    playSound(sound: AudioBuffer, volume: number): void {
    }

    playMusic(music: AudioBuffer, volume: number): void {
    }

    stopMusic(): void {
    }

    private _hasCollided(
        first: { x: number, y: number, hitboxRadius: number },
        second: { x: number, y: number, hitboxRadius: number },
    ): boolean {
        var dx = (first.x + first.hitboxRadius) - (second.x + second.hitboxRadius);
        var dy = (first.y + first.hitboxRadius) - (second.y + second.hitboxRadius);
        var distance = Math.sqrt(dx * dx + dy * dy);

        return distance < first.hitboxRadius + second.hitboxRadius;
    }
}
