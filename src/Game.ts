import * as PIXI from "pixi.js"

export interface GameResources {
    playerTexture: PIXI.Texture
    playerBulletTexture: PIXI.Texture
}

export class Game {
    time: number

    app: PIXI.Application
    player: Player
    resources: GameResources

    pressedKeys: Set<string>

    playerBullets: PlayerBullet[]

    debugElement: HTMLParagraphElement

    constructor(
        app: PIXI.Application,
        resources: GameResources,
    ) {
        this.resources = resources
        this.app = app
        this.player = new Player(this, resources.playerTexture)
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
        document.body.appendChild(this.debugElement)
    }

    update(): void {
        this.player.update(this)
        for (const playerBullet of this.playerBullets) {
            playerBullet.update(this)
        }

        // Remove all destroyed player bullets
        for (let i = 0; i < this.playerBullets.length; i++) {
            const playerBullet = this.playerBullets[i]!
            if (playerBullet.shouldDestroy) {
                playerBullet.destroy(this)
                this.playerBullets.splice(i, 1)
            }
        }
        this.time++

        this.debugElement.textContent = `
Player bullet count: ${this.playerBullets.length}
`
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

        if (game.pressedKeys.has("Space") && this.shotCooldown === 0) {
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

    constructor(
        game: Game,
        texture: PIXI.Texture,
    ) {
        this.sprite = new PIXI.Sprite(texture)
        this.sprite.anchor.set(0.5)
        this.sprite.angle = -90
        this.sprite.scale.set(1/16)
        game.app.stage.addChild(this.sprite)
        this.x = 0
        this.y = 0
        this.shouldDestroy = false
    }

    update(game: Game): void {
        this.x += 10

        if (this.x >= game.app.screen.width) {
            this.shouldDestroy = true
        }

        this.sprite.x = this.x
        this.sprite.y = this.y
    }

    destroy(game: Game): void {
        game.app.stage.removeChild(this.sprite)
    }
}
