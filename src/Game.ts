import * as PIXI from "pixi.js"

export class Game {
    time: number

    app: PIXI.Application
    player: Player

    pressedKeys: Set<string>

    constructor(
        app: PIXI.Application,
        playerSprite: PIXI.Sprite
    ) {
        this.app = app
        this.player = new Player(playerSprite)
        playerSprite.anchor.set(0.5)
        playerSprite.scale.set(0.125)
        this.app.stage.addChild(playerSprite)
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
    }

    update(): void {
        this.player.update(this)
        this.time++
    }
}

export class Player {
    sprite: PIXI.Sprite
    x: number
    y: number

    constructor(sprite: PIXI.Sprite) {
        this.sprite = sprite
        this.x = 100
        this.y = 100
    }

    update(game: Game): void {
        if (game.pressedKeys.has("ArrowLeft")) {
            this.x -= 5
        }
        if (game.pressedKeys.has("ArrowRight")) {
            this.x += 5
        }
        if (game.pressedKeys.has("ArrowUp")) {
            this.y -= 5
        }
        if (game.pressedKeys.has("ArrowDown")) {
            this.y += 5
        }

        this.sprite.x = this.x
        this.sprite.y = this.y
    }
}
