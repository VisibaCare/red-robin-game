import * as PIXI from "pixi.js"
import { Game } from "./Game"
import { EndScreen } from "./EndScreen";
import { Game as OldGame } from "./Game"
import { Game as NewGame } from "./new/Game"
import * as PIXIgif from '@pixi/gif'
import { WebfontLoaderPlugin } from "pixi-webfont-loader"
import { Menu } from "./Menu"

PIXI.Loader.registerPlugin(PIXIgif.AnimatedGIFLoader)
PIXI.Loader.registerPlugin(WebfontLoaderPlugin)

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

app.loader.add('image', 'assets/Red-Robin-flying.gif');
app.loader.add('cedarvilleCursive', 'assets/CedarvilleCursive-Regular.ttf')

let currentScene: "menu" | "game" | "end" = "menu"

app.loader.load(async (loader) => {

    const audioContext = new AudioContext()

    const endStage = new PIXI.Container()
    endStage.visible = false
    endStage.sortableChildren = true
    app.stage.addChild(endStage)
    
    const menuStage = new PIXI.Container()
    menuStage.visible = true
    app.stage.addChild(menuStage)
    
    const menu = new Menu(menuStage, PIXI.Texture.from("assets/platformer_background_2.png"), app.screen)

    const gameStage = new PIXI.Container()
    gameStage.visible = false
    gameStage.sortableChildren = true
    app.stage.addChild(gameStage)

    const game = new NewGame(gameStage, app.screen, {
        playerGif: loader.resources.image!.animation!,
        playerBulletTexture: PIXI.Texture.from("assets/VC_Care.png"),
        enemyTexture: PIXI.Texture.from("assets/VC_Act.png"),
        enemyBulletTexture: PIXI.Texture.from("assets/VC_Grow.png"),
        backgroundTexture: PIXI.Texture.from("assets/platformer_background_2.png"),
        robinImage: PIXI.Texture.from("assets/Red_Robin.png"),

        layer1: PIXI.Texture.from("assets/Parallax/layer01_Clouds_1.png"),
        layer2: PIXI.Texture.from("assets/Parallax/layer02_Clouds_2.png"),
        layer3: PIXI.Texture.from("assets/Parallax/layer03_Clouds_3.png"),
        layer4: PIXI.Texture.from("assets/Parallax/layer04_Path.png"),
        layer5: PIXI.Texture.from("assets/Parallax/layer05_Castle.png"),
        layer6: PIXI.Texture.from("assets/Parallax/layer06_Stars_3.png"),
        layer7: PIXI.Texture.from("assets/Parallax/layer07_Stars_2.png"),
        layer8: PIXI.Texture.from("assets/Parallax/layer08_Stars_1.png"),
        layer9: PIXI.Texture.from("assets/Parallax/layer09_Sky.png"),

        laserSound: await audioContext.decodeAudioData(await (await fetch("assets/laserShoot.wav")).arrayBuffer()),
        explosion: await audioContext.decodeAudioData(await (await fetch("assets/explosion.wav")).arrayBuffer()),
        bgm: await audioContext.decodeAudioData(await (await fetch("assets/My Song 25.wav")).arrayBuffer()),
    }, audioContext)

    const endScreen = new EndScreen(endStage, PIXI.Texture.from("assets/platformer_background_2.png"), app.screen);

    app.ticker.add(() => {
        if (currentScene === "menu") {
            if (menu.gameHasStarted) {
                menuStage.visible = false
                gameStage.visible = true
                endStage.visible = false
                game.start()
                currentScene = "game"
            }
        }
        
        if (currentScene === "game") {
            game.update()
            game.draw()
            if (!game.playing) {
                menuStage.visible = false
                gameStage.visible = false
                endStage.visible = true
                endScreen.shouldExit = false
                endScreen.update()
                currentScene = "end"
            }
        }

        if (currentScene === "end") {
            if (endScreen.shouldExit) {
                menuStage.visible = true
                gameStage.visible = false
                endStage.visible = false
                menu.gameHasStarted = false
                currentScene = "menu"
            }
        }
    })
});
