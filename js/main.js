var arena = null;
var context;
var pixelWidth = 800;
var pixelHeight = 600;
var borderStyle = "thick solid";
var player = {x:10,y:10,angle:0};
var constants = {LEFT:37,UP:38,RIGHT:39,DOWN:40};
var speed = 2;
var angularSpeed = 0.1;
/*
Called on each pressed key
*/
function input(e)
{
	switch(e.keyCode)
	{
		case constants.UP:
		player.x+=speed*Math.cos(player.angle);
		player.y+=speed*Math.sin(player.angle);
		break;
		case constants.DOWN:
		player.x-=speed*Math.cos(player.angle);
		player.y-=speed*Math.sin(player.angle);
		break;
		case constants.RIGHT:
		player.angle+=angularSpeed;
		break;
		case constants.LEFT:
		player.angle-=angularSpeed;
		break;
	}
}

function draw()
{
	context.clearRect(0,0,pixelWidth,pixelHeight);
	context.fillRect(player.x-5,player.y-5,10,10);
}

function newGame()
{
	//TODO generate a grid & initial position of for now only 1 player.
	document.addEventListener("keypress", input);
	setInterval(draw,10);
}

function initGame()
{
	if(!arena)
	{
		arena = document.createElement("canvas");
		arena.id = "arena";
		document.body.appendChild(arena);
	}
	context = arena.getContext("2d");
	arena.width = pixelWidth;
	arena.height = pixelHeight;
	arena.style.border = borderStyle;
	newGame();
}