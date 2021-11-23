import * as PIXI from "pixi.js"
import { EndScreen } from "./EndScreen";
import { Game } from "./new/Game"
import * as PIXIgif from '@pixi/gif'
import { WebfontLoaderPlugin } from "pixi-webfont-loader"
import { Menu } from "./Menu"

import playerGifUrl from "/assets/Red-Robin-flying.gif"
import cedarvilleCursiveUrl from "/assets/CedarvilleCursive-Regular.ttf"
import backgroundTextureUrl from "/assets/platformer_background_2.png"
import playerBulletTextureUrl from "/assets/VC_Care.png"
import enemyTextureUrl from "/assets/VC_Act.png"
import enemyBulletTextureUrl from "/assets/VC_Grow.png"
import robinImageUrl from "/assets/Red_Robin.png"
import layer1Url from "/assets/Parallax/layer01_Clouds_1.png"
import layer2Url from "/assets/Parallax/layer02_Clouds_2.png"
import layer3Url from "/assets/Parallax/layer03_Clouds_3.png"
import layer4Url from "/assets/Parallax/layer04_Path.png"
import layer5Url from "/assets/Parallax/layer05_Castle.png"
import layer6Url from "/assets/Parallax/layer06_Stars_3.png"
import layer7Url from "/assets/Parallax/layer07_Stars_2.png"
import layer8Url from "/assets/Parallax/layer08_Stars_1.png"
import layer9Url from "/assets/Parallax/layer09_Sky.png"
import laserSoundUrl from "/assets/laserShoot.wav"
import explosionUrl from "/assets/explosion.wav"
import bgmUrl from "/assets/My Song 25.wav"

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

app.loader.add('playerGif', playerGifUrl);
app.loader.add('cedarvilleCursive', cedarvilleCursiveUrl)

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
    
    const menu = new Menu(menuStage, PIXI.Texture.from(backgroundTextureUrl), app.screen)

    const gameStage = new PIXI.Container()
    gameStage.visible = false
    gameStage.sortableChildren = true
    app.stage.addChild(gameStage)

    const game = new Game(gameStage, app.screen, {
        playerGif: loader.resources.playerGif!.animation!,
        playerBulletTexture: PIXI.Texture.from(playerBulletTextureUrl),
        enemyTexture: PIXI.Texture.from(enemyTextureUrl),
        enemyBulletTexture: PIXI.Texture.from(enemyBulletTextureUrl),
        backgroundTexture: PIXI.Texture.from(backgroundTextureUrl),
        robinImage: PIXI.Texture.from(robinImageUrl),

        layer1: PIXI.Texture.from(layer1Url),
        layer2: PIXI.Texture.from(layer2Url),
        layer3: PIXI.Texture.from(layer3Url),
        layer4: PIXI.Texture.from(layer4Url),
        layer5: PIXI.Texture.from(layer5Url),
        layer6: PIXI.Texture.from(layer6Url),
        layer7: PIXI.Texture.from(layer7Url),
        layer8: PIXI.Texture.from(layer8Url),
        layer9: PIXI.Texture.from(layer9Url),

        laserSound: await audioContext.decodeAudioData(await (await fetch(laserSoundUrl)).arrayBuffer()),
        explosion: await audioContext.decodeAudioData(await (await fetch(explosionUrl)).arrayBuffer()),
        bgm: await audioContext.decodeAudioData(await (await fetch(bgmUrl)).arrayBuffer()),
    }, audioContext)

    const endScreen = new EndScreen(endStage, PIXI.Texture.from(backgroundTextureUrl), app.screen);

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
