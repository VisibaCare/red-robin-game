import * as PIXI from "pixi.js"
import TextHelper from "./TextHelper"

export class EndScreen {

    stage: PIXI.Container
    screen: PIXI.Rectangle
    restartButton: PIXI.Graphics
    highScoreText: PIXI.Text
    newHighScoreText: PIXI.Text
    shouldExit: boolean

    constructor(stage: PIXI.Container, background: PIXI.Texture, screen: PIXI.Rectangle) {

        this.stage = stage;
        this.screen = screen;

        const highScore: number = parseInt(window.localStorage.getItem('highScore') ?? "0");
        const lastScore: number = parseInt(window.localStorage.getItem('lastScore') ?? "0");

        const textPart1 = new PIXI.Text(`Score: ${lastScore}\nHighscore: ${highScore}`);
        textPart1.style = TextHelper.getMainTextStyle(true, 40);
        textPart1.x = this.screen.width / 2;
        textPart1.y = this.screen.height / 2 - 125;
        textPart1.anchor.set(0.5);

        this.highScoreText = textPart1;

        const textPart2 = new PIXI.Text("You set a new highscore!");
        textPart2.style = new PIXI.TextStyle({ fontFamily: 'cedarvilleCursive', fontSize: 40, fill: 0xd27da8 })
        textPart2.x = this.screen.width / 2 - 20;
        textPart2.y = this.screen.height / 2 - 50;
        textPart2.anchor.set(0.5);

        if (lastScore >= highScore) {
            textPart2.visible = true;
        } else {
            textPart2.visible = false;
        }

        this.newHighScoreText = textPart2;

        const button = new PIXI.Graphics();
        button.x = this.screen.width / 2 - 100;
        button.y = this.screen.height / 2;
        button.beginFill(0xd587ae);
        button.drawRoundedRect(0, 0, 200, 75, 16);

        const restartText = new PIXI.Text("restart");

        restartText.style = TextHelper.getMainTextStyle(false);
        restartText.x = 100;
        restartText.anchor.set(0.5);
        restartText.y = 30;

        button.addChild(restartText);

        button.interactive = true
        button.on('pointerdown', () => this._onClick())
        button.on('pointerover', () => this._onHover())
        button.on('pointerout', () => this._onOut())

        this.restartButton = button;

        const bg = new PIXI.TilingSprite(background, screen.width, screen.height);

        bg.x = 0;
        bg.tint = 0xc7c0cf
        bg.tileScale.set(0.5)
        bg.tilePosition.x = -433
        bg.tilePosition.y = -5

        this.shouldExit = false;

        stage.addChild(bg);
        stage.addChild(textPart1);
        stage.addChild(textPart2);
        stage.addChild(button);
    }

    update(): void {

        const highScore: number = parseInt(window.localStorage.getItem('highScore') ?? "0");
        const lastScore: number = parseInt(window.localStorage.getItem('lastScore') ?? "0");

        this.highScoreText.text = `Score: ${lastScore}\nHighscore: ${highScore}`;

        if (lastScore >= highScore) {
            this.newHighScoreText.visible = true;
        } else {
            this.newHighScoreText.visible = false;
        }
    }

    private _onClick(): void {
        this.shouldExit = true
    }

    private _onHover(): void {
        this.restartButton.tint = 0xc7c0cf
    }

    private _onOut(): void {
        this.restartButton.tint = 0xFFFFFF
    }
}