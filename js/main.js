var grid;
var game;
var player1, player2;
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
var maxHlines = 5;
var maxVlines = 8;
var arenaHeight = 500;
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
var dfsGrid;
var connectedList;

function getRandomBool()
{
	return Math.random() >= wallDensity;
}

function vBound(i) {
	return i <= 0 || i >= maxHlines;
}

function hBound(j) {
	return j <= 0 || j >= maxVlines;
}

function generateRandomGrid() {
	horGrid = new Array(maxHlines+1);
	verGrid = new Array(maxHlines+1);
	hLines = new Array(maxHlines+1);
	vLines = new Array(maxHlines+1);
	for (var i = 0; i < maxHlines+1; i++) {
		horGrid[i] = new Array(maxVlines+1);
		hLines[i] = new Array(maxVlines+1);
		verGrid[i] = new Array(maxVlines+1);
		vLines[i] = new Array(maxVlines+1);
	}
	for(var i = 0; i < maxHlines+1; i++)
	{
		for(var j = 0; j < maxVlines+1; j++)
		{
			horGrid[i][j] = getRandomBool();
			verGrid[i][j] = getRandomBool();
			if(vBound(i)) horGrid[i][j] = true;
			if(hBound(j)) verGrid[i][j] = true;
		}
	}
}

function dfs(i, j, k) {
	if(dfsGrid[i][j] !== -1) return;

	dfsGrid[i][j] = k;
	if(!vBound(i+1) && !horGrid[i+1][j]) {
		dfs(i+1,j,k);
	}
	if(!vBound(i) && !horGrid[i][j]) {
		dfs(i-1,j,k);
	}
	if(!hBound(j+1) && !verGrid[i][j+1]) {
		dfs(i, j+1, k);
	}
	if(!hBound(j) && !verGrid[i][j]) {
		dfs(i, j-1, k);
	}
}

function ddfs(i,j) {
	if(dfsGrid[i][j] === -1) return;

	dfsGrid[i][j] = -1;
	if(!vBound(i+1)) {
		if(horGrid[i+1][j] && connectedList.indexOf(dfsGrid[i+1][j]) === -1) {
			horGrid[i+1][j] = false;
			connectedList.push(dfsGrid[i+1][j]);
		}
		ddfs(i+1,j);
	}
	if(!vBound(i)) {
		if(horGrid[i][j] && connectedList.indexOf(dfsGrid[i-1][j]) === -1) {
			horGrid[i][j] = false;
			connectedList.push(dfsGrid[i-1][j]);
		}
		ddfs(i-1,j);
	}
	if(!hBound(j+1)) {
		if(verGrid[i][j+1] && connectedList.indexOf(dfsGrid[i][j+1]) === -1) {
			verGrid[i][j+1] = false;
			connectedList.push(dfsGrid[i][j+1]);
		}
		ddfs(i, j+1);
	}
	if(!hBound(j)) {
		if(verGrid[i][j] && connectedList.indexOf(dfsGrid[i][j-1]) === -1) {
			verGrid[i][j] = false;
			connectedList.push(dfsGrid[i][j-1]);
		}
		ddfs(i, j-1);
	}
}

function checkConnectivity() {
	dfsGrid = new Array(maxHlines);
	for(var i=0; i < maxHlines; i++)
		dfsGrid[i] = new Array(maxVlines);
	for(var i=0; i < maxHlines; i++) {
		for(var j=0; j < maxVlines; j++) {
			dfsGrid[i][j] = -1;
		}
	}
	var components = 0;
	for(var i=0; i < maxHlines; i++) {
		for(var j=0; j < maxVlines; j++) {
			if(dfsGrid[i][j] === -1) {
				dfs(i,j,components);
				components++;
			}
		}
	}
	return components === 1;
}

