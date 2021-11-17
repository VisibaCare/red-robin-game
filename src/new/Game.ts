import * as PIXI from "pixi.js"
import { PlayerBullet } from "./PlayerBullet"
import { Background } from "./Background"
import { GameResources } from "./GameResources"
import { Player } from "./Player"
import { AimingShootingEnemy, AimingShotgunEnemy, Enemy, SimpleShootingEnemy } from "./Enemy"
import { EnemyBullet } from "./EnemyBullet"

export class Game {
    readonly stage: PIXI.Container
    readonly screen: PIXI.Rectangle
    readonly resources: GameResources
    readonly audioContext: AudioContext

    readonly pressedKeys: Set<string>
    musicAudioNode?: AudioBufferSourceNode
    debug: boolean
    playing: boolean

    background?: Background
    player?: Player
    playerBullets: PlayerBullet[]
    enemies: Enemy[]
    enemyBullets: EnemyBullet[]

    time: number
    score: number

    difficulty: number
    difficultyTimer: number
    
    scoreText: PIXI.Text
    lifeRobins: PIXI.Container;

    shouldEnd: boolean
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
        this.musicAudioNode = undefined
        this.debug = false
        this.playing = false

        this.background = undefined
        this.player = undefined
        this.playerBullets = []
        this.enemies = []
        this.enemyBullets = []

        this.time = 0
        this.score = 0
        this.difficulty = 0
        this.difficultyTimer = 0
        this.shouldEnd = false

        this._keydownCallback = e => {
            // Prevent scrolling the scrollbar
            if (e.code === "ArrowUp" || e.code === "ArrowDown") {
                e.preventDefault()
            }

            this.pressedKeys.add(e.code)
        }
        this._keyupCallback = e => this.pressedKeys.delete(e.code)
        const textStyle = new PIXI.TextStyle({
            fill: "white",
            fontFamily: "\"Courier New\", Courier, monospace",
            fontSize: 40,
            fontVariant: "small-caps",
            fontWeight: "bold",
            lineHeight: 50,
            align: "center"
        });

        this.scoreText = new PIXI.Text("0");
        this.scoreText.style = textStyle;
        this.scoreText.x = this.screen.width - 20;
        this.scoreText.y = 10;
        this.scoreText.anchor.set(1, 0);
        stage.addChild(this.scoreText)

        this.lifeRobins = new PIXI.Container;

    }

    private initializeLifeCounter(robinPic: PIXI.Texture) {
        for (let lives = 0; lives < this.player!.hp; lives++) {
            let lifeRobin = new PIXI.Sprite(robinPic);
            lifeRobin.scale.set(0.125);

            lifeRobin.x = 20;
            lifeRobin.y = 10;
            lifeRobin.x += +(lifeRobin.width + 20) * lives;
            lifeRobin.tint = 0xc3bdc9;
            this.lifeRobins.addChild(lifeRobin);
        }
        this.stage.addChild(this.lifeRobins);
    }

    start(): void {
        window.addEventListener("keydown", this._keydownCallback)
        window.addEventListener("keyup", this._keyupCallback)
        
        this.background = new Background(this)
        this.player = new Player(this)

        this.time = 0
        this.score = 0
        this.difficulty = 0
        this.difficultyTimer = 1200

        this.debug = false
        this.playing = true
        this.shouldEnd = false

        this.playMusic(this.resources.bgm, 0.75)

        this.initializeLifeCounter(this.resources.robinImage);
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
        if (this.difficultyTimer > 0) {
            this.difficultyTimer--
        }
        if (this.difficultyTimer <= 0) {
            this.difficulty++
            this.difficultyTimer = 1200
        }
        // Spawn enemies according to difficulty
        if (this.difficulty === 0) {
            if (this.time !== 0 && this.time % 90 === 0) {
                this._spawnSimpleEnemy()
            }
        } else if (this.difficulty === 1) {
            if (this.time % 45 === 0) {
                this._spawnSimpleEnemy()
            }
        } else if (this.difficulty === 2) {
            if (this.time % 90 === 0) {
                this._spawnAimingEnemy(false)
            }
        } else if (this.difficulty === 3) {
            if (this.time % 90 === 0) {
                this._spawnAimingEnemy(false)
            }
            if ((this.time + 45) % 90 === 0) {
                this._spawnSimpleEnemy()
            }
        } else if (this.difficulty === 4) {
            if (this.time % 90 === 0) {
                this._spawnAimingEnemy(true)
            }
        } else {
            if (this.time % 90 === 0) {
                this._spawnAimingEnemy(true)
            }
            if ((this.time + 45) % 90 === 0) {
                this._spawnSimpleEnemy()
            }
        }

        this.score++

        if(this.lifeRobins.children.length > this.player!.hp){
            this.stage.removeChild(this.lifeRobins.children.pop()!)
        }
        this.scoreText.text = this.score.toString()

        if (this.shouldEnd){
            this.end()
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
        this.stopMusic()

        const highScore = parseInt(window.localStorage.getItem("highScore") ?? "0");

        if (this.score > highScore) {
            window.localStorage.setItem('highScore', this.score.toString());
        }

        window.localStorage.setItem('lastScore', this.score.toString());
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
        const node = this.audioContext.createBufferSource()
        node.buffer = sound
        const gain = this.audioContext.createGain()
        gain.gain.value = volume
        gain.connect(this.audioContext.destination)
        node.connect(gain)
        node.start()
        node.onended = () => gain.disconnect()
    }

    playMusic(music: AudioBuffer, volume: number): void {
        this.stopMusic()
        this.musicAudioNode = this.audioContext.createBufferSource()
        this.musicAudioNode.buffer = music
        this.musicAudioNode.loop = true
        const gain = this.audioContext.createGain()
        gain.gain.value = volume
        gain.connect(this.audioContext.destination)
        this.musicAudioNode.connect(gain)
        this.musicAudioNode.start()
        this.musicAudioNode.onended = () => gain.disconnect()
    }

    stopMusic(): void {
        if (this.musicAudioNode != undefined) {
            this.musicAudioNode.stop()
            this.musicAudioNode.disconnect()
            this.musicAudioNode = undefined
        }
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

    private _spawnSimpleEnemy(): void {
        const direction = Math.PI / 8 * Math.random() - Math.PI - Math.PI / 16
        const v = 3 + Math.random() * 2
        const enemy = new SimpleShootingEnemy(this)
        enemy.x = this.screen.width + 50
        enemy.y = (0.8 * this.screen.height) * Math.random() + 0.1 * this.screen.height
        enemy.vx = v * Math.cos(direction)
        enemy.vy = v * Math.sin(direction)
        this.addEnemy(enemy)
    }

    private _spawnAimingEnemy(shotgun: boolean): void {
        const enemy = shotgun ? new AimingShotgunEnemy(this) : new AimingShootingEnemy(this)
        enemy.x = this.screen.width + 50
        enemy.y = (0.8 * this.screen.height) * Math.random() + 0.1 * this.screen.height
        enemy.sourceX = enemy.x
        enemy.sourceY = enemy.y
        enemy.targetX = this.screen.width * (0.6 + Math.random() * 0.3) 
        enemy.targetY = enemy.y
        this.addEnemy(enemy)
    }
}
