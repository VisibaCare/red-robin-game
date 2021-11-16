import * as PIXI from "pixi.js"

const app = new PIXI.Application({
    width: 640,
    height: 480,
    resolution: window.devicePixelRatio,
    backgroundColor: 0x003366,
})
app.ticker.minFPS = 15
app.ticker.maxFPS = 60
document.body.appendChild(app.view)

const sprites: PIXI.Sprite[] = [
    // PIXI.Sprite.from("assets/VC_Care.png"),
    // PIXI.Sprite.from("assets/VC_Act.png"),
    // PIXI.Sprite.from("assets/VC_Grow.png"),
    // PIXI.Sprite.from("assets/Red_Robin.png")
]

// for (const sprite of sprites) {
//     sprite.anchor.set(0.5)
//     sprite.scale.set(0.25)
//     app.stage.addChild(sprite)
// }

let t = 0
app.loader
    .add("care", "assets/VC_Care.png")
    .add("act", "assets/VC_Act.png")
    .add("grow", "assets/VC_Grow.png")
    .add("redRobin", "assets/Red_Robin.png")
    .load((loader, resources) => {
        sprites.push(new PIXI.Sprite(resources["care"]!.texture!))
        sprites.push(new PIXI.Sprite(resources["act"]!.texture!))
        sprites.push(new PIXI.Sprite(resources["grow"]!.texture!))
        sprites.push(new PIXI.Sprite(resources["redRobin"]!.texture!))

        for (const sprite of sprites) {
            sprite.anchor.set(0.5)
            sprite.scale.set(0.25)
            app.stage.addChild(sprite)
        }
    })
app.ticker.add(dt => {
    t += dt
    for (let i = 0; i < sprites.length; i++) {
        const sprite = sprites[i]!
        sprite.rotation = -t / 50
        sprite.x = app.screen.width / 2 + 150 * Math.cos(t / 50 + 2 * Math.PI / sprites.length * i)
        sprite.y = app.screen.height / 2 + 150 * Math.sin(t / 50 + 2 * Math.PI / sprites.length * i)
    }
})
