import * as PIXI from "pixi.js"
import { Game } from "./Game"
import * as PIXIgif from '@pixi/gif';

PIXI.Loader.registerPlugin(PIXIgif.AnimatedGIFLoader);

const app = new PIXI.Application({
    width: 640,
    height: 480,
    resolution: window.devicePixelRatio,
    backgroundColor: 0x003366,
})
app.ticker.minFPS = 15
app.ticker.maxFPS = 60
app.stage.sortableChildren = true
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

app.loader.add('image', 'assets/Red-Robin-flying.gif');
app.loader.load((loader) => {

    const game = new Game(app, {
        playerGif: loader.resources.image!.animation!,
        playerBulletTexture: PIXI.Texture.from("assets/VC_Grow.png"),
        enemyTexture: PIXI.Texture.from("assets/VC_Act.png"),
		backgroundTexture: PIXI.Texture.from("assets/platformer_background_2.png"),

        layer1: PIXI.Texture.from("assets/Parallax/layer01_Clouds_1.png"),
        layer2: PIXI.Texture.from("assets/Parallax/layer02_Clouds_2.png"),
        layer3: PIXI.Texture.from("assets/Parallax/layer03_Clouds_3.png"),
        layer4: PIXI.Texture.from("assets/Parallax/layer04_Path.png"),
        layer5: PIXI.Texture.from("assets/Parallax/layer05_Castle.png"),
        layer6: PIXI.Texture.from("assets/Parallax/layer06_Stars_3.png"),
        layer7: PIXI.Texture.from("assets/Parallax/layer07_Stars_2.png"),
        layer8: PIXI.Texture.from("assets/Parallax/layer08_Stars_1.png"),
        layer9: PIXI.Texture.from("assets/Parallax/layer09_Sky.png")
        ,
    })
    
    let t = 0
    app.ticker.add(dt => {
        game.update()
        game.draw()
    })
});

