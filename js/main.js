var grid;
var player1, player2;
var bullets1, bullets2;
var control1 = {
	up: Phaser.Keyboard.UP,
	down: Phaser.Keyboard.DOWN,
	left: Phaser.Keyboard.LEFT,
	right: Phaser.Keyboard.RIGHT,
	fire: Phaser.Keyboard.SPACEBAR,
};
var control2 = {
	up: Phaser.Keyboard.E,
	down: Phaser.Keyboard.D,
	left: Phaser.Keyboard.S,
	right: Phaser.Keyboard.F,
	fire: Phaser.Keyboard.Q,
};
var maxHlines = 6;
var maxVlines = 8;
var arenaHeight = 600;
var arenaWidth = 800;
var wallDensity = 0.55;
var keyboard;
var tankSpeed = 100;
var rotationSpeed = 2;
var bulletDelay = 10;
var bulletSpeed = 200;
var bulletTTL = 20000;
var maxBullets = 5;
var bullets;
var isGameOver;

function getRandomBool()
{
	return Math.random() >= wallDensity;
}

function vBound(i) {
	return i === 0 || i === maxHlines;
}

function hBound(j) {
	return j === 0 || j === maxVlines;
}

function generateRandomGrid() {
	horGrid = new Array(maxHlines+1);
	verGrid = new Array(maxVlines+1);
	hLines = new Array(maxHlines+1);
	vLines = new Array(maxVlines+1);
	for (var i = 0; i < maxHlines+1; i++) {
		horGrid[i] = new Array(maxHlines+1);
		hLines[i] = new Array(maxHlines+1);
	};
	for(var i = 0; i < maxVlines+1; i++) {
		verGrid[i] = new Array(maxVlines+1);
		vLines[i] = new Array(maxVlines+1);
	}
	for(var i = 0; i < maxHlines+1; i++)
	{
		for(var j = 0; j < maxVlines+1; j++)
		{
			horGrid[i][j] = getRandomBool();
			verGrid[i][j] = getRandomBool();
			if(vBound(i)) horGrid[i][j] = 1;
			if(hBound(j)) verGrid[i][j] = 1;
		}
	};
}

function drawGrid() {
	widthPerRect = arenaWidth / maxVlines;
	heightPerRect = arenaHeight / maxHlines;
	for(var i = 0; i < maxHlines+1; i++)
	{
		for(var j = 0; j< maxVlines+1; j++)
		{
			if(horGrid[i][j] == true)
			{
				hLines[i][j] = grid.create(widthPerRect*j, (heightPerRect*i)-1, 'hLine');
				hLines[i][j].body.immovable = true;
			}
			if(verGrid[i][j] == true)
			{
				vLines[i][j] = grid.create((widthPerRect*j)-1, heightPerRect*i, 'vLine');
				vLines[i][j].body.immovable = true;
			}
		}
	}
}

function captureKeys(controls) {
	keyboard.addKeyCapture(controls.up);
	keyboard.addKeyCapture(controls.down);
	keyboard.addKeyCapture(controls.left);
	keyboard.addKeyCapture(controls.right);
	keyboard.addKeyCapture(controls.fire);
}

function createTank(player, x, y, sprite) {
	player = game.add.sprite(x, y, sprite);
	game.physics.arcade.enable(player);
	player.body.collideWorldBounds = true;
	player.anchor.set(0.5,0.5);
	return player;
}

function createBullet(x, y, angle, isPlayerOne) {
	var newBullet = bullets.create( x, y, 'bullet');
	newBullet.body.collideWorldBounds = true;
	newBullet.anchor.set(0.5,0.5);
	newBullet.body.velocity = game.physics.arcade.velocityFromAngle(angle, bulletSpeed);
	newBullet.angle = angle;
	newBullet.ttl = new Date().getTime() + bulletTTL;
	newBullet.isPlayerOne = isPlayerOne;
	isPlayerOne ? bullets1++ : bullets2++;
}

