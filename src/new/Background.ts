import * as PIXI from "pixi.js"
import { Game } from "./Game"

export class Background {
    layer1: PIXI.TilingSprite
    layer2: PIXI.TilingSprite
    layer3: PIXI.TilingSprite
    layer4: PIXI.TilingSprite
    layer5: PIXI.Sprite
    layer6: PIXI.TilingSprite
    layer7: PIXI.TilingSprite
    layer8: PIXI.TilingSprite
    layer9: PIXI.TilingSprite

    constructor(game: Game) {
        this.layer1 = new PIXI.TilingSprite(
            game.resources.layer1,
            game.screen.width,
            game.screen.height,
        )
        this.layer1.tileScale.set(0.5)
        this.layer1.zIndex = -100
        this.layer1.tint = 0xC3BDC9

        this.layer2 = new PIXI.TilingSprite(
            game.resources.layer2,
            game.screen.width,
            game.screen.height,
        )
        this.layer2.tileScale.set(0.5)
        this.layer2.zIndex = -100
        this.layer2.tint = 0xB1A6BD

        this.layer3 = new PIXI.TilingSprite(
            game.resources.layer3,
            game.screen.width,
            game.screen.height,
        )
        this.layer3.tileScale.set(0.5)
        this.layer3.zIndex = -100
        this.layer3.tint = 0xA093AD

        this.layer4 = new PIXI.TilingSprite(
            game.resources.layer4,
            game.screen.width,
            game.screen.height,
        )
        this.layer4.tileScale.set(0.5)
        this.layer4.zIndex = -100
        this.layer4.tint = 0xC3BDC9

        this.layer5 = new PIXI.Sprite(game.resources.layer5)
        this.layer5.scale.set(0.5)
        this.layer5.x = game.screen.width + 500
        this.layer5.zIndex = -100
        this.layer5.tint = 0xC3BDC9

        this.layer6 = new PIXI.TilingSprite(
            game.resources.layer6,
            game.screen.width,
            game.screen.height,
        )
        this.layer6.tileScale.set(0.5)
        this.layer6.zIndex = -100
        this.layer6.tint = 0xC3BDC9

        this.layer7 = new PIXI.TilingSprite(
            game.resources.layer7,
            game.screen.width,
            game.screen.height,
        )
        this.layer7.tileScale.set(0.5)
        this.layer7.zIndex = -100
        this.layer7.tint = 0xC3BDC9

        this.layer8 = new PIXI.TilingSprite(
            game.resources.layer8,
            game.screen.width,
            game.screen.height,
        )
        this.layer8.tileScale.set(0.5)
        this.layer8.zIndex = -100
        this.layer8.tint = 0xC3BDC9

        this.layer9 = new PIXI.TilingSprite(
            game.resources.layer9,
            game.screen.width,
            game.screen.height,
        )
        this.layer9.tileScale.set(0.5)
        this.layer9.zIndex = -100
        this.layer9.tint = 0xC3BDC9

        // Adds children in descending order so they layer correctly without adjusting z
        game.stage.addChild(this.layer9)
        game.stage.addChild(this.layer8)
        game.stage.addChild(this.layer7)
        game.stage.addChild(this.layer6)
        game.stage.addChild(this.layer5)
        game.stage.addChild(this.layer4)
        game.stage.addChild(this.layer3)
        game.stage.addChild(this.layer2)
        game.stage.addChild(this.layer1)
    }

    onUpdate(game: Game): void {
        this.layer1.tilePosition.x -= 4.5
        this.layer2.tilePosition.x -= 4
        this.layer3.tilePosition.x -= 3.5
        this.layer4.tilePosition.x -= 3
        this.layer5.position.x -= 2.5
        if (this.layer5.position.x + this.layer5.width < 0) {
            this.layer5.position.x = game.screen.width + 500
        }
        this.layer6.tilePosition.x -= 2
        this.layer7.tilePosition.x -= 1.5
        this.layer8.tilePosition.x -= 1
        this.layer9.tilePosition.x -= 0.5
    }

    onDestroy(game: Game) {
        game.stage.removeChild(this.layer9)
        this.layer9.destroy()
        game.stage.removeChild(this.layer8)
        this.layer8.destroy()
        game.stage.removeChild(this.layer7)
        this.layer7.destroy()
        game.stage.removeChild(this.layer6)
        this.layer6.destroy()
        game.stage.removeChild(this.layer5)
        this.layer5.destroy()
        game.stage.removeChild(this.layer4)
        this.layer4.destroy()
        game.stage.removeChild(this.layer3)
        this.layer3.destroy()
        game.stage.removeChild(this.layer2)
        this.layer2.destroy()
        game.stage.removeChild(this.layer1)
        this.layer1.destroy()
    }
}
