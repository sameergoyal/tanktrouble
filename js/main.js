var arena = null;
var context;
var pixelWidth = 800;
var pixelHeight = 600;
var borderStyle = "thick solid";
var player = {x:10,y:10,dx:1,dy:0};
var constants = {LEFT:37,UP:38,RIGHT:39,DOWN:40};

/*
Called on each pressed key
*/
function input(e)
{
	switch(e.keyCode)
	{
		case constants.UP:
		player.x+=player.dx;
		player.y+=player.dy;
		break;
		case constants.DOWN:

		break;
		case constants.RIGHT:

		break;
		case constants.LEFT:

		break;
	}
}

function draw()
{
	
}

function newGame()
{
	//TODO generate a grid & initial position of for now only 1 player.
	draw();
	document.addEventListener("keypress", input);
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