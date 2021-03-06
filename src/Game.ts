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
    enemyBulletTexture: PIXI.Texture
    backgroundTexture: PIXI.Texture

    robinImage: PIXI.Texture

    layer1: PIXI.Texture
    layer2: PIXI.Texture
    layer3: PIXI.Texture
    layer4: PIXI.Texture
    layer5: PIXI.Texture
    layer6: PIXI.Texture
    layer7: PIXI.Texture
    layer8: PIXI.Texture
    layer9: PIXI.Texture

    laserSound: AudioBuffer
    explosion: AudioBuffer
    bgm: AudioBuffer
}

export class Game {
    time: number
    currentScore: number
    gameOver: boolean
    audioContext: AudioContext

    stage: PIXI.Container
    screen: PIXI.Rectangle
    player: Player
    background: Background
    enemies: Enemy[]
    resources: GameResources

    pressedKeys: Set<string>

    playerBullets: PlayerBullet[]
    enemyBullets: EnemyBullet[]

    isDebug: boolean
    debugElement: HTMLParagraphElement

    scoreText: PIXI.Text
    lifeRobins: PIXI.Container;


    constructor(
        stage: PIXI.Container,
        resources: GameResources,
        screen: PIXI.Rectangle,
        audioContext: AudioContext,
    ) {
        this.isDebug = false
        this.currentScore = 0
        this.resources = resources
        this.audioContext = audioContext
        this.stage = stage
        this.screen = screen
        this.player = new Player(this)
        this.background = new Background(this)
        this.enemies = []
        this.time = 0
        this.pressedKeys = new Set()
        this.gameOver = false

        window.addEventListener("keydown", e => {
            if (e.code === "ArrowUp" || e.code === "ArrowDown") {
                e.preventDefault()
            }
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
        this.initializeLifeCounter(resources.robinImage);

    }

    private initializeLifeCounter(robinPic: PIXI.Texture) {

        for (let lives = 0; lives < this.player.hp; lives++) {
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

    update(): void {
        this.player.onUpdate(this)
        this.background.onUpdate(this)
        for (const playerBullet of this.playerBullets) {
            playerBullet.onUpdate(this)
        }
        for (const enemy of this.enemies) {
            enemy.onUpdate(this)
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
                    this.player.onCollideWithEnemy(this)
                    console.log('player collided');
                }
            }
        }

        for (const enemyBullet of this.enemyBullets) {
            if (this._hasCollided(this.player, enemyBullet)) {
                this.player.onCollideWithEnemy(this);
                enemyBullet.onCollideWithPlayer();
                console.log('player collided');
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
                i--
            }
        }
        // Enemies
        for (let i = 0; i < this.enemies.length; i++) {
            const enemy = this.enemies[i]!
            if (enemy.shouldDestroy) {
                enemy.onDestroy(this)
                this.enemies.splice(i, 1)
                i--
            }
        }
        // Enemy bullets
        for (let i = 0; i < this.enemyBullets.length; i++) {
            const enemyBullet = this.enemyBullets[i]!
            if (enemyBullet.shouldDestroy) {
                enemyBullet.onDestroy(this)
                this.enemyBullets.splice(i, 1)
                i--
            }
        }

        if(this.lifeRobins.children.length > this.player.hp){
            this.stage.removeChild(this.lifeRobins.children.pop()!)
        }

        this.currentScore++
        this.time++

        this.scoreText.text = this.currentScore.toString()

        if (this.gameOver) {
            this.end();
        }

        if(this.isDebug){
            this.debugElement.textContent = `
            Player bullet count: ${this.playerBullets.length}
            Score: ${this.currentScore}
            HP: ${this.player.hp}
            Invulnerable: ${this.player.invulnerableAfterDamageCooldown > 0}
            `
        }
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

    end(): void {

        const highScore = parseInt(window.localStorage.getItem("highScore") ?? "0");

        if (this.currentScore > highScore) {
            window.localStorage.setItem('highScore', this.currentScore.toString());
        }

        window.localStorage.setItem('lastScore', this.currentScore.toString());

        this.currentScore = 0;

        for (let i = 0; i < this.playerBullets.length; i++) {
            const playerBullet = this.playerBullets[i]!
            playerBullet.onDestroy(this)
            this.playerBullets.splice(i, 1)
            i--
        }
        for (let i = 0; i < this.enemies.length; i++) {
            const enemy = this.enemies[i]!
            enemy.onDestroy(this)
            this.enemies.splice(i, 1)
            i--
        }
        for (let i = 0; i < this.enemyBullets.length; i++) {
            const enemyBullet = this.enemyBullets[i]!
            enemyBullet.onDestroy(this)
            this.enemyBullets.splice(i, 1)
            i--
        }

        this.player.onDestroy(this);
        this.player = new Player(this);

        this.lifeRobins.removeChildren()
        this.initializeLifeCounter(this.resources.robinImage);

    }

    playSound(sound: AudioBuffer, volume: number, looping: boolean = false): void {
        const node = this.audioContext.createBufferSource()
        node.buffer = sound
        node.loop = looping
        const gain = this.audioContext.createGain()
        gain.gain.value = volume
        gain.connect(this.audioContext.destination)
        node.connect(gain)
        node.start()
    }

    private _spawnEnemy(): void {
        const x = this.screen.width + 99
        const y = (this.screen.height * 0.8) * Math.random() + this.screen.height * 0.1
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

