import * as PIXI from "pixi.js"
import { Game } from "./Game"
export class Background {
    backgroundSprite: PIXI.TilingSprite;

    constructor(game: Game, backgroundTexture: PIXI.Texture) {
        this.backgroundSprite = new PIXI.TilingSprite(
            backgroundTexture,
            640,
            480
        );
        this.backgroundSprite.tileScale.set(0.5,0.5)
        this.backgroundSprite.x = 0;
        this.backgroundSprite.y = 0;
        this.backgroundSprite.zIndex = -100;
        this.backgroundSprite.tilePosition.x = 0;
        this.backgroundSprite.tilePosition.y = 0;
        this.backgroundSprite.tint = 0xc3bdc9
        game.app.stage.addChild(this.backgroundSprite);
        requestAnimationFrame(game.update);
    }

    update(game: Game): void {
        this.backgroundSprite.tilePosition.x -= 1;
        requestAnimationFrame(game.update);
    }
}
