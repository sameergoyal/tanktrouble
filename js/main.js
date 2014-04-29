var grid;
var gridShape;
var player;
var maxHlines = 6;
var maxVlines = 8;
var arenaHeight = 600;
var arenaWidth = 800;
var wallDensity = 0.55;
var cursors;
var keyboard;
var tankSpeed = 100;
var rotationSpeed = 2;
var bulletDelay = 10;
var fireKey = 32;
var bulletSpeed = 200;
var bulletTTL = 20000;
var maxBullets = 5;
var playerBullets;

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

function createTank() {
	player = game.add.sprite(20, 20, 'tank');
	game.physics.arcade.enable(player);
	player.body.collideWorldBounds = true;
	player.anchor.set(0.5,0.5);
}

function createBullet(x, y, angle) {
	var newBullet = playerBullets.create( x, y, 'bullet');
	newBullet.body.collideWorldBounds = true;
	newBullet.anchor.set(0.5,0.5);
	newBullet.body.velocity = game.physics.arcade.velocityFromAngle(angle, bulletSpeed);
	newBullet.angle = angle;
	newBullet.ttl = new Date().getTime() + bulletTTL;
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
		bullet.destroy();
	}
}

var game = new Phaser.Game(800, 600, Phaser.CANVAS, "arena", {
	preload: preload,
	create: create,
	update: update,
}, false, true);

function preload() {
	game.load.image('hLine', 'assets/hLine.jpg');
	game.load.image('vLine', 'assets/vLine.jpg');
	game.load.image('tank', 'assets/tank.jpg');
	game.load.image('bullet', 'assets/bullet.png');
}

function create() {
	game.stage.backgroundColor = "#FFFFFF";
	game.physics.startSystem(Phaser.Physics.ARCADE);

	generateRandomGrid();

	grid = game.add.group();
	grid.enableBody = true;

	playerBullets = game.add.group();
	playerBullets.enableBody = true;

	drawGrid();

	createTank();

	cursors = game.input.keyboard.createCursorKeys();
	keyboard = game.input.keyboard;
	keyboard.addKeyCapture(fireKey);
	player.bringToTop();
}

function update() {
	game.physics.arcade.collide(player, grid);
	game.physics.arcade.collide(playerBullets, grid, bulletCollided);

	player.body.velocity.x = 0;
	player.body.velocity.y = 0;
	player.body.angularVelocity = 0;

	if(cursors.up.isDown) {
		player.body.velocity = game.physics.arcade.velocityFromAngle(player.body.rotation, tankSpeed);;
	} else if(cursors.down.isDown) {
		player.body.velocity = game.physics.arcade.velocityFromAngle(player.body.rotation, -1*tankSpeed);;
	}

	if(cursors.left.isDown) {
		player.angle -= rotationSpeed;
	} else if(cursors.right.isDown) {
		player.angle += rotationSpeed;
	}

	playerBullets.forEach(killBullets);

	if(keyboard.isDown(fireKey) && keyboard.justPressed(fireKey, bulletDelay) && playerBullets.total < maxBullets ) {
		createBullet(player.position.x, player.position.y, player.body.rotation);
	}
}
