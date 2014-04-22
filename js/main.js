var grid;
var gridShape;
var maxHlines = 6;
var maxVlines = 8;
var arenaHeight = 600;
var arenaWidth = 800;
var wallDensity = 0.55;

function getRandomBool()
{
	return Math.random() >= wallDensity;
}

function generateRandomGrid() {
	horGrid = new Array(maxHlines-1);
	verGrid = new Array(maxVlines-1);
	hLines = new Array(maxHlines-1);
	vLines = new Array(maxVlines-1);
	for (var i = 0; i < maxHlines; i++) {
		horGrid[i] = new Array(maxHlines-1);
		hLines[i] = new Array(maxHlines-1);
	};
	for(var i = 0; i < maxVlines; i++) {
		verGrid[i] = new Array(maxVlines-1);
		vLines[i] = new Array(maxVlines-1);
	}
	for(var i = 0; i < maxHlines; i++)
	{
		for(var j = 0; j < maxVlines ; j++)
		{
			horGrid[i][j] = getRandomBool();
			verGrid[i][j] = getRandomBool();
		}
	};
}

function drawGrid() {
	widthPerRect = arenaWidth / maxVlines;
	heightPerRect = arenaHeight / maxHlines;
	for(var i = 0; i < maxHlines; i++)
	{
		for(var j = 0; j< maxVlines; j++)
		{
			if(horGrid[i][j] == true)
			{
				gridShape.drawRect(widthPerRect*j, heightPerRect*(i+1), widthPerRect, 2);
			}
			if(verGrid[i][j] == true)
			{
				gridShape.drawRect(widthPerRect*(j+1), heightPerRect*i, 2, heightPerRect);
			}
		}
	}
}

var game = new Phaser.Game(800, 600, Phaser.CANVAS, "arena", {
	create: create,
	update: update,
}, false, true);

function create() {
	game.stage.backgroundColor = "#FFFFFF";
	game.physics.startSystem(Phaser.Physics.ARCADE);

	generateRandomGrid();

	grid = game.add.group();
	grid.enableBody = true;
	gridShape = game.add.graphics(0,0);
	gridShape.lineStyle(1, 0x000000, 1);
	gridShape.beginFill(0x000000, 1)

	drawGrid();

	grid.add(gridShape);

}

function update() {

}
