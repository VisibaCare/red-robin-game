import * as PIXI from "pixi.js"
import { Game } from "./Game"

const app = new PIXI.Application({
    width: 640,
    height: 480,
    resolution: window.devicePixelRatio,
    backgroundColor: 0x003366,
})
app.ticker.minFPS = 15
app.ticker.maxFPS = 60
document.body.appendChild(app.view)

// const sprites: PIXI.Sprite[] = [
//     PIXI.Sprite.from("assets/VC_Care.png"),
//     PIXI.Sprite.from("assets/VC_Act.png"),
//     PIXI.Sprite.from("assets/VC_Grow.png"),
//     PIXI.Sprite.from("assets/Red_Robin.png")
// ]

// for (const sprite of sprites) {
//     sprite.anchor.set(0.5)
//     sprite.scale.set(0.25)
//     app.stage.addChild(sprite)
// }

const game = new Game(app, {
    playerTexture: PIXI.Texture.from("assets/Red_Robin.png"),
    playerBulletTexture: PIXI.Texture.from("assets/VC_Grow.png"),
    enemyTexture: PIXI.Texture.from("assets/VC_Act.png"),
})

let t = 0
app.ticker.add(dt => {
    game.update()
})
