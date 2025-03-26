import "./style.css";
import Phaser, { Physics, Scenes } from "phaser"; // Importing Phaser

// Game Specific Constants
const windowSize = {
  width: 800,
  height: 400,
};
const gravityVal = 350;
const playerRunningLevel = windowSize.height - 10;
const jumpVelocity = -200;

// Game Scene
class GameScene extends Phaser.Scene {
  constructor() {
    super("game-scene");
    this.player;
    this.cursor;
  }

  preload() {
    this.load.image(
      "background_1",
      "/Assets/Images/backgrounds/shaolin_background_a.png"
    );
    this.load.image(
      "background_2",
      "/Assets/Images/backgrounds/shaolin_background_b.png"
    );
    this.load.image(
      "background_3",
      "/Assets/Images/backgrounds/shaolin_background_c.png"
    );
    this.load.image(
      "bg_floor",
      "/Assets/Images/backgrounds/shaolin_background_floor.png"
    );
    this.load.spritesheet(
      "runSheet",
      "/Assets/Images/Assets/shaolin_running_strip.png",
      {
        frameWidth: 45,
        frameHeight: 61,
        endFrame: 4,
      }
    );
    this.load.spritesheet(
      "jumpSheet",
      "/Assets/Images/Assets/shaolin_jump_strip.png",
      {
        frameWidth: 36,
        frameHeight: 59,
        endFrame: 2,
      }
    );
  }

  create() {
    // Background Setup
    this.background_1 = this.add
      .tileSprite(0, 0, windowSize.width, windowSize.height, "background_1")
      .setOrigin(0, 0);
    this.background_2 = this.add
      .tileSprite(0, 0, windowSize.width, windowSize.height, "background_2")
      .setOrigin(0, 0);
    this.background_3 = this.add
      .tileSprite(0, 0, windowSize.width, windowSize.height, "background_3")
      .setOrigin(0, 0);
    this.bg_floor = this.add
      .tileSprite(
        0,
        windowSize.height - 60,
        windowSize.width,
        windowSize.height,
        "bg_floor"
      )
      .setOrigin(0, 0);
    this.ground = this.add.rectangle(
      windowSize.width / 2,
      playerRunningLevel + 1,
      windowSize.width,
      20,
      0x00ff00
    );
    this.physics.add.existing(this.ground, true); // Make it a static body

    // Player Setup
    this.player = this.physics.add.sprite(
      100,
      playerRunningLevel - 10,
      "runSheet"
    );
    this.player.setCollideWorldBounds(true);

    this.ground.setVisible(false); // Hide the ground
    this.physics.add.collider(this.player, this.ground); // Enable collision

    // Player Animation
    this.anims.create({
      key: "run",
      frames: this.anims.generateFrameNumbers("runSheet", { start: 0, end: 4 }), // start to end frames
      frameRate: 10,
      repeat: -1, // for looping
    });

    this.anims.create({
      key: "jump",
      frames: this.anims.generateFrameNumbers("jumpSheet", {
        start: 0,
        end: 2,
      }), // start to end frames
      frameRate: 10,
      repeat: 0,
    });

    // playing player animation
    this.player.play("run");

    this.player.on("animationcomplete", (anim) => {
      if (anim.key === "jump") {
        this.player.play("run");
      }
    });

    // Keys and cursor setup
    this.cursor = this.input.keyboard.createCursorKeys();
  }

  update() {
    // Background Parallax
    this.background_1.tilePositionX += 0.5;
    this.background_2.tilePositionX += 1;
    this.background_3.tilePositionX += 1.5;
    this.bg_floor.tilePositionX += 2;

    // Player Jump Mechanics
    if ((this.cursor.space.isDown || this.cursor.up.isDown) && this.player.body.blocked.down) {
      this.player.setVelocityY(jumpVelocity);
      this.player.play("jump", true);
    }
  }
}

// Game Config
const config = {
  type: Phaser.WEBGL,
  width: windowSize.width,
  height: windowSize.height,
  canvas: GameCanvas,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: gravityVal },
      debug: false,
    },
  },
  scene: [GameScene],
};

const game = new Phaser.Game(config);
