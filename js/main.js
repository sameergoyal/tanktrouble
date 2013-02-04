var arena = null;
var context;
var pixelWidth = 800;
var pixelHeight = 600;
var borderStyle = "thick solid";
var player = {x:30,y:30,oldAngle:0,newAngle:0};
var constants = {LEFT:37,UP:38,RIGHT:39,DOWN:40};
var speed = 2;
var angularSpeed = 2;
var playerTank;

paper.install(window);

/*
Called on each pressed key
*/
function input(e)
{
	switch(e.keyCode)
	{
		case constants.UP:
		player.x+=speed*Math.cos(player.newAngle*(Math.PI/180));
		player.y+=speed*Math.sin(player.newAngle*(Math.PI/180));
		break;
		case constants.DOWN:
		player.x-=speed*Math.cos(player.newAngle*(Math.PI/180));
		player.y-=speed*Math.sin(player.newAngle*(Math.PI/180));
		break;
		case constants.RIGHT:
		player.newAngle+=angularSpeed;
		break;
		case constants.LEFT:
		player.newAngle-=angularSpeed;
		break;
	}
}

function draw()
{
	playerTank.position = new Point(player.x,player.y);
	playerTank.rotate(player.newAngle-player.oldAngle);
	player.oldAngle = player.newAngle;
	document.getElementById('status').innerHTML = player.oldAngle;
}

function newGame()
{
	//TODO generate a grid & initial position of for now only 1 player.
	playerTank = new Path.Rectangle([player.x-20, player.y-10], [40, 20]);
    playerTank.strokeColor = 'black';
	document.addEventListener("keypress", input);
	view.onFrame = draw;
}

window.onload = function initGame()
{
	if(!arena)
	{
		arena = document.getElementById('arena');
	}
	paper.setup(arena);
	context = arena.getContext("2d");
	arena.width = pixelWidth;
	arena.height = pixelHeight;
	arena.style.border = borderStyle;
	newGame();
}