function bulletCollided(bullet, gridLine) {
	var angle = Phaser.Math.radToDeg(bullet.body.angle);
	if(bullet.body.touching.up) {
		angle = -angle
	}
	if(bullet.body.touching.down) {
		angle =  -angle;
	}
	if(bullet.body.touching.left) {
		angle = angle > 0 ? 180 - angle : -180 - angle;
	}
	if(bullet.body.touching.right) {
		angle = angle > 0 ? 180 - angle : -180 - angle;
	}
	bullet.body.velocity = game.physics.arcade.velocityFromAngle(angle, bulletSpeed);
}

function killBullets(bullet) {
	if(!bullet) return;

	currTime = new Date().getTime();
	if(currTime > bullet.ttl) {
		bullet.isPlayerOne ? bullets1-- : bullets2--;
		bullet.destroy();
	}
}

function gameOver(player, bullet) {
	isGameOver = true;
}

var game = new Phaser.Game(800, 600, Phaser.CANVAS, "arena", {
	preload: preload,
	create: create,
	update: update,
}, false, true);

function preload() {
	game.load.image('hLine', 'assets/hLine.jpg');
	game.load.image('vLine', 'assets/vLine.jpg');
	game.load.image('tank1', 'assets/redTank.jpg');
	game.load.image('tank2', 'assets/blueTank.jpg');
	game.load.image('bullet', 'assets/bullet.png');
}

function create() {
	game.stage.backgroundColor = "#FFFFFF";
	game.physics.startSystem(Phaser.Physics.ARCADE);

	generateRandomGrid();

	grid = game.add.group();
	grid.enableBody = true;

	bullets = game.add.group();
	bullets.enableBody = true;

	drawGrid();

	player1 = createTank(player1, 20, 20, 'tank1');
	player2 = createTank(player2, 780, 580, 'tank2');

	bullets1 = 0;
	bullets2 = 0;

	keyboard = game.input.keyboard;
	captureKeys(control1);
	captureKeys(control2);
	isGameOver = false;
}

function restart() {
	player1.destroy();
	player2.destroy();
	grid.destroy(true, true);
	bullets.destroy(true, true);

	generateRandomGrid();
	drawGrid();
	player1 = createTank(player1, 20, 20, 'tank1');
	player2 = createTank(player2, 780, 580, 'tank2');
	bullets1 = 0;
	bullets2 = 0;
	isGameOver = false;

}

function updatePlayerCollisions(player) {
	game.physics.arcade.collide(player, grid);
	game.physics.arcade.collide(player, bullets, gameOver);
}

function manualControlPosition(player, controls, playerBullets, isPlayerOne) {
	if(keyboard.isDown(controls.up)) {
		player.body.velocity = game.physics.arcade.velocityFromAngle(player.body.rotation, tankSpeed);
	} else if(keyboard.isDown(controls.down)) {
		player.body.velocity = game.physics.arcade.velocityFromAngle(player.body.rotation, -1*tankSpeed);
	}

	if(keyboard.isDown(controls.left)) {
		player.angle -= rotationSpeed;
	} else if(keyboard.isDown(controls.right)) {
		player.angle += rotationSpeed;
	}

	if(keyboard.isDown(controls.fire) && keyboard.justPressed(controls.fire, bulletDelay) && playerBullets < maxBullets ) {
		createBullet(player.position.x, player.position.y, player.body.rotation, isPlayerOne);
	}
}

function updatePlayerPosition(player, isPlayerOne) {
	player.body.velocity.x = 0;
	player.body.velocity.y = 0;
	player.body.angularVelocity = 0;

	var controls, playerBullets;
	if(isPlayerOne) {
		controls = control1;
		playerBullets = bullets1;
	} else {
		controls = control2;
		playerBullets = bullets2;
	}

	manualControlPosition(player, controls, playerBullets, isPlayerOne);
	// TODO: AIControlPosition(player, playerBullets, isPlayerOne)
}

function update() {
	game.physics.arcade.collide(bullets, grid, bulletCollided);
	updatePlayerCollisions(player1);
	updatePlayerCollisions(player2);

	if(isGameOver) {
		restart();
		return;
	}

	bullets.forEach(killBullets);
	updatePlayerPosition(player1, true);
	updatePlayerPosition(player2, false);
}
