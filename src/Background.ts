import * as PIXI from "pixi.js"
import { Game } from "./Game"
export class Background {
    //backgroundSprite: PIXI.TilingSprite;
    layer2: PIXI.TilingSprite;
    layer3: PIXI.TilingSprite;
    layer4: PIXI.TilingSprite;
    layer5: PIXI.TilingSprite;
    layer6: PIXI.TilingSprite;
    layer7: PIXI.TilingSprite;

    layer8: PIXI.TilingSprite;
    layer9: PIXI.TilingSprite;


    constructor(game: Game) {

        this.layer2 = new PIXI.TilingSprite(
            game.resources.layer2,
            640,
            480
        );
        this.layer2.tileScale.set(0.5,0.5)
        this.layer2.x = 0;
        this.layer2.y = 0;
        this.layer2.zIndex = -100;
        this.layer2.tilePosition.x = 0;
        this.layer2.tilePosition.y = 0;
        this.layer2.tint = 0xc3bdc9

        this.layer3 = new PIXI.TilingSprite(
            game.resources.layer3,
            640,
            480
        );
        this.layer3.tileScale.set(0.5,0.5)
        this.layer3.x = 0;
        this.layer3.y = 0;
        this.layer3.zIndex = -100;
        this.layer3.tilePosition.x = 0;
        this.layer3.tilePosition.y = 0;
        this.layer3.tint = 0xb1a6bd

        this.layer4 = new PIXI.TilingSprite(
            game.resources.layer4,
            640,
            480
        );
        this.layer4.tileScale.set(0.5,0.5)
        this.layer4.x = 0;
        this.layer4.y = 0;
        this.layer4.zIndex = -100;
        this.layer4.tilePosition.x = 0;
        this.layer4.tilePosition.y = 0;
        this.layer4.tint = 0xc3bdc9

        this.layer5 = new PIXI.TilingSprite(
            game.resources.layer5,
            640,
            480
        );
        this.layer5.tileScale.set(0.5,0.5)
        this.layer5.x = 0;
        this.layer5.y = 0;
        this.layer5.zIndex = -100;
        this.layer5.tilePosition.x = 0;
        this.layer5.tilePosition.y = 0;
        this.layer5.tint = 0xc3bdc9

        this.layer6 = new PIXI.TilingSprite(
            game.resources.layer6,
            640,
            480
        );
        this.layer6.tileScale.set(0.5,0.5)
        this.layer6.x = 0;
        this.layer6.y = 0;
        this.layer6.zIndex = -100;
        this.layer6.tilePosition.x = 0;
        this.layer6.tilePosition.y = 0;
        this.layer6.tint = 0xc3bdc9

        this.layer7 = new PIXI.TilingSprite(
            game.resources.layer7,
            640,
            480
        );
        this.layer7.tileScale.set(0.5,0.5)
        this.layer7.x = 0;
        this.layer7.y = 0;
        this.layer7.zIndex = -100;
        this.layer7.tilePosition.x = 0;
        this.layer7.tilePosition.y = 0;
        this.layer7.tint = 0xc3bdc9

        this.layer8 = new PIXI.TilingSprite(
            game.resources.layer8,
            640,
            480
        );
        this.layer8.tileScale.set(0.5,0.5)
        this.layer8.x = 0;
        this.layer8.y = 0;
        this.layer8.zIndex = -100;
        this.layer8.tilePosition.x = 0;
        this.layer8.tilePosition.y = 0;
        this.layer8.tint = 0xc3bdc9

        this.layer9 = new PIXI.TilingSprite(
            game.resources.layer9,
            640,
            480
        );
        this.layer9.tileScale.set(0.5,0.5)
        this.layer9.x = 0;
        this.layer9.y = 0;
        this.layer9.zIndex = -100;
        this.layer9.tilePosition.x = 0;
        this.layer9.tilePosition.y = 0;
        this.layer9.tint = 0xc3bdc9

        game.app.stage.addChild(this.layer9);
        game.app.stage.addChild(this.layer8);
        game.app.stage.addChild(this.layer7);
        game.app.stage.addChild(this.layer6);
        game.app.stage.addChild(this.layer5);
        game.app.stage.addChild(this.layer4);
        game.app.stage.addChild(this.layer3);
        game.app.stage.addChild(this.layer2);

    }

    update(game: Game): void {
        this.layer2.tilePosition.x -= 3;
        this.layer3.tilePosition.x -= 2.5;
        this.layer4.tilePosition.x -= 2.2;
        this.layer5.tilePosition.x -= 2;
        this.layer6.tilePosition.x -= 1.8;
        this.layer7.tilePosition.x -= 1.3;
        this.layer8.tilePosition.x -= 0.9;
        this.layer9.tilePosition.x -= 0.5;

    }
}