function ensureConnectivity() {
	if(checkConnectivity()) return;
	connectedList = [];
	connectedList.push(-1);
	connectedList.push(0);
	ddfs(0,0);
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
				hLines[i][j] = grid.create(widthPerRect*j, (heightPerRect*i), 'hLine');
				hLines[i][j].body.immovable = true;
			}
			if(verGrid[i][j] == true)
			{
				vLines[i][j] = grid.create((widthPerRect*j), heightPerRect*i, 'vLine');
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

function createTank(player, x, y, sprite, isPlayerOne) {
	player = game.add.sprite(x, y, sprite);
	game.physics.arcade.enable(player);
	player.body.collideWorldBounds = true;
	player.anchor.set(0.5,0.5);
	player.isPlayerOne = isPlayerOne;
	if(!isPlayerOne) player.angle = 180;
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
	isPlayerOne ? player1.bullets++ : player2.bullets++;
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
		bullet.isPlayerOne ? player1.bullets-- : player2.bullets--;
		bullet.destroy();
	}
}

function displayScore(isPlayerOne) {
	document.getElementById('restartScreen').style.display = 'block';
	document.getElementById('score1').innerHTML = player1.score;
	document.getElementById('score2').innerHTML = player2.score;
	document.getElementById('winner').innerHTML = isPlayerOne ? 'II' : 'I';
}

function attachHandlers() {
	document.getElementById('restart').addEventListener('click', restart);
	document.body.addEventListener('keypress',function(e){
		if(e.which === 13 && isGameOver) {
			restart();
		}
	});
}

function stopPlayer(player) {
	player.body.velocity.x = 0;
	player.body.velocity.y = 0;
	player.body.angularVelocity = 0;
}

function gameOver(player, bullet) {
	stopPlayer(player1);
	stopPlayer(player2);
	bullets.exists = false;
	isGameOver = true;
	player.isPlayerOne ? player2.score++ : player1.score++;
	displayScore(player.isPlayerOne);
	attachHandlers();
}

function startGame() {
	document.getElementById('startScreen').style.display = "none";
	game = new Phaser.Game(arenaWidth+2, arenaHeight+2, Phaser.CANVAS, "arena", {
		preload: preload,
		create: create,
		update: update,
	}, false, true);
}

startGame();

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
	ensureConnectivity();

	grid = game.add.group();
	grid.enableBody = true;

	bullets = game.add.group();
	bullets.enableBody = true;

	drawGrid();

	player1 = createTank(player1, 20, 20, 'tank1', true);
	player2 = createTank(player2, 780, 480, 'tank2', false);

	player1.bullets = 0;
	player2.bullets = 0;

	player1.score = 0;
	player2.score = 0;

	player1.controls = control1;
	player2.controls = control2;

	keyboard = game.input.keyboard;
	captureKeys(control1);
	captureKeys(control2);
	isGameOver = false;
}

function restart() {
	document.getElementById('restartScreen').style.display = 'none';
	var score1 = player1.score;
	var score2 = player2.score;
	player1.destroy();
	player2.destroy();
	grid.destroy(true, true);
	bullets.destroy(true, true);

	generateRandomGrid();
	ensureConnectivity();
	drawGrid();
	player1 = createTank(player1, 20, 20, 'tank1', true);
	player2 = createTank(player2, 780, 480, 'tank2', false);
	player1.controls = control1;
	player2.controls = control2;
	player1.bullets = 0;
	player2.bullets = 0;
	player1.score = score1;
	player2.score = score2;
	bullets.exists = true;
	isGameOver = false;
}

function updatePlayerCollisions(player) {
	game.physics.arcade.collide(player, grid);
	game.physics.arcade.collide(player, bullets, gameOver);
}

function manualControlPosition(player, controls, playerBullets) {
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
		createBullet(player.position.x, player.position.y, player.body.rotation, player.isPlayerOne);
	}
}

function updatePlayerPosition(player) {
	stopPlayer(player);

	manualControlPosition(player, player.controls, player.bullets, player.isPlayerOne);
	// TODO: AIControlPosition(player, player.bullets, player.isPlayerOne)
}

function update() {
	if(isGameOver) {
		return;
	}

	updatePlayerPosition(player1);
	updatePlayerPosition(player2);
	bullets.forEach(killBullets);
	game.physics.arcade.collide(bullets, grid, bulletCollided);
	updatePlayerCollisions(player1);
	updatePlayerCollisions(player2);
}
