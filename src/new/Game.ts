import * as PIXI from "pixi.js"
import { PlayerBullet } from "./PlayerBullet"
import { Background } from "./Background"
import { GameResources } from "./GameResources"
import { Player } from "./Player"

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

    time: number

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

        this.time = 0

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

        if (this.pressedKeys.has("KeyD")) {
            this.debug = !this.debug
            this.pressedKeys.delete("KeyD")
        }

        this.time++
    }

    draw(): void {
        this.player?.onDraw(this)
        // background doesn't use onDraw
        this.playerBullets.forEach(b => b.onDraw(this))
    }

    end(): void {
        window.removeEventListener("keydown", this._keydownCallback)
        window.removeEventListener("keyup", this._keyupCallback)
        this.pressedKeys.clear()

        this.background?.onDestroy(this)
        this.background = undefined
        this.player?.onDestroy(this)
        this.player = undefined
        this.playerBullets.forEach(b => b.onDestroy(this))
        this.playerBullets.length = 0

        this.playing = false

        console.log(this)
    }

    spawnPlayerBullet(x: number, y: number, vx: number, vy: number): void {
        const bullet = new PlayerBullet(this)
        bullet.x = x
        bullet.y = y
        bullet.vx = vx
        bullet.vy = vy
        this.playerBullets.push(bullet)
    }

    playSound(sound: AudioBuffer, volume: number): void {
    }

    playMusic(music: AudioBuffer, volume: number): void {
    }

    stopMusic(): void {
    }
}
