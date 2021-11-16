import * as PIXI from "pixi.js"

export interface GameResources {
    playerTexture: PIXI.Texture
    playerBulletTexture: PIXI.Texture
    enemyTexture: PIXI.Texture
}

export class Game {
    time: number
    score: number

    app: PIXI.Application
    player: Player
    enemies: Enemy[]
    resources: GameResources

    pressedKeys: Set<string>

    playerBullets: PlayerBullet[]

    debugElement: HTMLParagraphElement

    constructor(
        app: PIXI.Application,
        resources: GameResources,
    ) {
        this.score = 0
        this.resources = resources
        this.app = app
        this.player = new Player(this, resources.playerTexture)
        // const enemy = new Enemy(this, resources.enemyTexture)
        // enemy.x = app.screen.width
        // enemy.y = app.screen.height / 2
        // enemy.vx = -2
        this.enemies = []
        this.time = 0
        this.pressedKeys = new Set()

        window.addEventListener("keydown", e => {
            this.pressedKeys.add(e.code)
            console.log(e)
        })
        window.addEventListener("keyup", e => {
            this.pressedKeys.delete(e.code)
            console.log(e)
        })

        this.playerBullets = []

        this.debugElement = document.createElement("p")
        this.debugElement.style.whiteSpace = "pre"
        document.body.appendChild(this.debugElement)
    }

    update(): void {
        this.player.update(this)

        for (const playerBullet of this.playerBullets) {
            playerBullet.update(this)
        }

        for (const enemy of this.enemies) {
            enemy.update(this)
        }

        // check for collisions
        for (const enemy of this.enemies) {

            for (const playerBullet of this.playerBullets) {

                var dx = (enemy.x + enemy.hitboxRadius) - (playerBullet.x + playerBullet.hitboxRadius);
                var dy = (enemy.y + enemy.hitboxRadius) - (playerBullet.y + playerBullet.hitboxRadius);
                var distance = Math.sqrt(dx * dx + dy * dy);
            
                if (distance < enemy.hitboxRadius + playerBullet.hitboxRadius) {
                    // collision detected!
                    enemy.onCollideWithPlayerBullet(this)
                    playerBullet.onCollideWithEnemy()
                    console.log('collided');
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
                playerBullet.destroy(this)
                this.playerBullets.splice(i, 1)
            }
        }

        for (let i = 0; i < this.enemies.length; i++) {
            const enemy = this.enemies[i]!
            if (enemy.shouldDestroy) {
                enemy.destroy(this)
                this.enemies.splice(i, 1)
            }
        }

        this.time++

        this.debugElement.textContent = `
Player bullet count: ${this.playerBullets.length}
Score: ${this.score}
`
    }

    private _spawnEnemy(): void {
        const x = this.app.screen.width
        const y = (this.app.screen.height / 2) * Math.random() + this.app.screen.height / 4
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
}

export class Player {
    sprite: PIXI.Sprite
    x: number
    y: number
    shotCooldown: number

    constructor(
        game: Game,
        texture: PIXI.Texture,
    ) {
        this.sprite = new PIXI.Sprite(texture)
        this.sprite.anchor.set(0.5)
        this.sprite.scale.set(0.125)
        game.app.stage.addChild(this.sprite)
        this.x = 100
        this.y = 100
        this.shotCooldown = 0
    }

    update(game: Game): void {
        if (game.pressedKeys.has("ArrowLeft") && this.x > 0) {
            this.x -= 5;
        }
        if (
            game.pressedKeys.has("ArrowRight") &&
            this.x < game.app.screen.width
        ) {
            this.x += 5;
        }
        if (game.pressedKeys.has("ArrowUp") && this.y > 0) {
            this.y -= 5;
        }
        if (
            game.pressedKeys.has("ArrowDown") &&
            this.y < game.app.screen.height
        ) {
            this.y += 5;
        }

        if ((game.pressedKeys.has("KeyZ") || game.pressedKeys.has("Space")) && this.shotCooldown === 0) {
            const bullet = new PlayerBullet(game, game.resources.playerBulletTexture)
            bullet.x = this.x
            bullet.y = this.y
            game.playerBullets.push(bullet)
            this.shotCooldown = 10
        }

        if (this.shotCooldown > 0) {
            this.shotCooldown -= 1
        }
        this.sprite.x = this.x
        this.sprite.y = this.y
    }
}

export class PlayerBullet {
    sprite: PIXI.Sprite
    x: number
    y: number
    shouldDestroy: boolean
    hitboxRadius: number
    circle: PIXI.Graphics

    constructor(
        game: Game,
        texture: PIXI.Texture,
    ) {
        this.sprite = new PIXI.Sprite(texture)
        this.sprite.anchor.set(0.5)
        this.sprite.angle = -90
        this.sprite.scale.set(1 / 16)
        game.app.stage.addChild(this.sprite)
        this.x = 0
        this.y = 0
        this.shouldDestroy = false
        this.hitboxRadius = 10

        const gr = new PIXI.Graphics();
        gr.lineStyle(2, 0xFF0000)
        gr.drawCircle(0, 0, this.hitboxRadius);

        this.circle = gr;
        game.app.stage.addChild(gr)
    }

    update(game: Game): void {
        this.x += 10

        if (this.x >= game.app.screen.width) {
            this.shouldDestroy = true
        }

        this.circle.x = this.x
        this.circle.y = this.y

        this.sprite.x = this.x
        this.sprite.y = this.y
    }

    destroy(game: Game): void {
        game.app.stage.removeChild(this.sprite)
        game.app.stage.removeChild(this.circle)

        this.sprite.destroy()
        this.circle.destroy()
    }

    onCollideWithEnemy(): void {
        this.shouldDestroy = true
    }
}

export class Enemy {
    sprite: PIXI.Sprite
    hitboxRadius: number
    x: number
    y: number
    circle: PIXI.Graphics
    shouldDestroy: boolean
    vx: number
    vy: number
    hp: number

    constructor(
        game: Game,
        texture: PIXI.Texture,
    ) {
        this.sprite = new PIXI.Sprite(texture)
        this.sprite.anchor.set(0.5)
        this.sprite.angle = -135
        this.sprite.scale.set(0.125)
        game.app.stage.addChild(this.sprite)
        this.hitboxRadius = 25
        this.x = 0
        this.y = 0
        this.shouldDestroy = false
        this.vx = 0
        this.vy = 0
        this.hp = 3

        const gr = new PIXI.Graphics();
        gr.lineStyle(2, 0xFF0000);
        gr.drawCircle(0, 0, this.hitboxRadius);

        this.circle = gr;
        game.app.stage.addChild(gr)
    }

    update(game: Game): void {

        this.x += this.vx
        this.y += this.vy

        this.circle.x = this.x;
        this.circle.y = this.y;

        this.sprite.x = this.x
        this.sprite.y = this.y

        if (this.x < 0 || this.y < 0 || this.x >= game.app.screen.width || this.y >= game.app.screen.height) {
            this.shouldDestroy = true
        }

        // TODO: make this look good
        this.sprite.tint = this.hp === 3
            ? 0xFFFFFF
            : this.hp === 2
            ? 0xFF9999
            : this.hp === 1
            ? 0xFF6666
            : 0xFF0000
    }

    onCollideWithPlayerBullet(game: Game): void {
        this.hp -= 1
        if (this.hp === 0) {
            game.score += 1000
            this.shouldDestroy = true;
        }
    }

    destroy(game: Game): void {
        game.app.stage.removeChild(this.sprite)
        game.app.stage.removeChild(this.circle)

        this.sprite.destroy()
        this.circle.destroy()
    }
}
