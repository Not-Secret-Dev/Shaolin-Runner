import "./style.css";
import Phaser from "phaser"; // Importing Phaser

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
    this.player = null;
    this.fireballs = null;
    this.cursor = null;
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

    this.load.spritesheet(
      "fireball",
      "/Assets/Images/Misc/fireballSpritesheet.png",
      {
        frameWidth: 23,
        frameHeight: 32,
        endFrame: 3, // Ensure this matches the actual frame count
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

    // Player Setup
    this.player = this.physics.add.sprite(
      100,
      playerRunningLevel - 10,
      "runSheet"
    );
    this.player.setCollideWorldBounds(true);

    // Player Animation
    this.anims.create({
      key: "run",
      frames: this.anims.generateFrameNumbers("runSheet", { start: 0, end: 4 }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "jump",
      frames: this.anims.generateFrameNumbers("jumpSheet", {
        start: 0,
        end: 2,
      }),
      frameRate: 10,
      repeat: 0,
    });

    // Playing player animation
    this.player.play("run");

    this.player.on("animationcomplete", (anim) => {
      if (anim.key === "jump") {
        this.player.play("run");
      }
    });

    // Keys and cursor setup
    this.cursor = this.input.keyboard.createCursorKeys();

    // Fireball Group
    this.fireballs = this.physics.add.group();

    this.anims.create({
      key: "fireball_anim",
      frames: this.anims.generateFrameNumbers("fireball", {
        frames: [0, 1, 2, 3],
      }), // Adjusted for correct frames
      frameRate: 10,
      repeat: -1,
    });

    // Generate fireballs
    this.time.addEvent({
      delay: Phaser.Math.Between(1000, 2500), // Fireball spawns between every 2 seconds
      callback: this.spawnFireball,
      callbackScope: this,
      loop: true,
    });

    // Add collision detection
    this.physics.add.overlap(this.player, this.fireballs, () => {
      this.gameOver();
    });

    // Fix AudioContext issue (Resume on user interaction)
    this.input.once("pointerdown", () => {
      this.sound.context.resume();
    });
  }

  spawnFireball() {
    const fireball = this.fireballs.create(
      windowSize.width,
      playerRunningLevel - 10,
      "fireball"
    );
    fireball.setVelocityX(-200);
    fireball.body.allowGravity = false;
    fireball.setRotation(3 / 1.9);
    fireball.play("fireball_anim");
    fireball.body.setSize(fireball.width * 0.8, fireball.height * 0.8);
    fireball.body.setOffset(fireball.width * 0.1, fireball.height * 0.1);
  }

  update() {
    // Background Parallax
    this.background_1.tilePositionX += 0.5;
    this.background_2.tilePositionX += 1;
    this.background_3.tilePositionX += 1.5;
    this.bg_floor.tilePositionX += 2;

    // Player Jump Mechanics
    if (
      (this.cursor.space.isDown || this.cursor.up.isDown) &&
      this.player.body.blocked.down
    ) {
      this.player.setVelocityY(jumpVelocity);
      this.player.play("jump", true);
    }

    // Fireball Management
    this.fireballs.children.iterate((fireball) => {
      if (fireball && fireball.x < -fireball.width) {
        fireball.destroy();
      }
    });
  }

  gameOver() {
    this.scene.restart();
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
      debug: true,
    },
  },
  scene: [GameScene],
};

const game = new Phaser.Game(config);
