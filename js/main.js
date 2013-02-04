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
var fwd = false;
var lft = false;
var bck = false;
var rgt = false;

paper.install(window);

function press(e)
{
	switch(e.keyCode)
	{
		case constants.UP:
		if(!bck)
			fwd = true;
		break;
		case constants.DOWN:
		if(!fwd)
			bck = true;
		break;
		case constants.RIGHT:
		if(!lft)
			rgt = true;
		break;
		case constants.LEFT:
		if(!rgt)
			lft = true;
		break;
	}
}

function release(e)
{
	switch(e.keyCode)
	{
		case constants.UP:
		fwd = false;
		break;
		case constants.DOWN:
		bck = false;
		break;
		case constants.RIGHT:
		rgt = false;
		break;
		case constants.LEFT:
		lft = false;
		break;
	}
}


function draw()
{
	if(fwd)
	{
		player.x+=speed*Math.cos(player.newAngle*(Math.PI/180));
		player.y+=speed*Math.sin(player.newAngle*(Math.PI/180));
	}
	else if(bck)
	{
		player.x-=speed*Math.cos(player.newAngle*(Math.PI/180));
		player.y-=speed*Math.sin(player.newAngle*(Math.PI/180));
	}
	if(rgt)
	{
		player.newAngle+=angularSpeed;
	}
	else if(lft)
	{
		player.newAngle-=angularSpeed;
	}
	playerTank.position = new Point(player.x,player.y);
	playerTank.rotate(player.newAngle-player.oldAngle);
	player.oldAngle = player.newAngle;
}

function newGame()
{
	//TODO generate a grid & initial position of for now only 1 player.
	playerTank = new Path.Rectangle([player.x-20, player.y-10], [40, 20]);
    playerTank.strokeColor = 'black';
	document.addEventListener("keydown", press);
	document.addEventListener("keyup", release);
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