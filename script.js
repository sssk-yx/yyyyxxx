// app.js

class BreakoutGame extends Phaser.Scene {
    constructor() {
        super("breakout");
    }

    preload() {
        this.load.image('ball', '微信图片_20241119115116.png');
        this.load.image('paddle', '微信图片_20241119115319.png');
        this.load.image('brick', '微信图片_20241119115134.png');
    }

    create() {
        // 创建背景
        this.add.image(this.scale.width / 2, this.scale.height / 2, 'background');

        // 创建小球
        this.ball = this.physics.add.sprite(this.scale.width / 2, this.scale.height / 2, 'ball');
        this.ball.setCollideWorldBounds(true).setBounce(1).setScale(0.5);

        // 创建球拍
        this.paddle = this.physics.add.sprite(this.scale.width / 2, this.scale.height - 50, 'paddle').setScale(0.5);
        this.paddle.setCollideWorldBounds(true).setImmovable(true);

        // 创建砖块组
        this.bricks = this.physics.add.group({
            key: 'brick',
            frameQuantity: 10,
            repeat: 9,
            setXY: { x: 50, y: 50, stepX: 75, stepY: 25 },
            gridAlignVertically: true
        });

        // 设置物理系统
        this.physics.world.setBounds(0, 0, this.scale.width, this.scale.height);
        this.physics.add.collider(this.ball, this.paddle, this.handlePaddleCollision, null, this);
        this.physics.add.collider(this.ball, this.bricks, this.handleBrickCollision, null, this);

        // 初始化得分和生命值
        this.score = 0;
        this.lives = 3;

        // 显示得分和生命值
        this.scoreText = this.add.text(16, 16, `Score: ${this.score}`, { fontSize: '32px', fill: '#fff' });
        this.livesText = this.add.text(16, 50, `Lives: ${this.lives}`, { fontSize: '32px', fill: '#fff' });

        // 移动控制
        this.cursors = this.input.keyboard.createCursorKeys();

        // 启动小球
        this.ball.setVelocity(-150, -150);
    }

    update() {
        if (this.cursors.left.isDown) {
            this.paddle.setVelocityX(-200);
        } else if (this.cursors.right.isDown) {
            this.paddle.setVelocityX(200);
        } else {
            this.paddle.setVelocityX(0);
        }

        // 检查游戏结束
        if (this.ball.y > this.scale.height) {
            this.lives--;
            this.livesText.setText(`Lives: ${this.lives}`);
            if (this.lives <= 0) {
                this.scene.start('gameOver');
            } else {
                this.ball.setPosition(this.scale.width / 2, this.scale.height / 2).setVelocity(-150, -150);
            }
        }
    }

    handlePaddleCollision(ball, paddle) {
        const diff = ball.x - paddle.x;
        const angle = diff / paddle.width * 0.5 * Math.PI;
        ball.setVelocity(Math.cos(angle) * 300, -Math.sin(angle) * 300);
    }

    handleBrickCollision(ball, brick) {
        this.score += 10;
        this.scoreText.setText(`Score: ${this.score}`);
        brick.destroy();
    }
}

class GameOverScene extends Phaser.Scene {
    constructor() {
        super("gameOver");
    }

    create() {
        this.add.text(this.scale.width / 2, this.scale.height / 2 - 50, 'Game Over', { fontSize: '64px', fill: '#fff' }).setOrigin(0.5);
        this.add.text(this.scale.width / 2, this.scale.height / 2 + 50, 'Press SPACE to Restart', { fontSize: '32px', fill: '#fff' }).setOrigin(0.5);

        this.input.keyboard.on('keydown-SPACE', () => {
            this.scene.start('breakout');
        });
    }
}

const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    },
    scene: [BreakoutGame, GameOverScene],
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    }
};

const game = new Phaser.Game(config);

// 监听窗口大小变化
window.addEventListener('resize', () => {
    game.scale.resize(window.innerWidth, window.innerHeight);
});