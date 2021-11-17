import * as PIXI from "pixi.js"
import * as PIXIgif from '@pixi/gif'

export interface GameResources {
    playerGif: PIXIgif.AnimatedGIF
    playerBulletTexture: PIXI.Texture
    enemyTexture: PIXI.Texture
    enemyBulletTexture: PIXI.Texture

    backgroundTexture: PIXI.Texture
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
