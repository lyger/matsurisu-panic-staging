import Phaser from "phaser";
import { DEPTH, TEXT_STYLE, WIDTH } from "../globals";
import store from "../store";
import ButtonFactory from "../components/uibutton";
import { resetCatalog } from "../components/items/catalog";
import Stage from "./stage";
import { addCurtainsTransition } from "./curtains";

const Button = ButtonFactory("ui");

export default class Results extends Phaser.Scene {
  create() {
    this.state = store.getState();
    this.counter = { score: this.state.score.score };

    this.scoreText = this.add
      .text(WIDTH / 2, 450, this.counter.score.toFixed(0), {
        ...TEXT_STYLE,
        fontSize: "48px",
      })
      .setOrigin(0.5, 0.5)
      .setDepth(DEPTH.UIFRONT);

    this.addBonus({
      name: "MONEY",
      y: 100,
      delay: 1000,
      duration: 1500,
      value: this.state.score.money,
      multiplier: this.state.score.results.moneyMultiplier,
    });

    this.addBonus({
      name: "LIVES",
      y: 180,
      delay: 3000,
      duration: 1500,
      value: this.state.score.lives,
      multiplier: this.state.score.results.livesMultiplier,
    });

    this.addBonus({
      name: "BEST COMBO",
      y: 260,
      delay: 5000,
      duration: 1500,
      value: this.state.score.bestCombo,
      multiplier: this.state.score.results.bestComboMultiplier,
    });

    this.button = new Button(this, {
      x: WIDTH / 2,
      y: 600,
      default: 3,
      hover: 4,
      down: 5,
      upCallback: () => this.handleNewGame(),
    });

    this.add.existing(this.button);
  }

  addBonus({ name, y, delay, duration, value, multiplier }) {
    this.time.delayedCall(delay, () => {
      this.add
        .text(WIDTH / 2, y, `${name}: ${value} × ${multiplier}`, TEXT_STYLE)
        .setOrigin(0.5, 0.5)
        .setDepth(DEPTH.UIFRONT);

      const newScore = this.counter.score + value * multiplier;
      this.tweens.add({
        targets: this.counter,
        score: newScore,
        duration: duration,
        repeat: 0,
      });
    });
  }

  handleNewGame() {
    store.dispatch({ type: "global.newGame" });
    resetCatalog();
    addCurtainsTransition({
      scene: this,
      targetKey: "Stage",
      targetClass: Stage,
      duration: 1000,
    });
  }

  update() {
    this.scoreText.setText(this.counter.score.toFixed(0));
  }
}